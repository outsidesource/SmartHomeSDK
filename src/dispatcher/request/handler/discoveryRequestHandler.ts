import { RequestHandler } from 'ask-sdk-runtime'
import { isDiscoveryRequest } from '../../../directives/discovery/handlerInputFactory'
import { DiscoveryResponseBuilder } from '../../../directives/discovery/responseBuilder'
import { DiscoveryRequestPayload } from '../../../directives/discovery/types'
import { DiscoveryPayload } from '../../../discovery/payload'
import { ErrorResponsePayload } from '../../../response/payloads/types'
import { Response } from '../../../response/types'
import { HandlerInput } from './types'

/**
 * A base implementation for user-created handler logic for discovery requests.
 */
export abstract class DiscoveryRequestHandler implements RequestHandler<HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>, Response<DiscoveryPayload | ErrorResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, DiscoveryResponseBuilder>): boolean | Promise<boolean> {
    return isDiscoveryRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>): Response<DiscoveryPayload | ErrorResponsePayload> | Promise<Response<DiscoveryPayload | ErrorResponsePayload>>
}
