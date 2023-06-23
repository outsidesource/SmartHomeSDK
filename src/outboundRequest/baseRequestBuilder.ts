import { v4 as uuidv4 } from 'uuid'
import { Request } from './types'

/**
 * A base implementation for outbound request builders.
 */
export abstract class SmartHomeSkillRequestBuilder<TRequestPayload> {
  private messageId: string

  constructor () {
    this.messageId = uuidv4()
  }

  /**
   * Generates an outbound request.
   * @returns The compiled request.
   */
  abstract getRequestBody (): Request<TRequestPayload>

  /**
   * Generates a {@link Request} based on the current configuration.
   * @param namespace The namespace and interface for the operation.
   * @param name The name of the operation.
   * @param payloadVersion The version of the interface specified in the namespace field.
   * @param correlationToken The token used in a prior deferred response, if applicable.
   * @param payload The request payload.
   * @returns The {@link Request}.
   */
  protected getPayloadEnvelope (namespace: string, name: string, payloadVersion: string, correlationToken: string | undefined, payload: TRequestPayload): Request<TRequestPayload> {
    const request: Request<TRequestPayload> = {
      event: {
        header: {
          namespace,
          name,
          payloadVersion,
          messageId: this.messageId
        },
        payload
      }
    }

    if (correlationToken !== undefined && correlationToken !== '') {
      request.event.header.correlationToken = correlationToken
    }

    return request
  }

  /**
   * Explicitly sets the message ID. Otherwise, a random version 4 UUID is used.
   * @param messageId The message ID to explicitly use.
   * @returns This builder.
   */
  withMessageId (messageId: string): this {
    this.messageId = messageId
    return this
  }
}
