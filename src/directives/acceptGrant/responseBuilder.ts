import { ResponseBuilder } from '../../response/baseResponseBuilder'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../response/payloads/types'
import { Response } from '../../response/types'

const namespace = 'Alexa.Authorization'
const succeedName = 'AcceptGrant.Response'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for the AcceptGrant directive.
 */
export class AcceptGrantResponseBuilder extends ResponseBuilder<EmptyResponsePayload> {
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
