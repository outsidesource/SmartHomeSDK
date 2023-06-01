import { EmptyResponsePayload } from '../../response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../../response/payloads/ErrorResponsePayload'
import { Response } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'

const namespace = 'Alexa.Authorization'
const succeedName = 'AcceptGrant.Response'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for the AcceptGrant directive.
 */
export class AcceptGrantResponseBuilder extends ResponseBuilder {
  getSucceedResponse (): Response<EmptyResponsePayload> {
    return this.getPayloadEnvelope(namespace, succeedName, payloadVersion, {})
  }

  getFailResponse (type: string, message: string): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope(namespace, failName, payloadVersion, {
      type,
      message
    })
  }
}
