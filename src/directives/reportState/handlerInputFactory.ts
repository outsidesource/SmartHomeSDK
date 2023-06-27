import { Context } from 'aws-lambda'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput, Request } from '../../dispatcher/request/handler/types'
import { EmptyResponsePayload } from '../../response/payloads/types'
import { ReportStateResponseBuilder } from './responseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is a ReportState.
 */
export const ReportStateHandlerInputFactory: HandlerInputFactory<unknown, ReportStateResponseBuilder, EmptyResponsePayload> = {
  canCreate (request: Request<unknown>, context: Context): boolean {
    return isReportStateRequest(request)
  },

  create (request: Request<unknown>, context: Context): HandlerInput<unknown, ReportStateResponseBuilder, EmptyResponsePayload> | undefined {
    if (!isReportStateRequest(request)) {
      return undefined
    }

    return {
      request,
      context,
      responseBuilder: new ReportStateResponseBuilder(request)
    }
  }
}

/**
 * Determines whether a given request is a ReportState request.
 * @param request The request to examine.
 * @returns True if the request is a ReportState; otherwise, false.
 */
export function isReportStateRequest (request: Request<unknown>): boolean {
  const endpointId = request.directive.endpoint?.endpointId
  return request.directive.header.namespace === 'Alexa' &&
    request.directive.header.name === 'ReportState' &&
    request.directive.header.payloadVersion === '3' &&
    endpointId !== undefined && endpointId !== ''
}
