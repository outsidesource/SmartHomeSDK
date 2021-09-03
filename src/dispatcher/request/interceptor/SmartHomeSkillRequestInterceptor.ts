import { RequestInterceptor } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { HandlerInput } from '../handler/HandlerInput'
import { RequestPayload } from '../handler/Request'

/**
 * An interface for user-created logic that can evaluate and modify the request before being handled.
 */
export interface SmartHomeSkillRequestInterceptor
  extends RequestInterceptor<HandlerInput<RequestPayload, ResponseBuilder>> {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   */
  process(
    input: HandlerInput<RequestPayload, ResponseBuilder>
  ): Promise<void> | void
}
