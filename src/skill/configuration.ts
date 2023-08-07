import { RuntimeConfiguration } from 'ask-sdk-runtime'
import { PersistenceAdapter } from '../attributes/types'
import { HandlerInputFactory } from '../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput } from '../dispatcher/request/handler/types'
import { ResponseBuilder } from '../responses/baseResponseBuilder'
import { Response } from '../responses/types'

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
