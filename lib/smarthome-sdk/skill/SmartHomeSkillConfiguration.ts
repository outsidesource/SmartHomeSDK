import { RuntimeConfiguration } from 'ask-sdk-runtime'
import { HandlerInputFactory } from '../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../dispatcher/request/handler/HandlerInput'
import { Response, ResponsePayload } from '../response/Response'
import { ResponseBuilder } from '../response/ResponseBuilder'

/**
 * An interfaces that represents the standard components needed to build {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillConfiguration extends RuntimeConfiguration<HandlerInput<ResponseBuilder>, Response<ResponsePayload>> {
  // persistenceAdapter?: PersistenceAdapter;
  // apiClient?: services.ApiClient;
  customUserAgent?: string
  skillId?: string
  handlerInputFactories: Array<HandlerInputFactory<ResponseBuilder>>
}
