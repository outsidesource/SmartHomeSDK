import { RequestHandler } from 'ask-sdk-runtime'
import { InterfaceCommandResponseBuilder } from '../../../directives/interfaceCommand/InterfaceCommandResponseBuilder'
import { Response, ResponsePayload } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for interface commands.
 */
export abstract class InterfaceCommandRequestHandler
  implements
    RequestHandler<
      HandlerInput<InterfaceCommandResponseBuilder>,
      Response<ResponsePayload>
    > {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(
    input: HandlerInput<InterfaceCommandResponseBuilder>
  ): boolean | Promise<boolean> {
    return true
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<InterfaceCommandResponseBuilder>
  ): Response<ResponsePayload> | Promise<Response<ResponsePayload>>
}
