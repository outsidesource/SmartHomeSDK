import { CapabilityBuilder } from './CapabilityBuilder'
import { SemanticStateMapping, SemanticStateNames } from './DiscoveryPayload'

const semanticStateValueType = 'StatesToValue'
const semanticStateRangeType = 'StatesToRange'

/** Represents a builder for a {@link SemanticStateMapping}. */
export class SemanticStateBuilder {
  private states: SemanticStateNames[] = []
  private type = ''
  private value?: number | string
  private minimum?: number
  private maximum?: number

  constructor(private parent: CapabilityBuilder) {}

  /**
   * Gets the parent {@link CapabilityBuilder}.
   * @returns The parent {@link CapabilityBuilder}.
   */
  getCapabilityBuilder(): CapabilityBuilder {
    return this.parent
  }

  /**
   * Generates a {@link SemanticStateMapping} based on the current configuration.
   * @returns The {@link SemanticStateMapping}.
   */
  getMapping(): SemanticStateMapping {
    if (this.states.length === 0) {
      throw Error('At least one semantic state must be specified.')
    }

    if (
      this.type !== semanticStateValueType &&
      this.type !== semanticStateRangeType
    ) {
      throw Error('Either a value or range must be specified.')
    }

    if (this.type === semanticStateValueType) {
      if (this.value === undefined) {
        throw Error('The value is required.')
      }

      return {
        '@type': semanticStateValueType,
        states: this.states,
        value: this.value
      }
    }

    if (this.type === semanticStateRangeType) {
      if (this.minimum === undefined) {
        throw Error('The minimum is required.')
      }

      if (this.maximum === undefined) {
        throw Error('The maximum is required.')
      }

      return {
        '@type': semanticStateRangeType,
        states: this.states,
        range: {
          minimumValue: this.minimum,
          maximumValue: this.maximum
        }
      }
    }

    throw Error(`State mapping type "${this.type}" is not recognized.`)
  }

  /**
   * Adds to the list of Alexa states that are mapped to controller values.
   * @param states The list of Alexa states.
   * @returns This builder.
   */
  withStates(...states: SemanticStateNames[]): this {
    this.states = [...new Set([...this.states, ...states])]
    return this
  }

  /**
   * Sets the value of your controller that corresponds to the specified Alexa states.
   * @param value The value of your controller that corresponds to the specified Alexa states.
   * @returns This builder.
   */
  withValue(value: number | string): this {
    this.type = semanticStateValueType
    this.value = value
    return this
  }

  /**
   * Sets the range of values of your controller that corresponds to the specified Alexa states.
   * @param minimum The minimum value of your controller that corresponds to the specified Alexa states.
   * @param maximum The maximum value of your controller that corresponds to the specified Alexa states.
   * @returns This builder.
   */
  withRange(minimum: number, maximum: number): this {
    this.type = semanticStateRangeType
    this.minimum = minimum
    this.maximum = maximum
    return this
  }
}
