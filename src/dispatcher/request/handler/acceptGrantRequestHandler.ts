import { RequestHandler } from 'ask-sdk-runtime'
import { isAcceptGrantRequest } from '../../../directives/acceptGrant/handlerInputFactory'
import { AcceptGrantResponseBuilder } from '../../../directives/acceptGrant/responseBuilder'
import { AcceptGrantRequestPayload } from '../../../directives/acceptGrant/types'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../../response/payloads/types'
import { Response } from '../../../response/types'
import { HandlerInput } from './types'

/**
 * A base implementation for user-created handler logic for accept grant requests.
 */
export abstract class AcceptGrantRequestHandler implements RequestHandler<HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>, Response<EmptyResponsePayload | ErrorResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, AcceptGrantResponseBuilder>): boolean | Promise<boolean> {
    return isAcceptGrantRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>>
}
