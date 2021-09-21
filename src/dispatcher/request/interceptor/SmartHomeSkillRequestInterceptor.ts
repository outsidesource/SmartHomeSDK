import { RequestInterceptor } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { HandlerInput } from '../handler/HandlerInput'

/**
 * An interface for user-created logic that can evaluate and modify the request before being handled.
 */
export interface SmartHomeSkillRequestInterceptor
  extends RequestInterceptor<HandlerInput<unknown, ResponseBuilder>> {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   */
  process(input: HandlerInput<unknown, ResponseBuilder>): Promise<void> | void
}
