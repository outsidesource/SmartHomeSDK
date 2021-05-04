import { Request, RequestPayload } from '../../dispatcher/request/handler/Request'
import { Response, ResponsePayload } from '../Response'
import { ResponseBuilder } from './ResponseBuilder'

const succeedName = 'AcceptGrant.Response'
const failName = 'ErrorResponse'

/**
 * Represents a {@link ResponseBuilder} for the AcceptGrant directive.
 */
export class AcceptGrantResponseBuilder implements ResponseBuilder {
  private request: Request<RequestPayload>
  private name: string = succeedName
  private payload: ResponsePayload = undefined

  constructor(request: Request<RequestPayload>) {
    this.request = request
  }

  succeed(): this {
    this.name = succeedName
    this.payload = {}
    return this
  }

  fail(type: string, message: string): this {
    this.name = failName
    this.payload = { type, message, }
    return this
  }

  getResponse(): Response<ResponsePayload> {
    return {
      event: {
        header: {
          namespace: 'Alexa.Authorization',
          name: this.name,
          payloadVersion: '3',
          messageId: this.request.directive.header.messageId,
        },
        payload: this.payload
      }
    }
  }
}
