import { RequestHandler } from 'ask-sdk-runtime'
import { isDiscoveryRequest } from '../../../directives/discovery/DiscoveryHandlerInputFactory'
import { DiscoveryRequestPayload } from '../../../directives/discovery/DiscoveryRequestPayload'
import { DiscoveryResponseBuilder } from '../../../directives/discovery/factory/DiscoveryResponseBuilder'
import { Response, ResponsePayload } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'
import { RequestPayload } from './Request'

/**
 * A base implementation for user-created handler logic for discovery requests.
 */
export abstract class DiscoveryRequestHandler
  implements
    RequestHandler<
      HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>,
      Response<ResponsePayload>
    > {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(
    input: HandlerInput<RequestPayload, DiscoveryResponseBuilder>
  ): boolean | Promise<boolean> {
    return isDiscoveryRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>
  ): Response<ResponsePayload> | Promise<Response<ResponsePayload>>
}
