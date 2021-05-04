import { ResponseInterceptor } from 'ask-sdk-runtime'
import { Response, ResponsePayload } from '../../../response/Response'
import { HandlerInput } from '../handler/HandlerInput'

/**
 * An interface for user-created logic that can evaluate and modify the response after the request has been handled.
 */
export interface SmartHomeSkillResponseInterceptor extends ResponseInterceptor<HandlerInput, Response<ResponsePayload>> {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   * @param response The response from a {@link SmartHomeSkillRequestHandler} or {@link SmartHomeSkillErrorHandler}.
   */
  process(input: HandlerInput, response?: Response<ResponsePayload>): Promise<void> | void
}
