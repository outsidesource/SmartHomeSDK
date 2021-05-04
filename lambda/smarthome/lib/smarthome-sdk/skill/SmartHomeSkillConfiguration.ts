import { RuntimeConfiguration } from 'ask-sdk-runtime'
import { HandlerInput } from '../dispatcher/request/handler/HandlerInput'
import { Response, ResponsePayload } from '../response/Response'

/**
 * An interfaces that represents the standard components needed to build {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillConfiguration extends RuntimeConfiguration<HandlerInput, Response<ResponsePayload>> {
  // persistenceAdapter?: PersistenceAdapter;
  // apiClient?: services.ApiClient;
  customUserAgent?: string
  skillId?: string
}
