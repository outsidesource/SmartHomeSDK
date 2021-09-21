import { RequestHandler } from 'ask-sdk-runtime'
import { isAcceptGrantRequest } from '../../../directives/acceptGrant/AcceptGrantHandlerInputFactory'
import { AcceptGrantRequestPayload } from '../../../directives/acceptGrant/AcceptGrantRequestPayload'
import { AcceptGrantResponseBuilder } from '../../../directives/acceptGrant/AcceptGrantResponseBuilder'
import { EmptyResponsePayload } from '../../../response/payloads/EmptyResponsePayload'
import { Response } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for accept grant requests.
 */
export abstract class AcceptGrantRequestHandler
  implements
    RequestHandler<
      HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>,
      Response<EmptyResponsePayload>
    > {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(
    input: HandlerInput<unknown, AcceptGrantResponseBuilder>
  ): boolean | Promise<boolean> {
    return isAcceptGrantRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>
  ): Response<EmptyResponsePayload> | Promise<Response<EmptyResponsePayload>>
}
