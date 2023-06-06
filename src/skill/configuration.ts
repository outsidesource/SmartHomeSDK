import { RuntimeConfiguration } from 'ask-sdk-runtime'
import { HandlerInputFactory } from '../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput } from '../dispatcher/request/handler/types'
import { ResponseBuilder } from '../response/baseResponseBuilder'
import { Response } from '../response/types'

/**
 * An interfaces that represents the standard components needed to build {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillConfiguration extends RuntimeConfiguration<HandlerInput<unknown, ResponseBuilder>, Response<unknown>> {
  // persistenceAdapter?: PersistenceAdapter;
  // apiClient?: services.ApiClient;
  customUserAgent?: string
  skillId?: string
  handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder>>
}
