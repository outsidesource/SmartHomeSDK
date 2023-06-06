import { CapabilityBuilder } from './capabilityBuilder'
import { SemanticStateMapping, SemanticStateNames } from './payload'

enum SemanticType {
  StatesToValue,
  StatesToRange
}

/** Represents a builder for a {@link SemanticStateMapping}. */
export class SemanticStateBuilder {
  private states: SemanticStateNames[] = []
  private type: SemanticType | undefined
  private value: number | string = 0
  private minimum: number = 0
  private maximum: number = 0

  constructor (private readonly parent: CapabilityBuilder) {
  }

  /**
   * Gets the parent {@link CapabilityBuilder}.
   * @returns The parent {@link CapabilityBuilder}.
   */
  getCapabilityBuilder (): CapabilityBuilder {
    return this.parent
  }

  /**
   * Generates a {@link SemanticStateMapping} based on the current configuration.
   * @returns The {@link SemanticStateMapping}.
   */
  getMapping (): SemanticStateMapping {
    if (this.states.length === 0) {
      throw Error('At least one semantic state must be specified.')
    }

    switch (this.type) {
      case SemanticType.StatesToValue: {
        return {
          '@type': 'StatesToValue',
          states: this.states,
          value: this.value
        }
      }

      case SemanticType.StatesToRange: {
        return {
          '@type': 'StatesToRange',
          states: this.states,
          range: {
            minimumValue: this.minimum,
            maximumValue: this.maximum
          }
        }
      }

      case undefined: {
        throw Error('Either a value or range must be specified.')
      }

      /* istanbul ignore next: just an exhaustive check at compile time */
      default: {
        const exhaustiveCheck: never = this.type
        throw new Error(exhaustiveCheck)
      }
    }
  }

  /**
   * Adds to the list of Alexa states that are mapped to controller values.
   * @param states The list of Alexa states.
   * @returns This builder.
   */
  withStates (...states: SemanticStateNames[]): this {
    this.states = [...new Set([...this.states, ...states])]
    return this
  }

  /**
   * Sets the value of your controller that corresponds to the specified Alexa states.
   * @param value The value of your controller that corresponds to the specified Alexa states.
   * @returns This builder.
   */
  withValue (value: number | string): this {
    this.type = SemanticType.StatesToValue
    this.value = value
    return this
  }

  /**
   * Sets the range of values of your controller that corresponds to the specified Alexa states.
   * @param minimum The minimum value of your controller that corresponds to the specified Alexa states.
   * @param maximum The maximum value of your controller that corresponds to the specified Alexa states.
   * @returns This builder.
   */
  withRange (minimum: number, maximum: number): this {
    this.type = SemanticType.StatesToRange
    this.minimum = minimum
    this.maximum = maximum
    return this
  }
}
