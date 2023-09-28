import { isDiscoveryRequest } from '../../../directives/discovery/handlerInputFactory'
import { type DiscoveryResponseBuilder } from '../../../directives/discovery/responseBuilder'
import { type DiscoveryRequestPayload } from '../../../directives/discovery/types'
import { type DiscoveryPayload } from '../../../discovery/payload'
import { type ErrorResponsePayload } from '../../../responses/payloads/types'
import { type Response } from '../../../responses/types'
import { type SmartHomeSkillRequestHandler } from './baseRequestHandler'
import { type HandlerInput } from './types'

/**
 * A base implementation for user-created handler logic for discovery requests.
 */
export abstract class DiscoveryRequestHandler implements SmartHomeSkillRequestHandler<DiscoveryRequestPayload, DiscoveryResponseBuilder, DiscoveryPayload | ErrorResponsePayload> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, DiscoveryResponseBuilder, DiscoveryPayload>): boolean | Promise<boolean> {
    return isDiscoveryRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder, DiscoveryPayload>): Response<DiscoveryPayload | ErrorResponsePayload> | Promise<Response<DiscoveryPayload | ErrorResponsePayload>>
}
