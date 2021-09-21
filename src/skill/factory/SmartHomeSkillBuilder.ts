import { RequestHandler } from 'ask-sdk-runtime'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { PayloadSignature } from '../../dispatcher/request/handler/Request'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillRequestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillResponseInterceptor'
import { Response } from '../../response/Response'
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
      | ((
          input: HandlerInput<unknown, ResponseBuilder>
        ) => Promise<boolean> | boolean)
      | PayloadSignature,
    executor: (
      input: HandlerInput<unknown, ResponseBuilder>
    ) => Promise<Response<unknown>> | Response<unknown>
  ): this
  addRequestHandlers(
    ...requestHandlers: Array<
      RequestHandler<HandlerInput<unknown, ResponseBuilder>, Response<unknown>>
    >
  ): this
  addRequestInterceptors(
    ...executors: Array<
      | SmartHomeSkillRequestInterceptor
      | ((
          input: HandlerInput<unknown, ResponseBuilder>
        ) => Promise<void> | void)
    >
  ): this
  addResponseInterceptors(
    ...executors: Array<
      | SmartHomeSkillResponseInterceptor
      | ((
          input: HandlerInput<unknown, ResponseBuilder>,
          response?: Response<unknown>
        ) => Promise<void> | void)
    >
  ): this
  addErrorHandler(
    matcher: (
      input: HandlerInput<unknown, ResponseBuilder>,
      error: Error
    ) => Promise<boolean> | boolean,
    executor: (
      input: HandlerInput<unknown, ResponseBuilder>,
      error: Error
    ) => Promise<Response<unknown>> | Response<unknown>
  ): this
  addErrorHandlers(...errorHandlers: SmartHomeSkillErrorHandler[]): this
  withCustomUserAgent(customUserAgent: string): this
  withSkillId(skillId: string): this
  withHandlerInputFactories(
    ...handlerInputFactories: Array<
      HandlerInputFactory<unknown, ResponseBuilder>
    >
  ): this
  getSkillConfiguration(): SmartHomeSkillConfiguration
  create(): SmartHomeSkill
  lambda(): LambdaHandler
}
