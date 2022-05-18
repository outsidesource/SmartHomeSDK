import { v4 as uuidv4 } from 'uuid'
import { Request, RequestEndpoint } from '../../outboundRequest/Request'
import {
  Context,
  findPropStateDuplicates,
  getPropertyState,
  isSamePropState,
  PropState
} from '../../response/Response'
import { ChangeCauseType, ChangeReportPayload } from './ChangeReportPayload'

const namespace = 'Alexa'
const name = 'ChangeReport'
const payloadVersion = '3'

/**
 * Represents a {@link RequestBuilder} for a ChangeReport request to the event gateway.
 */
export class ChangeReportRequestBuilder {
  private messageId: string
  private endpointBuilder?: EndpointBuilder
  private contextBuilder?: ContextBuilder
  private unchangedProperties: PropState[] = []
  private changedProperties: PropState[] = []

  constructor(endpointId: string, private changeCause: ChangeCauseType) {
    this.messageId = uuidv4()
    this.addEndpoint().withEndpointId(endpointId)
  }

  getRequestBody(): Request<ChangeReportPayload> {
    if (this.unchangedProperties.length > 0) {
      const contextBuilder = this.addContext()
      this.unchangedProperties.map(prop =>
        contextBuilder.withProperty(
          prop.namespace,
          prop.instance,
          prop.name,
          prop.value,
          prop.timeOfSample,
          prop.uncertaintyInMilliseconds
        )
      )
    }

    const duplicates = findPropStateDuplicates(this.changedProperties)

    if (duplicates.length > 0) {
      throw Error(
        `The following changed properties are duplicated: ${duplicates}`
      )
    }

    const intersection = this.unchangedProperties.filter(x =>
      this.changedProperties.find(y => isSamePropState(x, y))
    )

    if (intersection.length > 0) {
      throw Error(
        `The following properties cannot be both changed and unchanged: ${JSON.stringify(
          intersection
        )}`
      )
    }

    if (this.changedProperties.length === 0) {
      throw Error('At least one property must have changed.')
    }

    const payload = {
      change: {
        cause: {
          type: this.changeCause
        },
        properties: this.changedProperties.map(prop => getPropertyState(prop))
      }
    }

    const request: Request<ChangeReportPayload> = {
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
   * Adds a report of an unchanged property value
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param instance The name of the controller instance. This should match the `capabilities[i].instance` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withUnchangedProperty(
    namespace: string,
    instance: string | undefined,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
    this.unchangedProperties.push({
      namespace,
      instance,
      name,
      value,
      timeOfSample,
      uncertaintyInMilliseconds
    })
    return this
  }

  /**
   * Adds a report of a changed property value
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param instance The name of the controller instance. This should match the `capabilities[i].instance` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withChangedProperty(
    namespace: string,
    instance: string | undefined,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
    this.changedProperties.push({
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

/**
 * Represents a fluent mechanism for building an endpoint.
 */
export class EndpointBuilder {
  private endpointId?: string
  private token?: string
  private partition?: string
  private userId?: string
  private cookie: { [key: string]: string } = {}

  constructor(private parent: ChangeReportRequestBuilder) {}

  /**
   * Returns the {@link ChangeReportRequestBuilder} that created this builder.
   * @returns The {@link ChangeReportRequestBuilder} that created this builder.
   */
  getRequestBuilder(): ChangeReportRequestBuilder {
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
  private properties: PropState[] = []

  constructor(private parent: ChangeReportRequestBuilder) {}

  /**
   * Returns the {@link ChangeReportRequestBuilder} that created this builder.
   * @returns The {@link ChangeReportRequestBuilder} that created this builder.
   */
  getRequestBuilder(): ChangeReportRequestBuilder {
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
