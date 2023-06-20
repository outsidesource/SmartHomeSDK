import { findDuplicates } from '../util/helpers'
import { DiscoveryEndpointBuilder } from './endpointBuilder'
import { DiscoveryEndpoint, DiscoveryPayload, SemanticActionNames } from './payload'

const maxEndpoints = 300

/**
 * Represents a builder for a {@link DiscoveryPayload}.
 */
export class DiscoveryPayloadBuilder {
  private readonly endpointBuilders: DiscoveryEndpointBuilder[] = []

  getPayload (): DiscoveryPayload {
    if (this.endpointBuilders.length > maxEndpoints) {
      throw Error(`The number of endpoints cannot exceed ${maxEndpoints}.`)
    }

    const endpoints = this.endpointBuilders.map(builder =>
      builder.getEndpoint()
    )

    const duplicates = findDuplicates(endpoints, endpoint => endpoint.endpointId)
    if (duplicates.length > 0) {
      throw new Error(`Duplicate endpoint ids found for the following: ${JSON.stringify(duplicates)}`)
    }

    const duplicateSematicActionNames = this.getDuplicateSematicActionNames(endpoints)

    if (duplicateSematicActionNames.length > 0) {
      throw Error(`Duplicate semantic action names found for the following: ${JSON.stringify(duplicateSematicActionNames)}`)
    }

    return { endpoints }
  }

  private getDuplicateSematicActionNames (endpoints: DiscoveryEndpoint[]): SemanticActionNameUsage[] {
    const histo: SemanticActionNameUsage[] = []
    for (const endpoint of endpoints) {
      for (const capability of endpoint.capabilities) {
        for (const actionMapping of capability.semantics?.actionMappings ?? []) {
          for (const actionName of actionMapping.actions) {
            let item = histo.find(x => x.action === actionName)
            if (item === undefined) {
              histo.push(
                (item = {
                  action: actionName,
                  locations: []
                })
              )
            }
            item.locations.push({
              endpoint: endpoint.endpointId,
              capability: capability.interface,
              instance: capability.instance
            })
          }
        }
      }
    }
    return histo.filter(x => x.locations.length > 1)
  }

  /**
   * Adds a builder for creating a {@link DiscoveryEndpoint}.
   * @param endpointId The identifier for the endpoint. The identifier must be unique across all devices for the skill. The identifier must be consistent for all discovery, addOrUpdate, and delete requests for the same device. An identifier can contain letters or numbers, spaces, and the following special characters: _ - = # ; : ? @ &. The identifier can't exceed 256 characters.
   * @param manufacturerName The name of the manufacturer of the device. This value can contain up to 128 characters.
   * @param description The description of the device. The description should contain the manufacturer name or how the device connects. For example, "Smart Lock by Sample Manufacturer" or "Wi-Fi Thermostat connected by SmartHub". This value can contain up to 128 characters.
   * @param friendlyName The name used by the user to identify the device. You set an initial value, and later the user can change the friendly name by using the Alexa app. This value can contain up to 128 characters, and shouldn't contain special characters or punctuation.
   * @returns A builder for a {@link DiscoveryEndpoint}.
   */
  addDiscoveryEndpoint (endpointId: string, manufacturerName: string, description: string, friendlyName: string): DiscoveryEndpointBuilder {
    const endpointBuilder = new DiscoveryEndpointBuilder(this, endpointId, manufacturerName, description, friendlyName)
    this.endpointBuilders.push(endpointBuilder)
    return endpointBuilder
  }
}

interface SemanticActionNameUsage {
  action: SemanticActionNames
  locations: Array<{
    endpoint: string
    capability: string
    instance?: string
  }>
}
