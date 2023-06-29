import { AdditionalAttributesBuilder } from './additionalAttributesBuilder'
import { CapabilityBuilder } from './capabilityBuilder'
import { DiscoveryConnection, DiscoveryEndpoint, DisplayCategories } from './payload'
import { DiscoveryPayloadBuilder } from './payloadBuilder'

const maxCapabilitiesPerEndpoint = 100
const maxCookiesSize = 5000

const endpointIdRegex = /^[\w \-=#;:?@&]{1,256}$/i
const manufacturerNameMaxSize = 128
const descriptionMaxSize = 128
const friendlyNameRegex = /^[\p{L}\p{N} ]{1,128}$/iu
const zwaveHomeIdRegex = /^0x[0-9A-F]{8}$/i
const zwaveNodeIdRegex = /^0x[0-9A-F]{2}$/i
const unknownConnectionRegex = /^\S{1,256}$/i

/** Represents builder for a {@link DiscoveryEndpoint}. */
export class DiscoveryEndpointBuilder {
  private displayCategories: DisplayCategories[] = []
  private readonly capabilityBuilders: CapabilityBuilder[] = []
  private additionalAttributesBuilder?: AdditionalAttributesBuilder
  private readonly connections: DiscoveryConnection[] = []
  private relationships: Record<string, { endpointId: string }> = {}
  private cookies: Record<string, string> = {}

  constructor (
    private readonly parent: DiscoveryPayloadBuilder,
    private readonly endpointId: string,
    private readonly manufacturerName: string,
    private readonly description: string,
    private readonly friendlyName: string
  ) {
  }

  /**
   * Gets the parent {@link DiscoveryPayloadBuilder}.
   * @returns The parent {@link DiscoveryPayloadBuilder}.
   */
  getResponseBuilder (): DiscoveryPayloadBuilder {
    return this.parent
  }

  /**
   * Generates a {@link DiscoveryEndpoint} based on the current configuration.
   * @returns The {@link DiscoveryEndpoint}.
   */
  getEndpoint (): DiscoveryEndpoint {
    if (!endpointIdRegex.test(this.endpointId)) {
      throw new Error(`The endpoint ID "${this.endpointId}" does not match the expected format.`)
    }

    if (this.manufacturerName.length === 0) {
      throw new Error('The manufacturer name cannot be empty.')
    }

    if (this.manufacturerName.length > manufacturerNameMaxSize) {
      throw new Error(`The manufacturer name "${this.manufacturerName}" is too long.`)
    }

    if (this.description.length === 0) {
      throw new Error('The description cannot be empty.')
    }

    if (this.description.length > descriptionMaxSize) {
      throw new Error(`The description "${this.description}" is too long.`)
    }

    if (!friendlyNameRegex.test(this.friendlyName)) {
      throw new Error(`The friendly name "${this.friendlyName}" does not match the expected format.`)
    }

    if (this.displayCategories.length === 0) {
      throw new Error('At least one display category is required.')
    }

    if (this.capabilityBuilders.length === 0) {
      throw new Error('At least one capability is required.')
    }

    if (this.capabilityBuilders.length > maxCapabilitiesPerEndpoint) {
      throw new Error(`The number of capabilities cannot exceed ${maxCapabilitiesPerEndpoint}.`)
    }

    if (JSON.stringify(this.cookies).length > maxCookiesSize) {
      throw new Error(`The cookie cannot be larger than ${maxCookiesSize} bytes.`)
    }

    const connections = this.connections.length === 0 ? undefined : this.connections

    const relationships = Object.keys(this.relationships).length === 0
      ? undefined
      : this.relationships

    const cookie =
      Object.keys(this.cookies).length === 0 ? undefined : this.cookies

    return {
      endpointId: this.endpointId,
      manufacturerName: this.manufacturerName,
      description: this.description,
      friendlyName: this.friendlyName,
      displayCategories: this.displayCategories,
      additionalAttributes: this.additionalAttributesBuilder?.getAdditionalAttributes(),
      capabilities: this.capabilityBuilders.map(builder => builder.getCapability()),
      connections,
      relationships,
      cookie
    }
  }

  /**
   * Adds one or more {@link DisplayCategories} to the list of categories in which this endpoint should be displayed.
   * @param displayCategories One or more {@link DisplayCategories}.
   * @returns This builder.
   */
  withDisplayCategories (...displayCategories: DisplayCategories[]): this {
    this.displayCategories = [
      ...new Set([...this.displayCategories, ...displayCategories])
    ]
    return this
  }

  /**
   * Adds a capability listing to the endpoint.
   * @param interfaceName The name of the capability interface.
   * @param version The version of the interface.
   * @returns A builder for an {@link EndpointCapability}.
   */
  addCapability (interfaceName: string, version: string): CapabilityBuilder {
    const capabilityBuilder = new CapabilityBuilder(this, interfaceName, version)
    this.capabilityBuilders.push(capabilityBuilder)
    return capabilityBuilder
  }

  /**
   * Adds additional details about the device to this endpoint.
   * @returns A builder for an {@link AdditionalAttributes}.
   */
  addAdditionalAttributes (): AdditionalAttributesBuilder {
    if (this.additionalAttributesBuilder === undefined) {
      this.additionalAttributesBuilder = new AdditionalAttributesBuilder(this)
    }
    return this.additionalAttributesBuilder
  }

  /**
   * Adds a TCP/IP connection to the endpoint.
   * @param macAddress The unique identifier for the network interface controller (NIC).
   * @returns This builder.
   */
  withTcpIpConnection (macAddress?: string): this {
    this.connections.push({ type: 'TCP_IP', macAddress })
    return this
  }

  /**
   * Adds a Zigbee connection to the endpoint.
   * @param macAddress The unique identifier for the network interface controller (NIC).
   * @returns This builder.
   */
  withZigbeeConnection (macAddress?: string): this {
    this.connections.push({ type: 'ZIGBEE', macAddress })
    return this
  }

  /**
   * Adds a ZWave connection to the endpoint.
   * @param homeId The Home ID for a Z-Wave network that the endpoint connects to. The format is 0x00000000 with UTF-8 characters.
   * @param nodeId The Node ID for the endpoint in a Z-Wave network that the endpoint connects to. The format is 0x00 with UTF-8 characters.
   * @returns This builder.
   */
  withZWaveConnection (homeId?: string, nodeId?: string): this {
    if (homeId !== undefined && !zwaveHomeIdRegex.test(homeId)) {
      throw new Error(`The ZWave home ID "${homeId}" does not match the expected format.`)
    }

    if (nodeId !== undefined && !zwaveNodeIdRegex.test(nodeId)) {
      throw new Error(`The ZWave node ID "${nodeId}" does not match the expected format.`)
    }

    this.connections.push({ type: 'ZWAVE', homeId, nodeId })
    return this
  }

  /**
   * Adds an unknown connection to the endpoint.
   * @param value The connection information for a connection when you can't identify the type of the connection more specifically. The information that you provide in this field should be stable and specific. This value can contain up to 256 alphanumeric characters, and can contain punctuation.
   * @returns This builder.
   */
  withUnknownConnection (value: string): this {
    if (!unknownConnectionRegex.test(value)) {
      throw new Error(`The unknown connection value "${value}" does not match the expected format.`)
    }

    this.connections.push({ type: 'UNKNOWN', value })
    return this
  }

  /**
   * Adds a relationship to other endpoints.
   * @param name The name of the connection.
   * @param endpointId The ID of the other endpoint that has a connection to this endpoint.
   * @returns This builder.
   */
  withRelationship (name: string, endpointId: string): this {
    this.relationships[name] = { endpointId }
    return this
  }

  /**
   * Adds custom name/value pairs that your skill uses to the endpoint.
   * @param name The name of the data.
   * @param value The value of the data.
   * @returns This builder.
   */
  withCookie (name: string, value: string): this {
    this.cookies[name] = value
    return this
  }
}
