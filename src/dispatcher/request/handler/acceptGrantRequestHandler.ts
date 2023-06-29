import { isAcceptGrantRequest } from '../../../directives/acceptGrant/handlerInputFactory'
import { AcceptGrantResponseBuilder } from '../../../directives/acceptGrant/responseBuilder'
import { AcceptGrantRequestPayload } from '../../../directives/acceptGrant/types'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../../responses/payloads/types'
import { Response } from '../../../responses/types'
import { SmartHomeSkillRequestHandler } from './baseRequestHandler'
import { HandlerInput } from './types'

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
