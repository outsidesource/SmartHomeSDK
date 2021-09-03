import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../../dispatcher/request/handler/LambdaContext'
import {
  Request,
  RequestPayload
} from '../../dispatcher/request/handler/Request'
import { AcceptGrantRequestPayload } from './AcceptGrantRequestPayload'
import { AcceptGrantResponseBuilder } from './AcceptGrantResponseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is an AcceptGrant.
 */
export const AcceptGrantHandlerInputFactory: HandlerInputFactory<
  AcceptGrantRequestPayload,
  AcceptGrantResponseBuilder
> = {
  canCreate(request: Request<RequestPayload>, context?: LambdaContext) {
    return isAcceptGrantRequest(request)
  },
  create(
    request: Request<AcceptGrantRequestPayload>,
    context?: LambdaContext
  ):
    | HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>
    | undefined {
    return {
      request,
      context,
      responseBuilder: new AcceptGrantResponseBuilder(request)
    }
  }
}

/**
 * Determines whether a given request is an AcceptGrant request.
 * @param request The request to examine.
 * @returns True if the request payload is a {@link AcceptGrantRequestPayload}; otherwise, false.
 */
export function isAcceptGrantRequest(
  request: Request<RequestPayload>
): request is Request<AcceptGrantRequestPayload> {
  return (
    request.directive.header.namespace === 'Alexa.Authorization' &&
    request.directive.header.name === 'AcceptGrant' &&
    request.directive.header.payloadVersion === '3'
  )
}
