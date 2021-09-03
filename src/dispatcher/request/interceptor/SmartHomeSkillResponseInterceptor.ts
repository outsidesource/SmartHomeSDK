import { ResponseInterceptor } from 'ask-sdk-runtime'
import { Response, ResponsePayload } from '../../../response/Response'
import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { HandlerInput } from '../handler/HandlerInput'
import { RequestPayload } from '../handler/Request'

/**
 * An interface for user-created logic that can evaluate and modify the response after the request has been handled.
 */
export interface SmartHomeSkillResponseInterceptor
  extends ResponseInterceptor<
    HandlerInput<RequestPayload, ResponseBuilder>,
    Response<ResponsePayload>
  > {
  /**
   * Executes the user-created logic.
   * @param input Information about the request and executing context.
   * @param response The response from a {@link RequestHandler} or {@link SmartHomeSkillErrorHandler}.
   */
  process(
    input: HandlerInput<RequestPayload, ResponseBuilder>,
    response?: Response<ResponsePayload>
  ): Promise<void> | void
}
