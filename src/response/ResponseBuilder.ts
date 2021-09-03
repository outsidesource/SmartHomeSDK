import { Request, RequestPayload } from '../dispatcher/request/handler/Request'
import {
  Context,
  Endpoint,
  findPropStateDuplicates,
  getPropertyState,
  PropState,
  Response,
  ResponsePayload
} from './Response'

/**
 * Represents a fluent mechanism for building a response.
 */
export abstract class ResponseBuilder {
  protected request: Request<RequestPayload>
  private endpointBuilder?: EndpointBuilder
  private contextBuilder?: ContextBuilder

  constructor(request: Request<RequestPayload>) {
    this.request = request
  }

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
  abstract getFailResponse(
    type: string,
    message: string
  ): Response<ResponsePayload>

  /**
   * Adds a builder for the endpoint.
   * @returns A fluent mechanism for building an endpoint.
   */
  addEndpoint(): EndpointBuilder {
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
   * Generates a {@link Response} based on the current configuration.
   * @param namespace The namespace and interface for the operation.
   * @param name The name of the operation.
   * @param payloadVersion The version of the interface specified in the namespace field.
   * @param payload The request payload.
   * @returns The {@link Response}.
   */
  protected getPayloadEnvelope<TPayload>(
    namespace: string,
    name: string,
    payloadVersion: string,
    payload: TPayload
  ): Response<TPayload> {
    const response: Response<TPayload> = {
      event: {
        header: {
          namespace,
          name,
          payloadVersion,
          messageId: this.request.directive.header.messageId
        },
        payload
      }
    }

    if (this.request.directive.header.correlationToken) {
      response.event.header.correlationToken = this.request.directive.header.correlationToken
    }

    if (this.endpointBuilder) {
      const endpoint = this.endpointBuilder.getEndpoint()
      if (endpoint) {
        response.event.endpoint = endpoint
      }
    }

    if (this.contextBuilder) {
      const context = this.contextBuilder.getContext()
      if (context) {
        response.context = context
      }
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
  private cookie: { [key: string]: string } = {}

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
    if (
      !this.endpointId &&
      !this.token &&
      Object.keys(this.cookie).length === 0
    ) {
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
 * Represents a fluent mechanism for building a response context.
 */
export class ContextBuilder {
  private parent: ResponseBuilder
  private properties: PropState[] = []

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
      throw Error(
        `The following unchanged properties are duplicated: ${duplicates}`
      )
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
