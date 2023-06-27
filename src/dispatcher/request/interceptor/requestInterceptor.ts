import { RequestInterceptor } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../responses/baseResponseBuilder'
import { HandlerInput } from '../handler/types'

/**
 * An interface for user-created logic that can evaluate and modify the request before being handled.
 */
export interface SmartHomeSkillRequestInterceptor extends RequestInterceptor<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>> {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   */
  process: (input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>) => Promise<void> | void
}
