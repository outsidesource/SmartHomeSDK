import { v4 as uuidv4 } from 'uuid'
import {
  Context,
  findPropStateDuplicates,
  getPropertyState,
  PropState
} from '../response/Response'
import { Request, RequestEndpoint, RequestPayload } from './Request'

export abstract class RequestBuilder {
  private endpointBuilder?: EndpointBuilder
  private contextBuilder?: ContextBuilder
  private messageId: string

  constructor() {
    this.messageId = uuidv4()
  }

  /**
   * Generates a request body to send to the event gateway.
   * @returns The compiled request body.
   */
  abstract getRequestBody(): Request<RequestPayload>

  /**
   * Adds a builder for the endpoint.
   * @returns A fluent mechanism for building an endpoint.
   */
  addEndpoint(): EndpointBuilder {
    if (this.endpointBuilder) {
      return this.endpointBuilder
    }
    return (this.endpointBuilder = new EndpointBuilder(this))
  }

  /**
   * Adds a builder for the context.
   * @returns A fluent mechanism for building a context.
   */
  addContext(): ContextBuilder {
    if (this.contextBuilder) {
      return this.contextBuilder
    }
    return (this.contextBuilder = new ContextBuilder(this))
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

  /**
   * Generates a {@link Request} based on the current configuration.
   * @param namespace The namespace and interface for the operation.
   * @param name The name of the operation.
   * @param payloadVersion The version of the interface specified in the namespace field.
   * @param payload The request payload.
   * @returns The {@link Request}.
   */
  protected getPayloadEnvelope<TPayload>(
    namespace: string,
    name: string,
    payloadVersion: string,
    payload: TPayload
  ): Request<TPayload> {
    const request: Request<TPayload> = {
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

    if (this.endpointBuilder) {
      const endpoint = this.endpointBuilder.getEndpoint()
      if (endpoint) {
        request.event.endpoint = endpoint
      }
    }

    if (this.contextBuilder) {
      const context = this.contextBuilder.getContext()
      if (context) {
        request.context = context
      }
    }

    return request
  }
}

/**
 * Represents a fluent mechanism for building an endpoint.
 */
export class EndpointBuilder {
  private parent: RequestBuilder
  private endpointId?: string
  private token?: string
  private partition?: string
  private userId?: string
  private cookie: { [key: string]: string } = {}

  constructor(parent: RequestBuilder) {
    this.parent = parent
  }

  /**
   * Returns the {@link RequestBuilder} that created this builder.
   * @returns The {@link RequestBuilder} that created this builder.
   */
  getRequestBuilder(): RequestBuilder {
    return this.parent
  }

  /**
   * Generates a {@link RequestEndpoint} based on the current configuration.
   * @returns The {@link RequestEndpoint}.
   */
  getEndpoint(): RequestEndpoint | undefined {
    if (!this.endpointId) {
      return undefined
    }

    const endpoint: RequestEndpoint = {
      endpointId: this.endpointId
    }

    if (this.token) {
      if (this.partition && this.userId) {
        endpoint.scope = {
          type: 'BearerTokenWithPartition',
          token: this.token,
          partition: this.partition,
          userId: this.userId
        }
      } else {
        endpoint.scope = {
          type: 'BearerToken',
          token: this.token
        }
      }
    }

    if (Object.keys(this.cookie).length > 0) {
      endpoint.cookie = this.cookie
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

  /**
   * Adds additional information about the endpoint.
   * @param name The key for the additional information.
   * @param value The value for the additional information.
   * @returns This builder.
   */
  withCookie(name: string, value: string): this {
    this.cookie[name] = value
    return this
  }
}

/**
 * Represents a fluent mechanism for building a request context.
 */
export class ContextBuilder {
  private parent: RequestBuilder
  private properties: PropState[] = []

  constructor(parent: RequestBuilder) {
    this.parent = parent
  }

  /**
   * Returns the {@link RequestBuilder} that created this builder.
   * @returns The {@link RequestBuilder} that created this builder.
   */
  getRequestBuilder(): RequestBuilder {
    return this.parent
  }

  /**
   * Generates a {@link Context} based on the current configuration.
   * @returns The {@link Context}.
   */
  getContext(): Context | undefined {
    const context: Context = {}

    if (this.properties.length === 0) {
      return undefined
    }

    const duplicates = findPropStateDuplicates(this.properties)

    if (duplicates.length > 0) {
      throw Error(`The following properties are duplicated: ${duplicates}`)
    }

    context.properties = this.properties.map(prop => getPropertyState(prop))

    return context
  }

  /**
   * Adds a report of a property value
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param instance The name of the controller instance. This should match the `capabilities[i].instance` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withProperty(
    namespace: string,
    instance: string | undefined,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
    this.properties.push({
      namespace,
      instance,
      name,
      value,
      timeOfSample,
      uncertaintyInMilliseconds
    })

    return this
  }
}