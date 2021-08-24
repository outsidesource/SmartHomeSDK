import { RequestHandler } from 'ask-sdk-runtime'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { PayloadSignature } from '../../dispatcher/request/handler/Request'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillRequestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillResponseInterceptor'
import { Response, ResponsePayload } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'
import { SmartHomeSkill } from '../SmartHomeSkill'
import { SmartHomeSkillConfiguration } from '../SmartHomeSkillConfiguration'
import { LambdaHandler } from './SmartHomeSkillFactory'

/**
 * An interface which helps building a {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillBuilder {
  addRequestHandler(
    matcher:
      | ((input: HandlerInput<ResponseBuilder>) => Promise<boolean> | boolean)
      | PayloadSignature,
    executor: (
      input: HandlerInput<ResponseBuilder>
    ) => Promise<Response<ResponsePayload>> | Response<ResponsePayload>
  ): this
  addRequestHandlers(
    ...requestHandlers: Array<
      RequestHandler<HandlerInput<ResponseBuilder>, Response<ResponsePayload>>
    >
  ): this
  addRequestInterceptors(
    ...executors: Array<
      | SmartHomeSkillRequestInterceptor
      | ((input: HandlerInput<ResponseBuilder>) => Promise<void> | void)
    >
  ): this
  addResponseInterceptors(
    ...executors: Array<
      | SmartHomeSkillResponseInterceptor
      | ((
          input: HandlerInput<ResponseBuilder>,
          response?: Response<ResponsePayload>
        ) => Promise<void> | void)
    >
  ): this
  addErrorHandler(
    matcher: (
      input: HandlerInput<ResponseBuilder>,
      error: Error
    ) => Promise<boolean> | boolean,
    executor: (
      input: HandlerInput<ResponseBuilder>,
      error: Error
    ) => Promise<Response<ResponsePayload>> | Response<ResponsePayload>
  ): this
  addErrorHandlers(...errorHandlers: SmartHomeSkillErrorHandler[]): this
  withCustomUserAgent(customUserAgent: string): this
  withSkillId(skillId: string): this
  withHandlerInputFactories(
    ...handlerInputFactories: Array<HandlerInputFactory<ResponseBuilder>>
  ): this
  getSkillConfiguration(): SmartHomeSkillConfiguration
  create(): SmartHomeSkill
  lambda(): LambdaHandler
}
