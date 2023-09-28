import { type SmartHomeSkillBuilder } from './factory/skillBuilder'
import SmartHomeSkillFactory from './factory/skillFactory'

/**
 * Provider for skill builders.
 */
export const SkillBuilders = {
  smarthome (): SmartHomeSkillBuilder {
    return SmartHomeSkillFactory()
  }
}
