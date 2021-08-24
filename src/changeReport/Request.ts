import { Context, Scope } from '../response/Response'
/**
 * Contains the header, payload, and context for a request.
 */
 export interface Request<TPayload extends RequestPayload> {
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

    /** Contains information about the endpoint making the request. */
    endpoint: RequestEndpoint,

    /** The request payload. */
    payload: TPayload,
  },

  /** Contains addition information pertinent to the request. */
  context?: Context,
}

/**
 * Base interface for all request payloads.
 */
export interface RequestPayload {
}

export interface RequestEndpoint {
  /** The Bearer token information associated with the request. */
  scope?: Scope,

  /** The ID of the endpoint making the request. */
  endpointId: string,

  /** Additional information about the endpoint. */
  cookie?: { [key: string]: string },
}
