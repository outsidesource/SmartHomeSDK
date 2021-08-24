/**
 * Contains the header, payload, and context for a response.
 */
export interface Response<TPayload extends ResponsePayload> {
  event: {
    header: {
      /** The namespace and interface for the operation in the message. */
      namespace: string

      /** The name of the operation in the message. */
      name: string

      /** A unique identifier for each message. The message ID is used for tracking purposes. You should log the message ID, but don't use the message ID to program business logic. Any string of alphanumeric characters and dashes of fewer than 128 characters is valid, but a version 4 UUID, which is a UUID generated from random numbers, is recommended. */
      messageId: string

      /** An opaque token from the sender. If a message you receive from Alexa includes a correlation token, include the correlation token in your response message. When you send a response asynchronously to the Alexa event gateway you must include the same correlation token that you received from Alexa. When you send a proactive message to the Alexa event gateway you must include a correlation token that you create. */
      correlationToken?: string

      /** The version of the interface specified in the namespace field. */
      payloadVersion: string
    }

    /** Contains information about the endpoint that handled the request. */
    endpoint?: Endpoint

    /** The response payload. */
    payload: TPayload
  }

  /** Contains addition information pertinent to the request. */
  context?: Context
}

/**
 * Base interface for all response payloads.
 */
export interface ResponsePayload {}

export interface Endpoint {
  /** The Bearer token information associated with the request. */
  scope?: Scope

  /** The ID of the endpoint that handled the request. */
  endpointId?: string

  /** Additional information about the endpoint. */
  cookie?: { [key: string]: string }
}

/** Represents a Bearer token. */
export type Scope = BearerTokenScope | BearerTokenWithPartitionScope

/** Represents a simple Bearer token. */
export interface BearerTokenScope {
  type: 'BearerToken'

  /** The token for identifying and accessing a linked user account. */
  token: string
}

/** Represents a partitioned Bearer token. */
export interface BearerTokenWithPartitionScope {
  type: 'BearerTokenWithPartition'

  /** The token for identifying and accessing a linked user account. */
  token: string

  /** The location target for the request such as a room name or number. */
  partition: string

  /** A unique identifier for the user who made the request. Don't rely on {@link userId} to identify users, use {@link token} instead. */
  userId: string
}

/** Represents addition information pertinent to the request. */
export interface Context {
  /** Contains information about an interface's property values. */
  properties?: PropertyState[]
}

/** Represents an interface's property values. */
export interface PropertyState {
  /**
   * The type of controller. This should match the
   * `capabilities[i].interface` value given at discovery.
   */
  namespace: string

  /**
   * The name of the property. This should match the
   * `capabilities[i].properties.supported[j].name` value
   * given at discovery.
   */
  name: string

  /** The value of the property. */
  value: unknown

  /** The date/time when the property was sampled. This should be an ISO-8601 string of the date/time with zero offset. */
  timeOfSample: string

  /** The uncertainty of the value in milliseconds. */
  uncertaintyInMilliseconds: number
}