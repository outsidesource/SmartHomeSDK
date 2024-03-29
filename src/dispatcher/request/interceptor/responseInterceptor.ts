import { type ResponseInterceptor } from 'ask-sdk-runtime'
import { type ResponseBuilder } from '../../../responses/baseResponseBuilder'
import { type Response } from '../../../responses/types'
import { type HandlerInput } from '../handler/types'

/**
 * An interface for user-created logic that can evaluate and modify the response after the request has been handled.
 */
export interface SmartHomeSkillResponseInterceptor extends ResponseInterceptor<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>> {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   * @param response The response from a {@link RequestHandler} or {@link SmartHomeSkillErrorHandler}.
   */
  process: (input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, response?: Response<unknown>) => Promise<void> | void
}
