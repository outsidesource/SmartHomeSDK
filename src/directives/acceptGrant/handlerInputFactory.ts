import { Context } from 'aws-lambda'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput, Request } from '../../dispatcher/request/handler/types'
import { EmptyResponsePayload } from '../../responses/payloads/types'
import { AcceptGrantResponseBuilder } from './responseBuilder'
import { AcceptGrantRequestPayload } from './types'

/**
 * A factory for {@link HandlerInput} when the request is an AcceptGrant.
 */
export const AcceptGrantHandlerInputFactory: HandlerInputFactory<unknown, AcceptGrantResponseBuilder, EmptyResponsePayload> = {
  canCreate (request: Request<unknown>, context: Context): boolean {
    return isAcceptGrantRequest(request)
  },

  create (request: Request<unknown>, context: Context): HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder, EmptyResponsePayload> | undefined {
    if (!isAcceptGrantRequest(request)) {
      return undefined
    }

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
export function isAcceptGrantRequest (request: Request<unknown>): request is Request<AcceptGrantRequestPayload> {
  return request.directive.header.namespace === 'Alexa.Authorization' &&
    request.directive.header.name === 'AcceptGrant' &&
    request.directive.header.payloadVersion === '3'
}
