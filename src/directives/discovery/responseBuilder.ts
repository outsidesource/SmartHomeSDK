import { type DiscoveryEndpointBuilder } from '../../discovery/endpointBuilder'
import { type DiscoveryPayload } from '../../discovery/payload'
import { DiscoveryPayloadBuilder } from '../../discovery/payloadBuilder'
import { ResponseBuilder } from '../../responses/baseResponseBuilder'
import { type ErrorTypes } from '../../responses/errorTypes'
import { type ErrorResponsePayload } from '../../responses/payloads/types'
import { type Response } from '../../responses/types'

const succeedNamespace = 'Alexa.Discovery'
const succeedName = 'Discover.Response'
const failNamespace = 'Alexa'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for the Discovery directive.
 */
export class DiscoveryResponseBuilder extends ResponseBuilder<DiscoveryPayload> {
  private readonly payloadBuilder: DiscoveryPayloadBuilder = new DiscoveryPayloadBuilder()

  getSucceedResponse (): Response<DiscoveryPayload> {
    return this.getPayloadEnvelope(succeedNamespace, succeedName, payloadVersion, this.payloadBuilder.getPayload())
  }

  getFailResponse (
    type: ErrorTypes.BridgeUnreachable | ErrorTypes.ExpiredAuthorizationCredential | ErrorTypes.InsufficientPermissions | ErrorTypes.InternalError | ErrorTypes.InvalidAuthorizationCredential,
    message: string
  ): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope(failNamespace, failName, payloadVersion, {
      type,
      message
    })
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
