import { v4 as uuidv4 } from 'uuid'
import { DiscoveryEndpointBuilder } from '../../discovery/DiscoveryEndpointBuilder'
import { DiscoveryPayload } from '../../discovery/DiscoveryPayload'
import { DiscoveryPayloadBuilder } from '../../discovery/DiscoveryPayloadBuilder'
import { Request } from '../../outboundRequest/Request'

const namespace = 'Alexa.Discovery'
const name = 'AddOrUpdateReport'
const payloadVersion = '3'

export class AddOrUpdateReportRequestBuilder {
  private messageId: string
  private payloadBuilder: DiscoveryPayloadBuilder = new DiscoveryPayloadBuilder()

  constructor() {
    this.messageId = uuidv4()
  }

  getRequestBody(): Request<DiscoveryPayload> {
    const payload = this.payloadBuilder.getPayload()

    if (payload.endpoints.length === 0) {
      throw Error('At least one endpoint is required.')
    }

    return {
      event: {
        header: {
          namespace,
          name,
          payloadVersion,
          messageId: this.messageId
        },
        payload
      }
    }
  }

  /**
   * Adds a builder for creating a {@link DiscoveryEndpoint}.
   * @param endpointId The identifier for the endpoint. The identifier must be unique across all devices for the skill. The identifier must be consistent for all discovery requests for the same device. An identifier can contain letters or numbers, spaces, and the following special characters: _ - = # ; : ? @ &. The identifier can't exceed 256 characters.
   * @param manufacturerName The name of the manufacturer of the device. This value can contain up to 128 characters.
   * @param description The description of the device. The description should contain the manufacturer name or how the device connects. For example, "Smart Lock by Sample Manufacturer" or "Wi-Fi Thermostat connected by SmartHub". This value can contain up to 128 characters.
   * @param friendlyName The name used by the user to identify the device. You set an initial value, and later the user can change the friendly name by using the Alexa app. This value can contain up to 128 characters, and shouldn't contain special characters or punctuation.
   * @returns A builder for a {@link DiscoveryEndpoint}.
   */
  addDiscoveryEndpoint(
    endpointId: string,
    manufacturerName: string,
    description: string,
    friendlyName: string
  ): DiscoveryEndpointBuilder {
    return this.payloadBuilder.addDiscoveryEndpoint(
      endpointId,
      manufacturerName,
      description,
      friendlyName
    )
  }

  /**
   * Explicitly sets the message ID. Otherwise, a random version 4 UUID is used.
   * @param messageId The message ID to explicitly use.
   * @returns This builder.
   */
  withMessageId(messageId: string): this {
    this.messageId = messageId
    return this
  }
}
