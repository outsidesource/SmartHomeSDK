import { ResponseInterceptor } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../responses/baseResponseBuilder'
import { Response } from '../../../responses/types'
import { HandlerInput } from '../handler/types'

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
