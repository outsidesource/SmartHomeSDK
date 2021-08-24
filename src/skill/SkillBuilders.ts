import { SmartHomeSkillBuilder } from './factory/SmartHomeSkillBuilder'
import { SmartHomeSkillFactory } from './factory/SmartHomeSkillFactory'

/**
 * Provider for skill builders.
 */
export const SkillBuilders = {
  smarthome(): SmartHomeSkillBuilder {
    return SmartHomeSkillFactory.init()
  }
}
