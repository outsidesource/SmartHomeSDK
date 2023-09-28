import { isAcceptGrantRequest } from '../../../directives/acceptGrant/handlerInputFactory'
import { type AcceptGrantResponseBuilder } from '../../../directives/acceptGrant/responseBuilder'
import { type AcceptGrantRequestPayload } from '../../../directives/acceptGrant/types'
import { type EmptyResponsePayload, type ErrorResponsePayload } from '../../../responses/payloads/types'
import { type Response } from '../../../responses/types'
import { type SmartHomeSkillRequestHandler } from './baseRequestHandler'
import { type HandlerInput } from './types'

/**
 * A base implementation for user-created handler logic for accept grant requests.
 */
export abstract class AcceptGrantRequestHandler implements SmartHomeSkillRequestHandler<AcceptGrantRequestPayload, AcceptGrantResponseBuilder, EmptyResponsePayload | ErrorResponsePayload> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, AcceptGrantResponseBuilder, EmptyResponsePayload>): boolean | Promise<boolean> {
    return isAcceptGrantRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder, EmptyResponsePayload>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>>
}
