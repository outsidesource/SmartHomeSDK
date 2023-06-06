import { DiscoveryEndpointBuilder } from './endpointBuilder'
import { AdditionalAttributes } from './payload'

const additionalAttributesFieldMaxSize = 256

/** Represents a builder for a {@link AdditionalAttributes}. */
export class AdditionalAttributesBuilder {
  private manufacturer: string | undefined
  private model: string | undefined
  private serialNumber: string | undefined
  private firmwareVersion: string | undefined
  private softwareVersion: string | undefined
  private customIdentifier: string | undefined

  constructor (private readonly parent: DiscoveryEndpointBuilder) {}

  /**
   * Gets the parent {@link DiscoveryEndpointBuilder}.
   * @returns The parent {@link DiscoveryEndpointBuilder}.
   */
  getEndpointBuilder (): DiscoveryEndpointBuilder {
    return this.parent
  }

  /**
   * Generates a {@link AdditionalAttributes} based on the current configuration.
   * @returns The {@link AdditionalAttributes}.
   */
  getAdditionalAttributes (): AdditionalAttributes | undefined {
    const manufacturer = sanitize(this.manufacturer)
    const model = sanitize(this.model)
    const serialNumber = sanitize(this.serialNumber)
    const firmwareVersion = sanitize(this.firmwareVersion)
    const softwareVersion = sanitize(this.softwareVersion)
    const customIdentifier = sanitize(this.customIdentifier)

    if (manufacturer !== undefined && manufacturer.length > additionalAttributesFieldMaxSize) {
      throw Error(`The manufacturer "${manufacturer}" is too long.`)
    }

    if (model !== undefined && model.length > additionalAttributesFieldMaxSize) {
      throw Error(`The model "${model}" is too long.`)
    }

    if (serialNumber !== undefined && serialNumber.length > additionalAttributesFieldMaxSize) {
      throw Error(`The serial number "${serialNumber}" is too long.`)
    }

    if (firmwareVersion !== undefined && firmwareVersion.length > additionalAttributesFieldMaxSize) {
      throw Error(`The firmware version "${firmwareVersion}" is too long.`)
    }

    if (softwareVersion !== undefined && softwareVersion.length > additionalAttributesFieldMaxSize) {
      throw Error(`The software version "${softwareVersion}" is too long.`)
    }

    if (customIdentifier !== undefined && customIdentifier.length > additionalAttributesFieldMaxSize) {
      throw Error(`The custom identifier "${customIdentifier}" is too long.`)
    }

    const atts = {
      manufacturer,
      model,
      serialNumber,
      firmwareVersion,
      softwareVersion,
      customIdentifier
    }

    return Object.values(atts).every(v => v === undefined)
      ? undefined
      : atts
  }

  /**
   * Sets the name of the manufacturer of the device.
   * @param manufacturer The name of the manufacturer of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withManufacturer (manufacturer: string): this {
    this.manufacturer = manufacturer
    return this
  }

  /**
   * Sets the name of the model of the device as advertised to customers.
   * @param model The name of the model of the device as advertised to customers. The model should uniquely identify the specific variant of a product. For example, for the vehicle Audi A6 2020, the manufacturer would be Audi and the model would be A6 2020. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withModel (model: string): this {
    this.model = model
    return this
  }

  /**
   * Sets the serial number of the device.
   * @param serialNumber The serial number of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withSerialNumber (serialNumber: string): this {
    this.serialNumber = serialNumber
    return this
  }

  /**
   * Sets the firmware version of the device.
   * @param firmwareVersion The firmware version of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withFirmwareVersion (firmwareVersion: string): this {
    this.firmwareVersion = firmwareVersion
    return this
  }

  /**
   * Sets the software version of the device.
   * @param softwareVersion The software version of the device. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withSoftwareVersion (softwareVersion: string): this {
    this.softwareVersion = softwareVersion
    return this
  }

  /**
   * Sets a custom identifier for the device.
   * @param customIdentifier Your custom identifier for the device. This identifier should be globally unique across different user accounts. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withCustomIdentifier (customIdentifier: string): this {
    this.customIdentifier = customIdentifier
    return this
  }
}

function sanitize (value?: string): string | undefined {
  return value !== undefined && value !== ''
    ? value
    : undefined
}
