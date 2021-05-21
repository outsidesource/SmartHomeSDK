import { RequestPayload } from '../../dispatcher/request/handler/Request'

/**
 * A payload representing a Discovery request.
 * {@see https://developer.amazon.com/en-US/docs/alexa/device-apis/alexa-discovery.html}
 */
export interface DiscoveryRequestPayload extends RequestPayload {
  scope: {
    /** Should always be "BearerToken". */
    type: 'BearerToken',

    /** An OAuth2 bearer token. */
    token: string,
  },
}
