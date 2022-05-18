import { DiscoveryEndpointBuilder } from './DiscoveryEndpointBuilder'
import { AdditionalAttributes } from './DiscoveryPayload'

const additionalAttributesFieldMaxSize = 256

/** Represents a builder for a {@link AdditionalAttributes}. */
export class AdditionalAttributesBuilder {
  private manufacturer?: string
  private model?: string
  private serialNumber?: string
  private firmwareVersion?: string
  private softwareVersion?: string
  private customIdentifier?: string

  constructor(private parent: DiscoveryEndpointBuilder) {}

  /**
   * Gets the parent {@link DiscoveryEndpointBuilder}.
   * @returns The parent {@link DiscoveryEndpointBuilder}.
   */
  getEndpointBuilder(): DiscoveryEndpointBuilder {
    return this.parent
  }

  /**
   * Generates a {@link AdditionalAttributes} based on the current configuration.
   * @returns The {@link AdditionalAttributes}.
   */
  getAdditionalAttributes(): AdditionalAttributes | undefined {
    if (
      !this.manufacturer &&
      !this.model &&
      !this.serialNumber &&
      !this.firmwareVersion &&
      !this.softwareVersion &&
      !this.customIdentifier
    ) {
      return undefined
    }

    if (
      this.manufacturer &&
      this.manufacturer.length > additionalAttributesFieldMaxSize
    ) {
      throw Error(`The manufacturer "${this.manufacturer}" is too long.`)
    }

    if (this.model && this.model.length > additionalAttributesFieldMaxSize) {
      throw Error(`The model "${this.model}" is too long.`)
    }

    if (
      this.serialNumber &&
      this.serialNumber.length > additionalAttributesFieldMaxSize
    ) {
      throw Error(`The serial number "${this.serialNumber}" is too long.`)
    }

    if (
      this.firmwareVersion &&
      this.firmwareVersion.length > additionalAttributesFieldMaxSize
    ) {
      throw Error(`The firmware version "${this.firmwareVersion}" is too long.`)
    }

    if (
      this.softwareVersion &&
      this.softwareVersion.length > additionalAttributesFieldMaxSize
    ) {
      throw Error(`The software version "${this.softwareVersion}" is too long.`)
    }

    if (
      this.customIdentifier &&
      this.customIdentifier.length > additionalAttributesFieldMaxSize
    ) {
      throw Error(
        `The custom identifier "${this.customIdentifier}" is too long.`
      )
    }

    const result = {
      manufacturer: this.manufacturer,
      model: this.model,
      serialNumber: this.serialNumber,
      firmwareVersion: this.firmwareVersion,
      softwareVersion: this.softwareVersion,
      customIdentifier: this.customIdentifier
    }

    if (!this.manufacturer) {
      delete result.manufacturer
    }

    if (!this.model) {
      delete result.model
    }

    if (!this.serialNumber) {
      delete result.serialNumber
    }

    if (!this.firmwareVersion) {
      delete result.firmwareVersion
    }

    if (!this.softwareVersion) {
      delete result.softwareVersion
    }

    if (!this.customIdentifier) {
      delete result.customIdentifier
    }

    return result
  }

  /**
   * Sets the name of the manufacturer of the device.
   * @param manufacturer The name of the manufacturer of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withManufacturer(manufacturer: string): this {
    this.manufacturer = manufacturer
    return this
  }

  /**
   * Sets the name of the model of the device as advertised to customers.
   * @param model The name of the model of the device as advertised to customers. The model should uniquely identify the specific variant of a product. For example, for the vehicle Audi A6 2020, the manufacturer would be Audi and the model would be A6 2020. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withModel(model: string): this {
    this.model = model
    return this
  }

  /**
   * Sets the serial number of the device.
   * @param serialNumber The serial number of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withSerialNumber(serialNumber: string): this {
    this.serialNumber = serialNumber
    return this
  }

  /**
   * Sets the firmware version of the device.
   * @param firmwareVersion The firmware version of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withFirmwareVersion(firmwareVersion: string): this {
    this.firmwareVersion = firmwareVersion
    return this
  }

  /**
   * Sets the software version of the device.
   * @param softwareVersion The software version of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withSoftwareVersion(softwareVersion: string): this {
    this.softwareVersion = softwareVersion
    return this
  }

  /**
   * Sets a custom identifier for the device.
   * @param customIdentifier Your custom identifier for the device. This identifier should be globally unique across different user accounts. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withCustomIdentifier(customIdentifier: string): this {
    this.customIdentifier = customIdentifier
    return this
  }
}
