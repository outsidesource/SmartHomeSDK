import { ResponsePayload } from '../Response'

/**
 * A payload to describe a handled error.
 */
export interface ErrorResponsePayload extends ResponsePayload {
  /**
   * The error type.
   */
  type: string

  /**
   * The friendly error message.
   */
  message: string
}
