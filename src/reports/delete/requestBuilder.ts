import { v4 as uuidv4 } from 'uuid'
import { Request } from '../../outboundRequest/types'
import { findDuplicates } from '../../util/helpers'
import { DeleteReportPayload } from './types'

const namespace = 'Alexa.Discovery'
const name = 'DeleteReport'
const payloadVersion = '3'

export class DeleteReportRequestBuilder {
  private messageId: string
  private readonly endpointIds: string[] = []
  private token?: string
  private partition?: string
  private userId?: string

  constructor () {
    this.messageId = uuidv4()
  }

  getRequestBody (): Request<DeleteReportPayload> {
    if (this.endpointIds.length === 0) {
      throw Error('At least one endpoint is required.')
    }

    const duplicates = findDuplicates(this.endpointIds, id => id)
    if (duplicates.length > 0) {
      throw new Error(`Duplicate endpoint ids found for the following: ${JSON.stringify(duplicates)}`)
    }

    const payload = this.getDeleteReportPayload(this.endpointIds)

    return this.getPayloadEnvelope(payload)
  }

  private getDeleteReportPayload (endpointIds: string[]): DeleteReportPayload {
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
      endpoints: endpointIds.map(id => ({ endpointId: id })),
      scope
    }
  }

  private getPayloadEnvelope (payload: DeleteReportPayload): Request<DeleteReportPayload> {
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
   * Adds an endpoint to the list of endpoints to remove.
   * @param endpointId The identifier for the endpoint. The identifier must be unique across all devices for the skill. The identifier must be consistent for all discovery, addOrUpdate, and delete requests for the same device. An identifier can contain letters or numbers, spaces, and the following special characters: _ - = # ; : ? @ &. The identifier can't exceed 256 characters.
   * @returns This builder.
   */
  addEndpointId (endpointId: string): this {
    this.endpointIds.push(endpointId)
    return this
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
