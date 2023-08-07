import { Context } from 'aws-lambda'
import { AttributesManager } from '../../attributes/types'
import { DiscoveryPayload } from '../../discovery/payload'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput, Request } from '../../dispatcher/request/handler/types'
import { DiscoveryResponseBuilder } from './responseBuilder'
import { DiscoveryRequestPayload } from './types'

/**
 * A factory for {@link HandlerInput} when the request is a Discovery.
 */
export const DiscoveryHandlerInputFactory: HandlerInputFactory<unknown, DiscoveryResponseBuilder, DiscoveryPayload> = {
  canCreate (request: Request<unknown>, context: Context): boolean {
    return isDiscoveryRequest(request)
  },

  create (request: Request<unknown>, context: Context, attributesManager: AttributesManager): HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder, DiscoveryPayload> | undefined {
    if (!isDiscoveryRequest(request)) {
      return undefined
    }

    return {
      request,
      context,
      attributesManager,
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
