/**
 * A payload to describe a handled error.
 */
export interface ErrorResponsePayload {
  /**
   * The error type.
   */
  type: string,

  /**
   * The friendly error message.
   */
  message: string,
}
