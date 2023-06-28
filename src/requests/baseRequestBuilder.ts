import { v4 as uuidv4 } from 'uuid'
import { convertPropStateToPropertyState, findDuplicates, getPropStateKey } from '../util/helpers'
import { Context, PropState } from '../util/types'
import { Request, RequestEndpoint } from './types'

/**
 * A base implementation for outbound request builders.
 */
export abstract class SmartHomeSkillRequestBuilder<TPayload> {
  private messageId: string

  constructor () {
    this.messageId = uuidv4()
  }

  /**
   * Generates an outbound request.
   * @returns The compiled request.
   */
  abstract getRequestBody (): Request<TPayload>

  /**
   * Generates a {@link Request} based on the current configuration.
   * @param namespace The namespace and interface for the operation.
   * @param name The name of the operation.
   * @param payloadVersion The version of the interface specified in the namespace field.
   * @param correlationToken The token used in a prior deferred response, if applicable.
   * @param payload The request payload.
   * @returns The {@link Request}.
   */
  protected getPayloadEnvelope (namespace: string, name: string, payloadVersion: string, correlationToken: string | undefined, payload: TPayload): Request<TPayload> {
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

    if (correlationToken !== undefined && correlationToken !== '') {
      request.event.header.correlationToken = correlationToken
    }

    return request
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
}

/**
 * Represents a fluent mechanism for building an endpoint.
 */
export class EndpointBuilder<TParentRequestBuilder extends SmartHomeSkillRequestBuilder<TPayload>, TPayload> {
  private endpointId?: string
  private token?: string
  private partition?: string
  private userId?: string
  private cookie: { [key: string]: string } = {}

  constructor (private readonly parent: TParentRequestBuilder) {}

  /**
   * Returns the {@link ChangeReportRequestBuilder} that created this builder.
   * @returns The {@link ChangeReportRequestBuilder} that created this builder.
   */
  getRequestBuilder (): TParentRequestBuilder {
    return this.parent
  }

  /**
   * Generates a {@link RequestEndpoint} based on the current configuration.
   * @returns The {@link RequestEndpoint}.
   */
  getEndpoint (): RequestEndpoint | undefined {
    if (this.endpointId === undefined || this.endpointId === '') {
      return undefined
    }

    const endpoint: RequestEndpoint = {
      endpointId: this.endpointId
    }

    if (this.token !== undefined && this.token !== '') {
      if (this.partition !== undefined && this.partition !== '' && this.userId !== undefined && this.userId !== '') {
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
  withEndpointId (endpointId: string): this {
    this.endpointId = endpointId
    return this
  }

  /**
   * Sets an OAuth 2 bearer token with no partition.
   * @param token The token for identifying and accessing a linked user account.
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
   * @param token The token for identifying and accessing a linked user account.
   * @param partition The location target for the request such as a room name or number.
   * @param userId A unique identifier for the user who made the request. Don't rely on {@link userId} to identify users, use {@link token} instead.
   * @returns This builder.
   */
  withPartitionedToken (token: string, partition: string, userId: string): this {
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
  withCookie (name: string, value: string): this {
    this.cookie[name] = value
    return this
  }
}

/**
 * Represents a fluent mechanism for building a request context.
 */
export class ContextBuilder<TParentRequestBuilder extends SmartHomeSkillRequestBuilder<TPayload>, TPayload> {
  private readonly properties: PropState[] = []

  constructor (private readonly parent: TParentRequestBuilder) {}

  /**
   * Returns the {@link ChangeReportRequestBuilder} that created this builder.
   * @returns The {@link ChangeReportRequestBuilder} that created this builder.
   */
  getRequestBuilder (): TParentRequestBuilder {
    return this.parent
  }

  /**
   * Generates a {@link Context} based on the current configuration.
   * @returns The {@link Context}.
   */
  getContext (): Context | undefined {
    const context: Context = {}

    if (this.properties.length === 0) {
      return undefined
    }

    const duplicates = findDuplicates(this.properties, getPropStateKey)
    if (duplicates.length > 0) {
      throw new Error(`The following properties are duplicated: ${duplicates.join()}`)
    }

    context.properties = this.properties.map(convertPropStateToPropertyState)

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
  withProperty (namespace: string, instance: string | undefined, name: string, value: unknown, timeOfSample: Date, uncertaintyInMilliseconds: number): this {
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
