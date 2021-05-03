import { RequestInterceptor } from 'ask-sdk-runtime'
import { HandlerInput } from '../handler/HandlerInput'

/**
 * An interface for user-created logic that can evaluate and modify the request before being handled.
 */
export interface SmartHomeSkillRequestInterceptor extends RequestInterceptor<HandlerInput> {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   */
  process(input: HandlerInput): Promise<void> | void
}
