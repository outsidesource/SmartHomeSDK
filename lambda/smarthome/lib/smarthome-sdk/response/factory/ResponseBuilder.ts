import { Response, ResponsePayload } from '../Response'

/**
 * A fluent interface for building a response.
 */
export interface ResponseBuilder {
  /**
   * Indicates that the request was successfully handled.
   */
  succeed: () => this

  /**
   * Indicates that a handled error occurred while handling the request.
   * @param type The type of error.
   * @param message The friendly error message.
   */
  fail: (type: string, message: string) => this

  /**
   * Generates the result from the calls to this builder.
   */
  getResponse: () => Response<ResponsePayload>
}
