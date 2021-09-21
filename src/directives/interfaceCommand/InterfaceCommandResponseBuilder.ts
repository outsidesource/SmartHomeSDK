import { Request } from '../../dispatcher/request/handler/Request'
import { ErrorResponsePayload } from '../../response/payloads/ErrorResponsePayload'
import { Response } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'

const defaultNamespace = 'Alexa'
const defaultSucceedName = 'Response'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for an interface command.
 */
export class InterfaceCommandResponseBuilder extends ResponseBuilder {
  private namespace: string = defaultNamespace
  private name: string = defaultSucceedName
  private payload: unknown = {}

  constructor(request: Request<unknown>) {
    super(request)
  }

  getSucceedResponse(): Response<unknown> {
    const envelope = this.getPayloadEnvelope(
      this.namespace,
      this.name,
      payloadVersion,
      this.payload
    )

    if (!envelope.event.endpoint?.endpointId) {
      throw Error('An endpoint ID is required.')
    }

    return envelope
  }

  getFailResponse(
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
  withNamespace(namespace: string): this {
    this.namespace = namespace
    return this
  }

  /**
   * Sets the name for the response.
   * @param name The name for the response.
   * @returns This builder.
   */
  withName(name: string): this {
    this.name = name
    return this
  }

  /**
   * Sets the payload for the response.
   * @param payload The payload for the response.
   * @returns This builder.
   */
  withPayload(payload: unknown): this {
    this.payload = payload
    return this
  }
}
