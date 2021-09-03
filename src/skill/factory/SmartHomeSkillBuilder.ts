import { RequestHandler } from 'ask-sdk-runtime'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import {
  PayloadSignature,
  RequestPayload
} from '../../dispatcher/request/handler/Request'
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
      | ((
          input: HandlerInput<RequestPayload, ResponseBuilder>
        ) => Promise<boolean> | boolean)
      | PayloadSignature,
    executor: (
      input: HandlerInput<RequestPayload, ResponseBuilder>
    ) => Promise<Response<ResponsePayload>> | Response<ResponsePayload>
  ): this
  addRequestHandlers(
    ...requestHandlers: Array<
      RequestHandler<
        HandlerInput<RequestPayload, ResponseBuilder>,
        Response<ResponsePayload>
      >
    >
  ): this
  addRequestInterceptors(
    ...executors: Array<
      | SmartHomeSkillRequestInterceptor
      | ((
          input: HandlerInput<RequestPayload, ResponseBuilder>
        ) => Promise<void> | void)
    >
  ): this
  addResponseInterceptors(
    ...executors: Array<
      | SmartHomeSkillResponseInterceptor
      | ((
          input: HandlerInput<RequestPayload, ResponseBuilder>,
          response?: Response<ResponsePayload>
        ) => Promise<void> | void)
    >
  ): this
  addErrorHandler(
    matcher: (
      input: HandlerInput<RequestPayload, ResponseBuilder>,
      error: Error
    ) => Promise<boolean> | boolean,
    executor: (
      input: HandlerInput<RequestPayload, ResponseBuilder>,
      error: Error
    ) => Promise<Response<ResponsePayload>> | Response<ResponsePayload>
  ): this
  addErrorHandlers(...errorHandlers: SmartHomeSkillErrorHandler[]): this
  withCustomUserAgent(customUserAgent: string): this
  withSkillId(skillId: string): this
  withHandlerInputFactories(
    ...handlerInputFactories: Array<
      HandlerInputFactory<RequestPayload, ResponseBuilder>
    >
  ): this
  getSkillConfiguration(): SmartHomeSkillConfiguration
  create(): SmartHomeSkill
  lambda(): LambdaHandler
}
