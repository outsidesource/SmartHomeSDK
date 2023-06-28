import { ResponseBuilder } from '../../responses/baseResponseBuilder'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../responses/payloads/types'
import { Response } from '../../responses/types'
import { DeferredResponsePayload } from './types'

const defaultNamespace = 'Alexa'
const defaultSucceedName = 'Response'
const deferredName = 'DeferredResponse'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for an interface command.
 */
export class InterfaceCommandResponseBuilder extends ResponseBuilder<unknown> {
  private namespace: string = defaultNamespace
  private name: string = defaultSucceedName
  private payload: unknown = {}

  getSucceedResponse (): Response<unknown> {
    const envelope = this.getPayloadEnvelope(this.namespace, this.name, payloadVersion, this.payload)

    const endpointId = envelope.event.endpoint?.endpointId
    if (endpointId === undefined || endpointId === '') {
      throw new Error('An endpoint ID is required.')
    }

    return envelope
  }

  /**
   * Generates a response for a request that cannot be fulfilled immediately.
   * @param correlationToken The opaque token used to correlate this response with an expected future request.
   * @param estimatedDeferralInSeconds The optional estimated time (in seconds) until the corresponding request will be sent.
   * @returns The compiled response.
   */
  getDeferredResponse (correlationToken: string, estimatedDeferralInSeconds?: number): Response<DeferredResponsePayload | EmptyResponsePayload> {
    const payload = estimatedDeferralInSeconds === undefined
      ? {}
      : { estimatedDeferralInSeconds: Math.round(estimatedDeferralInSeconds) }

    const envelope = this.getPayloadEnvelope(this.namespace, deferredName, payloadVersion, payload)

    envelope.event.header.correlationToken = correlationToken

    return envelope
  }

  getFailResponse (
    type: string,
    message: string
  ): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope(this.namespace, failName, payloadVersion, {
      type,
      message
    })
  }

  /**
   * Sets the namespace for the response.
   * @param namespace The namespace for the response.
   * @returns This builder.
   */
  withNamespace (namespace: string): this {
    this.namespace = namespace
    return this
  }

  /**
   * Sets the name for the response.
   * @param name The name for the response.
   * @returns This builder.
   */
  withName (name: string): this {
    this.name = name
    return this
  }

  /**
   * Sets the payload for the response.
   * @param payload The payload for the response.
   * @returns This builder.
   */
  withPayload (payload: unknown): this {
    this.payload = payload
    return this
  }
}
