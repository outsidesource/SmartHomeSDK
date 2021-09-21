import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../../dispatcher/request/handler/LambdaContext'
import { Request } from '../../dispatcher/request/handler/Request'
import { DiscoveryRequestPayload } from './DiscoveryRequestPayload'
import { DiscoveryResponseBuilder } from './DiscoveryResponseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is a Discovery.
 */
export const DiscoveryHandlerInputFactory: HandlerInputFactory<
  DiscoveryRequestPayload,
  DiscoveryResponseBuilder
> = {
  canCreate(request: Request<unknown>, context?: LambdaContext) {
    return isDiscoveryRequest(request)
  },
  create(
    request: Request<DiscoveryRequestPayload>,
    context?: LambdaContext
  ):
    | HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>
    | undefined {
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
export function isDiscoveryRequest(
  request: Request<unknown>
): request is Request<DiscoveryRequestPayload> {
  return (
    request.directive.header.namespace === 'Alexa.Discovery' &&
    request.directive.header.name === 'Discover' &&
    request.directive.header.payloadVersion === '3'
  )
}
