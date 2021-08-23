import { RequestHandler } from 'ask-sdk-runtime'
import { isAcceptGrantRequest } from '../../../directives/acceptGrant/AcceptGrantHandlerInputFactory'
import { AcceptGrantResponseBuilder } from '../../../directives/acceptGrant/AcceptGrantResponseBuilder'
import { Response, ResponsePayload } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for accept grant requests.
 */
export abstract class AcceptGrantRequestHandler implements RequestHandler<HandlerInput<AcceptGrantResponseBuilder>, Response<ResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(input: HandlerInput<AcceptGrantResponseBuilder>): boolean | Promise<boolean> {
    return isAcceptGrantRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(input: HandlerInput<AcceptGrantResponseBuilder>): Response<ResponsePayload> | Promise<Response<ResponsePayload>>
}
