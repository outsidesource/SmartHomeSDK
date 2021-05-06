import { Endpoint, Response, ResponsePayload } from './Response'

/**
 * Represents a fluent mechanism for building a response.
 */
export abstract class ResponseBuilder {
  private endpointBuilder?: EndpointBuilder

  /**
   * Generates a response for a request that was successfully handled.
   * @returns The compiled response.
   */
  abstract getSucceedResponse(): Response<ResponsePayload>

  /**
   * Generates a response for a request that failed.
   * @param type The type of error.
   * @param message The friendly error message.
   * @returns The compiled response.
   */
  abstract getFailResponse(type: string, message: string): Response<ResponsePayload>

  /**
   * Adds a builder for the endpoint.
   * @returns A fluent mechanism for building an endpoint.
   */
  addEndpoint(): EndpointBuilder {
    return this.endpointBuilder = new EndpointBuilder(this)
  }

  /**
   * Generates a {@link Response} based on the current configuration.
   * @param namespace The namespace and interface for the operation.
   * @param name The name of the operation.
   * @param payloadVersion The version of the interface specified in the namespace field.
   * @param payload The request payload.
   * @returns The {@link Response}.
   */
  protected getPayloadEnvelope<TPayload>(messageId: string, namespace: string, name: string, payloadVersion: string, payload: TPayload): Response<TPayload> {
    const response: Response<TPayload> = {
      event: {
        header: {
          namespace,
          name,
          payloadVersion,
          messageId,
        },
        payload,
      }
    }

    if (this.endpointBuilder) {
      response.event.endpoint = this.endpointBuilder.getEndpoint()
    }

    return response
  }
}

/**
 * Represents a fluent mechanism for building an endpoint.
 */
export class EndpointBuilder {
  private parent: ResponseBuilder
  private endpointId?: string
  private token?: string
  private partition?: string
  private userId?: string

  constructor(parent: ResponseBuilder) {
    this.parent = parent
  }

  /**
   * Returns the {@link ResponseBuilder} that created this builder.
   * @returns The {@link ResponseBuilder} that created this builder.
   */
  getResponseBuilder(): ResponseBuilder {
    return this.parent
  }

  /**
   * Generates a {@link Endpoint} based on the current configuration.
   * @returns The {@link Endpoint}.
   */
  getEndpoint(): Endpoint | undefined {
    if (!this.endpointId && !this.token) {
      return undefined
    }

    const endpoint: Endpoint = {}

    if (this.endpointId) {
      endpoint.endpointId = this.endpointId
    }

    if (this.token) {
      if (this.partition && this.userId) {
        endpoint.scope = {
          type: 'BearerTokenWithPartition',
          token: this.token,
          partition: this.partition,
          userId: this.userId,
        }
      }
      else {
        endpoint.scope = {
          type: 'BearerToken',
          token: this.token,
        }
      }
    }

    return endpoint
  }

  /**
   * Sets the endpoint ID.
   * @param endpointId The endpoint ID.
   * @returns This builder.
   */
  withEndpointId(endpointId: string): this {
    this.endpointId = endpointId
    return this
  }

  /**
   * Sets an OAuth 2 bearer token with no partition.
   * @param token The token for identifying and accessing a linked user account.
   * @returns This builder.
   */
  withSimpleToken(token: string): this {
    this.token = token
    this.partition = undefined
    this.userId = undefined
    return this
  }

  /**
   * Sets an OAuth 2 bearer token with a partition.
   * @param token The token for identifying and accessing a linked user account.
   * @param partition The location target for the request such as a room name or number.
   * @param userId A unique identifier for the user who made the request. Don't rely on {@link userId} to identify users, use {@link token} instead.
   * @returns This builder.
   */
  withPartitionedToken(token: string, partition: string, userId: string): this {
    this.token = token
    this.partition = partition
    this.userId = userId
    return this
  }
}
