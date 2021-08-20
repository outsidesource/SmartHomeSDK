import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../../dispatcher/request/handler/LambdaContext'
import { Request, RequestPayload } from '../../dispatcher/request/handler/Request'
import { ReportStateResponseBuilder } from './ReportStateResponseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is a ReportState.
 */
export const ReportStateHandlerInputFactory: HandlerInputFactory = {
  canCreate(request: Request<RequestPayload>, context?: LambdaContext) {
    return isReportStateRequest(request)
  },
  create(request: Request<RequestPayload>, context?: LambdaContext): HandlerInput | undefined {
    if (!isReportStateRequest(request)) {
      return undefined
    }

    return {
      request,
      context,
      responseBuilder: new ReportStateResponseBuilder(request),
    }
  }
}

/**
 * Determines whether a given request is a ReportState request.
 * @param request The request to examine.
 * @returns True if the request is a ReportState; otherwise, false.
 */
export function isReportStateRequest(request: Request<RequestPayload>): boolean {
  return request.directive.header.namespace === 'Alexa'
    && request.directive.header.name === 'ReportState'
    && request.directive.header.payloadVersion === '3'
    && !!request.directive.endpoint?.endpointId
}
