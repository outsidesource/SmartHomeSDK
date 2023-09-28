import { type PropertyState } from '../../util/types'

/** A payload representing one or more property changes. */
export interface ChangeReportPayload {
  change: {
    cause: {
      type: ChangeCauseType
    }
    properties: PropertyState[]
  }
}

/**
 * Causes for a property change.
 */
export enum ChangeCauseType {
  /** Customer interaction with an app. For example, a customer switches on a light or locks a door by using the Alexa app or an app provided by a device vendor. */
  AppInteraction = 'APP_INTERACTION',

  /** Periodic poll of an endpoint. For example, you might poll a temperature sensor every hour and send the updated temperature to Alexa. */
  PeriodicPoll = 'PERIODIC_POLL',

  /** Physical interaction with an endpoint. For example, the user turned on a light or locked a door lock manually. */
  PhysicalInteraction = 'PHYSICAL_INTERACTION',

  /** A device rule. For example, a user configures a rule to switch on a light if a motion sensor detects motion. In this case, Alexa receives an event from the motion sensor, and another event from the light to indicate that its state change was caused by the rule. */
  RuleTrigger = 'RULE_TRIGGER',

  /** Voice interaction. For example, a user turns on a light by speaking to their Echo device. */
  VoiceInteraction = 'VOICE_INTERACTION'
}
