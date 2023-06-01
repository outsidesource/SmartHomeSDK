import { Context } from 'aws-lambda'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { Request } from '../../dispatcher/request/handler/Request'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { DiscoveryRequestPayload } from './DiscoveryRequestPayload'
import { DiscoveryResponseBuilder } from './DiscoveryResponseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is a Discovery.
 */
export const DiscoveryHandlerInputFactory: HandlerInputFactory<unknown, DiscoveryResponseBuilder> = {
  canCreate (request: Request<unknown>, context: Context): boolean {
    return isDiscoveryRequest(request)
  },
  create (request: Request<unknown>, context: Context): HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder> | undefined {
    if (!isDiscoveryRequest(request)) {
      return undefined
    }

    return {
      request,
      context,
      responseBuilder: new DiscoveryResponseBuilder(request)
    }
  }
}

/**
 * Determines whether a given request is a Discovery request.
 * @param request The request to examine.
 * @returns True if the request payload is a {@link DiscoveryRequestPayload}; otherwise, false.
 */
export function isDiscoveryRequest (request: Request<unknown>): request is Request<DiscoveryRequestPayload> {
  return request.directive.header.namespace === 'Alexa.Discovery' &&
    request.directive.header.name === 'Discover' &&
    request.directive.header.payloadVersion === '3'
}
