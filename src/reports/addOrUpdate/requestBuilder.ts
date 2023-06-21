import { DiscoveryEndpointBuilder } from '../../discovery/endpointBuilder'
import { DiscoveryEndpoint } from '../../discovery/payload'
import { DiscoveryPayloadBuilder } from '../../discovery/payloadBuilder'
import { ScopedSmartHomeSkillRequestBuilder } from '../../outboundRequest/scopedRequestBuilder'
import { Request } from '../../outboundRequest/types'
import { AddOrUpdateReportPayload } from './types'

const namespace = 'Alexa.Discovery'
const name = 'AddOrUpdateReport'
const payloadVersion = '3'

/**
 * Represents a {@link SmartHomeSkillRequestBuilder} for an AddOrUpdateReport request to the event gateway.
 */
export class AddOrUpdateReportRequestBuilder extends ScopedSmartHomeSkillRequestBuilder<AddOrUpdateReportPayload> {
  private readonly payloadBuilder: DiscoveryPayloadBuilder = new DiscoveryPayloadBuilder()

  /**
   * Generates a request body with endpoints to add or update.
   * @returns The compiled request body.
   */
  getRequestBody (): Request<AddOrUpdateReportPayload> {
    const discoveryPayload = this.payloadBuilder.getPayload()

    if (discoveryPayload.endpoints.length === 0) {
      throw Error('At least one endpoint is required.')
    }

    const payload = this.getAddOrUpdateReportPayload(discoveryPayload.endpoints)

    return this.getPayloadEnvelope(namespace, name, payloadVersion, payload)
  }

  private getAddOrUpdateReportPayload (endpoints: DiscoveryEndpoint[]): AddOrUpdateReportPayload {
    return {
      endpoints,
      scope: this.getScope()
    }
  }

  /**
   * Generates a request body with no endpoints.
   * @returns The compiled request body.
   */
  getNoEndpointsRequestBody (): Request<AddOrUpdateReportPayload> {
    const payload = this.getAddOrUpdateReportPayload([])

    return this.getPayloadEnvelope(namespace, name, payloadVersion, payload)
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
    return this.payloadBuilder.addDiscoveryEndpoint(endpointId, manufacturerName, description, friendlyName)
  }
}
