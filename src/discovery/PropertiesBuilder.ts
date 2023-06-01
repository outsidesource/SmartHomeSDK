import { CapabilityBuilder } from './CapabilityBuilder'
import { CapabilityProperties } from './DiscoveryPayload'

/** Represents a builder for a {@link CapabilityProperties}. */
export class PropertiesBuilder {
  private supported: string[] = []
  private proactivelyReported: boolean | undefined
  private retrievable: boolean | undefined
  private nonControllable: boolean | undefined

  constructor (private readonly parent: CapabilityBuilder) {}

  /**
   * Gets the parent {@link CapabilityBuilder}.
   * @returns The parent {@link CapabilityBuilder}.
   */
  getCapabilityBuilder (): CapabilityBuilder {
    return this.parent
  }

  /**
   * Generates an {@link CapabilityProperties} based on the current configuration.
   * @returns The {@link CapabilityProperties}.
   */
  getProperties (): CapabilityProperties | undefined {
    const supported = this.supported.length === 0
      ? undefined
      : this.supported.map(name => ({ name }))

    const result = {
      supported,
      proactivelyReported: this.proactivelyReported,
      retrievable: this.retrievable,
      nonControllable: this.nonControllable
    }

    return result.supported === undefined && result.proactivelyReported === undefined && result.retrievable === undefined && result.nonControllable === undefined
      ? undefined
      : result
  }

  /**
   * Adds the names of supported properties.
   * @param names The names of properties of the interface that the skill supports.
   * @returns This builder.
   */
  withSupportedProperties (...names: string[]): this {
    this.supported = [...new Set([...this.supported, ...names])]
    return this
  }

  /**
   * Sets whether the interface's properties are proactively reported.
   * @param retrievable True if the skill sends change reports when the properties change. The default is false.
   * @returns This builder.
   */
  withProactivelyReported (proactivelyReported: boolean): this {
    this.proactivelyReported = proactivelyReported
    return this
  }

  /**
   * Sets whether the interface's properties are retrievable.
   * @param retrievable True if the skill responds to state report requests and reports the values of the properties. The default is false.
   * @returns This builder.
   */
  withRetrievable (retrievable: boolean): this {
    this.retrievable = retrievable
    return this
  }

  /**
   * Sets whether the interface's properties are controllable or readonly.
   * @param nonControllable True if the interface's properties are readonly. The default is false.
   * @returns This builder.
   */
  withNonControllable (nonControllable: boolean): this {
    this.nonControllable = nonControllable
    return this
  }
}
