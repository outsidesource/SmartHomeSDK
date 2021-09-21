import { RequestHandler } from 'ask-sdk-runtime'
import { isReportStateRequest } from '../../../directives/reportState/ReportStateHandlerInputFactory'
import { ReportStateResponseBuilder } from '../../../directives/reportState/ReportStateResponseBuilder'
import { EmptyResponsePayload } from '../../../response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../../../response/payloads/ErrorResponsePayload'
import { Response } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for report state requests.
 */
export abstract class ReportStateRequestHandler
  implements
    RequestHandler<
      HandlerInput<unknown, ReportStateResponseBuilder>,
      Response<EmptyResponsePayload | ErrorResponsePayload>
    > {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(
    input: HandlerInput<unknown, ReportStateResponseBuilder>
  ): boolean | Promise<boolean> {
    return isReportStateRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<unknown, ReportStateResponseBuilder>
  ):
    | Response<EmptyResponsePayload | ErrorResponsePayload>
    | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>>
}
