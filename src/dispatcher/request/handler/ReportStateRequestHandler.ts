import { RequestHandler } from 'ask-sdk-runtime'
import { isReportStateRequest } from '../../../directives/reportState/ReportStateHandlerInputFactory'
import { ReportStateResponseBuilder } from '../../../directives/reportState/ReportStateResponseBuilder'
import { Response, ResponsePayload } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'
import { RequestPayload } from './Request'

/**
 * A base implementation for user-created handler logic for report state requests.
 */
export abstract class ReportStateRequestHandler
  implements
    RequestHandler<
      HandlerInput<RequestPayload, ReportStateResponseBuilder>,
      Response<ResponsePayload>
    > {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(
    input: HandlerInput<RequestPayload, ReportStateResponseBuilder>
  ): boolean | Promise<boolean> {
    return isReportStateRequest(input.request)
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<RequestPayload, ReportStateResponseBuilder>
  ): Response<ResponsePayload> | Promise<Response<ResponsePayload>>
}
