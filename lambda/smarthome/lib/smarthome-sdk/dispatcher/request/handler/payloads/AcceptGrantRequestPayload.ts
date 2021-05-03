import { Request, RequestPayload } from '../Request'

export interface AcceptGrantPayload {
  grant: {
    type: string
    code: string
  }
  grantee: {
    type: string
    token: string
  }
}

export function isAcceptGrant(request: Request<RequestPayload>): request is Request<AcceptGrantPayload> {
  return request.directive.header.namespace === 'Alexa.Authorization'
    && request.directive.header.name === 'AcceptGrant'
    && request.directive.header.payloadVersion === '3'
}
