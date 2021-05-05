import { Request } from '../../dispatcher/request/handler/Request'
import { EmptyResponsePayload } from '../../response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../../response/payloads/ErrorResponsePayload'
import { Response } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'
import { AcceptGrantRequestPayload } from './AcceptGrantRequestPayload'

const namespace = 'Alexa.Authorization'
const succeedName = 'AcceptGrant.Response'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for the AcceptGrant directive.
 */
export class AcceptGrantResponseBuilder extends ResponseBuilder {
  private request: Request<AcceptGrantRequestPayload>

  constructor(request: Request<AcceptGrantRequestPayload>) {
    super()
    this.request = request
  }

  getSucceedResponse(): Response<EmptyResponsePayload> {
    return this.getPayloadEnvelope(this.request.directive.header.messageId, namespace, succeedName, payloadVersion, {})
  }

  getFailResponse(type: string, message: string): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope(this.request.directive.header.messageId, namespace, failName, payloadVersion, { type, message, })
  }
}
