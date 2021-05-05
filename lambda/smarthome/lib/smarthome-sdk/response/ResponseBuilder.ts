import { Response, ResponsePayload } from './Response'

/**
 * Represents a fluent mechanism for building a response.
 */
export abstract class ResponseBuilder {
  /**
   * Generates a response for a request that was successfully handled.
   */
  abstract getSucceedResponse(): Response<ResponsePayload>

  /**
   * Generates a response for a request that failed.
   * @param type The type of error.
   * @param message The friendly error message.
   */
  abstract getFailResponse(type: string, message: string): Response<ResponsePayload>

  /**
   * Generates the response.
   */
  protected getPayloadEnvelope<TPayload>(messageId: string, namespace: string, name: string, payloadVersion: string, payload: TPayload): Response<TPayload> {
    return {
      event: {
        header: {
          namespace,
          name,
          payloadVersion,
          messageId,
        },
        payload,
      }
    }
  }
}
