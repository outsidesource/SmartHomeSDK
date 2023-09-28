import { type RequestHandler } from 'ask-sdk-runtime'
import { type Handler } from 'aws-lambda'
import { type SmartHomeSkill } from '..'
import { type PersistenceAdapter } from '../../attributes/types'
import { type SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler'
import { type HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { type HandlerInput, type PayloadSignature } from '../../dispatcher/request/handler/types'
import { type SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/requestInterceptor'
import { type SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/responseInterceptor'
import { type ResponseBuilder } from '../../responses/baseResponseBuilder'
import { type Response } from '../../responses/types'
import { type SmartHomeSkillConfiguration } from '../configuration'

/**
 * An interface which helps building a {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillBuilder {
  addRequestHandler: (
    matcher: InlineRequestMatcher | PayloadSignature,
    executor: InlineRequestExecutor
  ) => this
  addRequestHandlers: (
    ...requestHandlers: Array<RequestHandler<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>>>
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
  withPersistenceAdapter: (
    adapter: PersistenceAdapter
  ) => this
  withHandlerInputFactories: (
    ...handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown>>
  ) => this
  getSkillConfiguration: () => SmartHomeSkillConfiguration
  create: () => SmartHomeSkill
  lambda: () => Handler
}

export type InlineRequestMatcher = (
  input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>
) => Promise<boolean> | boolean

export type InlineRequestExecutor = (
  input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>
) => Promise<Response<unknown>> | Response<unknown>

export type InlineRequestInterceptor = (
  input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>
) => Promise<void> | void

export type InlineResponseInterceptor = (
  input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>,
  response?: Response<unknown>
) => Promise<void> | void

export type InlineErrorMatcher = (
  input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>,
  error: Error
) => Promise<boolean> | boolean

export type InlineErrorExecutor = (
  input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>,
  error: Error
) => Promise<Response<unknown>> | Response<unknown>
