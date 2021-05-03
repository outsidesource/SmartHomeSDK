import { RuntimeConfiguration } from 'ask-sdk-runtime'
import { HandlerInput } from '../dispatcher/request/handler/HandlerInput'
import { Response } from '../response/Response'

/**
 * An interfaces that represents the standard components needed to build {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillConfiguration extends RuntimeConfiguration<HandlerInput, Response> {
  // persistenceAdapter?: PersistenceAdapter;
  // apiClient?: services.ApiClient;
  customUserAgent?: string
  skillId?: string
}
