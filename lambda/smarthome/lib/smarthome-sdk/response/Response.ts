import { EmptyResponsePayload } from './payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from './payloads/ErrorResponsePayload'

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
 * Base type for all response payloads.
 */
 export type ResponsePayload = EmptyResponsePayload | ErrorResponsePayload | undefined
