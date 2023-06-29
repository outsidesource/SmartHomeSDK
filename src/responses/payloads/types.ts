/**
 * A payload that has no need to return data.
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
export interface EmptyResponsePayload {}

/**
 * A payload to describe a handled error.
 */
export interface ErrorResponsePayload {
  /**
   * The error type.
   */
  type: string

  /**
   * The friendly error message.
   */
  message: string
}
