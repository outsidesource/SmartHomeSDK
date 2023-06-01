import { ErrorHandler } from 'ask-sdk-runtime'
import { Response } from '../../../response/Response'
import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { HandlerInput } from '../../request/handler/HandlerInput'

/**
 * An interface for user-created error handling logic.
 */
export interface SmartHomeSkillErrorHandler extends ErrorHandler<HandlerInput<unknown, ResponseBuilder>, Response<unknown>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   * @param error The unhandled error.
   */
  canHandle: (
    input: HandlerInput<unknown, ResponseBuilder>,
    error: Error
  ) => Promise<boolean> | boolean

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   * @param error The unhandled error.
   */
  handle: (
    input: HandlerInput<unknown, ResponseBuilder>,
    error: Error
  ) => Promise<Response<unknown>> | Response<unknown>
}
