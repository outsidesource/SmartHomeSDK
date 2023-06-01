import { RequestHandler } from 'ask-sdk-runtime'
import { InterfaceCommandResponseBuilder } from '../../../directives/interfaceCommand/InterfaceCommandResponseBuilder'
import { Response } from '../../../response/Response'
import { ErrorResponsePayload } from '../../../response/payloads/ErrorResponsePayload'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for interface commands.
 */
export abstract class InterfaceCommandRequestHandler implements RequestHandler<
HandlerInput<unknown, InterfaceCommandResponseBuilder>,
Response<unknown | ErrorResponsePayload>
> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, InterfaceCommandResponseBuilder>): boolean | Promise<boolean> {
    return true
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<unknown, InterfaceCommandResponseBuilder>): Response<unknown | ErrorResponsePayload> | Promise<Response<unknown | ErrorResponsePayload>>
}
