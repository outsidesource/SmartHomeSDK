import { RequestHandler } from 'ask-sdk-runtime'
import { Handler } from 'aws-lambda'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { PayloadSignature } from '../../dispatcher/request/handler/Request'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillRequestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillResponseInterceptor'
import { Response } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'
import { SmartHomeSkill } from '../SmartHomeSkill'
import { SmartHomeSkillConfiguration } from '../SmartHomeSkillConfiguration'

/**
 * An interface which helps building a {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillBuilder {
  addRequestHandler: (
    matcher: InlineRequestMatcher | PayloadSignature,
    executor: InlineRequestExecutor
  ) => this
  addRequestHandlers: (
    ...requestHandlers: Array<RequestHandler<HandlerInput<unknown, ResponseBuilder>, Response<unknown>>>
  ) => this
  addRequestInterceptors: (
    ...executors: Array<SmartHomeSkillRequestInterceptor | InlineRequestInterceptor>
  ) => this
  addResponseInterceptors: (
    ...executors: Array<SmartHomeSkillResponseInterceptor | InlineResponseInterceptor>
  ) => this
  addErrorHandler: (
    matcher: InlineErrorMatcher,
    executor: InlineErrorExecutor
  ) => this
  addErrorHandlers: (
    ...errorHandlers: SmartHomeSkillErrorHandler[]
  ) => this
  withCustomUserAgent: (
    customUserAgent: string
  ) => this
  withSkillId: (
    skillId: string
  ) => this
  withHandlerInputFactories: (
    ...handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder>>
  ) => this
  getSkillConfiguration: () => SmartHomeSkillConfiguration
  create: () => SmartHomeSkill
  lambda: () => Handler
}

export type InlineRequestMatcher = (
  input: HandlerInput<unknown, ResponseBuilder>
) => Promise<boolean> | boolean

export type InlineRequestExecutor = (
  input: HandlerInput<unknown, ResponseBuilder>
) => Promise<Response<unknown>> | Response<unknown>

export type InlineRequestInterceptor = (
  input: HandlerInput<unknown, ResponseBuilder>
) => Promise<void> | void

export type InlineResponseInterceptor = (
  input: HandlerInput<unknown, ResponseBuilder>,
  response?: Response<unknown>
) => Promise<void> | void

export type InlineErrorMatcher = (
  input: HandlerInput<unknown, ResponseBuilder>,
  error: Error
) => Promise<boolean> | boolean

export type InlineErrorExecutor = (
  input: HandlerInput<unknown, ResponseBuilder>,
  error: Error
) => Promise<Response<unknown>> | Response<unknown>
