import { RequestHandler } from 'ask-sdk-runtime'
import { isDiscoveryRequest } from '../../../directives/discovery/DiscoveryHandlerInputFactory'
import { DiscoveryRequestPayload } from '../../../directives/discovery/DiscoveryRequestPayload'
import { DiscoveryResponseBuilder } from '../../../directives/discovery/DiscoveryResponseBuilder'
import { DiscoveryPayload } from '../../../directives/discovery/factory/DiscoveryPayload'
import { Response } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for discovery requests.
 */
export abstract class DiscoveryRequestHandler
  implements
    RequestHandler<
      HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>,
      Response<DiscoveryPayload>
    > {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(
    input: HandlerInput<unknown, DiscoveryResponseBuilder>
  ): boolean | Promise<boolean> {
    return isDiscoveryRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>
  ): Response<DiscoveryPayload> | Promise<Response<DiscoveryPayload>>
}
