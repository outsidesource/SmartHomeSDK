import { type ErrorHandler } from 'ask-sdk-runtime'
import { type ResponseBuilder } from '../../../responses/baseResponseBuilder'
import { type Response } from '../../../responses/types'
import { type HandlerInput } from '../../request/handler/types'

/**
 * An interface for user-created error handling logic.
 */
export interface SmartHomeSkillErrorHandler extends ErrorHandler<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   * @param error The unhandled error.
   */
  canHandle: (
    input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>,
    error: Error
  ) => Promise<boolean> | boolean

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   * @param error The unhandled error.
   */
  handle: (
    input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>,
    error: Error
  ) => Promise<Response<unknown>> | Response<unknown>
}
