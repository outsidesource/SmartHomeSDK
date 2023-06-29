import { isReportStateRequest } from '../../../directives/reportState/handlerInputFactory'
import { ReportStateResponseBuilder } from '../../../directives/reportState/responseBuilder'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../../responses/payloads/types'
import { Response } from '../../../responses/types'
import { SmartHomeSkillRequestHandler } from './baseRequestHandler'
import { HandlerInput } from './types'

/**
 * A base implementation for user-created handler logic for report state requests.
 */
export abstract class ReportStateRequestHandler implements SmartHomeSkillRequestHandler<unknown, ReportStateResponseBuilder, EmptyResponsePayload | ErrorResponsePayload> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, ReportStateResponseBuilder, unknown>): boolean | Promise<boolean> {
    return isReportStateRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<unknown, ReportStateResponseBuilder, unknown>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>>
}
