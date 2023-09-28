import { type RuntimeConfiguration } from 'ask-sdk-runtime'
import { type PersistenceAdapter } from '../attributes/types'
import { type HandlerInputFactory } from '../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { type HandlerInput } from '../dispatcher/request/handler/types'
import { type ResponseBuilder } from '../responses/baseResponseBuilder'
import { type Response } from '../responses/types'

/**
 * An interfaces that represents the standard components needed to build {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillConfiguration extends RuntimeConfiguration<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>> {
  persistenceAdapter?: PersistenceAdapter
  // apiClient?: services.ApiClient
  customUserAgent?: string
  skillId?: string
  handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown>>
}
