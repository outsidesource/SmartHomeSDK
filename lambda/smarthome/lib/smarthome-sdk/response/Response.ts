/**
 * Contains the header and payload response.
 */
 export interface Response<TPayload extends ResponsePayload> {
  event: {
    header: {
      namespace: string
      name: string
      messageId: string
      payloadVersion: string
    }
    payload: TPayload
  }
}

/**
 * Base interface for all response payloads.
 */
 export interface ResponsePayload {
 }
