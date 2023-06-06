import { v4 as uuidv4 } from 'uuid'
import { DiscoveryEndpointBuilder } from '../../discovery/endpointBuilder'
import { DiscoveryEndpoint } from '../../discovery/payload'
import { DiscoveryPayloadBuilder } from '../../discovery/payloadBuilder'
import { Request } from '../../outboundRequest/types'
import { AddOrUpdateReportPayload } from './types'

const namespace = 'Alexa.Discovery'
const name = 'AddOrUpdateReport'
const payloadVersion = '3'

export class AddOrUpdateReportRequestBuilder {
  private messageId: string
  private readonly payloadBuilder: DiscoveryPayloadBuilder = new DiscoveryPayloadBuilder()
  private token?: string
  private partition?: string
  private userId?: string

  constructor () {
    this.messageId = uuidv4()
  }

  getRequestBody (): Request<AddOrUpdateReportPayload> {
    const discoveryPayload = this.payloadBuilder.getPayload()

    if (discoveryPayload.endpoints.length === 0) {
      throw Error('At least one endpoint is required.')
    }

    const payload = this.getAddOrUpdateReportPayload(discoveryPayload.endpoints)

    return this.getPayloadEnvelope(payload)
  }

  private getAddOrUpdateReportPayload (endpoints: DiscoveryEndpoint[]): AddOrUpdateReportPayload {
    let scope

    if (this.token !== undefined && this.token !== '') {
      if (this.partition !== undefined && this.partition !== '' && this.userId !== undefined && this.userId !== '') {
        scope = {
          type: 'BearerTokenWithPartition' as const,
          token: this.token,
          partition: this.partition,
          userId: this.userId
        }
      } else {
        scope = {
          type: 'BearerToken' as const,
          token: this.token
        }
      }
    }

    if (scope === undefined) {
      throw Error('A token is required.')
    }

    return {
      endpoints,
      scope
    }
  }

  private getPayloadEnvelope (payload: AddOrUpdateReportPayload): Request<AddOrUpdateReportPayload> {
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
   * Generates a request body with no endpoints.
   * @returns The compiled request body.
   */
  getNoEndpointsRequestBody (): Request<AddOrUpdateReportPayload> {
    const payload = this.getAddOrUpdateReportPayload([])

    return this.getPayloadEnvelope(payload)
  }

  /**
   * Adds a builder for creating a {@link DiscoveryEndpoint}.
   * @param endpointId The identifier for the endpoint. The identifier must be unique across all devices for the skill. The identifier must be consistent for all discovery requests for the same device. An identifier can contain letters or numbers, spaces, and the following special characters: _ - = # ; : ? @ &. The identifier can't exceed 256 characters.
   * @param manufacturerName The name of the manufacturer of the device. This value can contain up to 128 characters.
   * @param description The description of the device. The description should contain the manufacturer name or how the device connects. For example, "Smart Lock by Sample Manufacturer" or "Wi-Fi Thermostat connected by SmartHub". This value can contain up to 128 characters.
   * @param friendlyName The name used by the user to identify the device. You set an initial value, and later the user can change the friendly name by using the Alexa app. This value can contain up to 128 characters, and shouldn't contain special characters or punctuation.
   * @returns A builder for a {@link DiscoveryEndpoint}.
   */
  addDiscoveryEndpoint (endpointId: string, manufacturerName: string, description: string, friendlyName: string): DiscoveryEndpointBuilder {
    return this.payloadBuilder.addDiscoveryEndpoint(endpointId, manufacturerName, description, friendlyName)
  }

  /**
   * Explicitly sets the message ID. Otherwise, a random version 4 UUID is used.
   * @param messageId The message ID to explicitly use.
   * @returns This builder.
   */
  withMessageId (messageId: string): this {
    this.messageId = messageId
    return this
  }

  /**
   * Sets an OAuth 2 bearer token with no partition.
   * @param token The LWA token associated with the user.
   * @returns This builder.
   */
  withSimpleToken (token: string): this {
    this.token = token
    this.partition = undefined
    this.userId = undefined
    return this
  }

  /**
   * Sets an OAuth 2 bearer token with a partition.
   * @param token The LWA token associated with the user.
   * @param partition The location target for the request such as a room name or number.
   * @param userId A unique identifier for the user. Don't rely on {@link userId} to identify users, use {@link token} instead.
   * @returns This builder.
   */
  withPartitionedToken (token: string, partition: string, userId: string): this {
    this.token = token
    this.partition = partition
    this.userId = userId
    return this
  }
}
