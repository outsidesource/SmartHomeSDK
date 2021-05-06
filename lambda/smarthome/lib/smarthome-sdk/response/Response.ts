/**
 * Contains the header and payload response.
 */
export interface Response<TPayload extends ResponsePayload> {
  event: {
    header: {
      /** The namespace and interface for the operation in the message. */
      namespace: string,

      /** The name of the operation in the message. */
      name: string,

      /** A unique identifier for each message. The message ID is used for tracking purposes. You should log the message ID, but don't use the message ID to program business logic. Any string of alphanumeric characters and dashes of fewer than 128 characters is valid, but a version 4 UUID, which is a UUID generated from random numbers, is recommended. */
      messageId: string,

      /** The version of the interface specified in the namespace field. */
      payloadVersion: string,
    },

    /** Contains information about the endpoint that handled the request. */
    endpoint?: Endpoint,

    /** The response payload. */
    payload: TPayload,
  }
}

/**
 * Base interface for all response payloads.
 */
export interface ResponsePayload {
}

export interface Endpoint {
  /** The Bearer token information associated with the request. */
  scope?: Scope,

  /** The ID of the endpoint that handled the request. */
  endpointId?: string,
}

/** Represents a Bearer token. */
export type Scope = BearerTokenScope | BearerTokenWithPartitionScope

/** Represents a simple Bearer token. */
export interface BearerTokenScope {
  type: 'BearerToken',

  /** The token for identifying and accessing a linked user account. */
  token: string,
}

/** Represents a partitioned Bearer token. */
export interface BearerTokenWithPartitionScope {
  type: 'BearerTokenWithPartition',

  /** The token for identifying and accessing a linked user account. */
  token: string,

  /** The location target for the request such as a room name or number. */
  partition: string,

  /** A unique identifier for the user who made the request. Don't rely on {@link userId} to identify users, use {@link token} instead. */
  userId: string,
}
