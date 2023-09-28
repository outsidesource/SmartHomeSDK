import { type Context, type Scope } from '../util/types'

/**
 * Contains the header, payload, and context for a response.
 */
export interface Response<TPayload = unknown> {
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
    endpoint?: ResponseEndpoint

    /** The response payload. */
    payload: TPayload
  }

  /** Contains addition information pertinent to the request. */
  context?: Context
}

/**
 * Contains information about the endpoint that handled the request.
 */
export interface ResponseEndpoint {
  /** The Bearer token information associated with the request. */
  scope?: Scope

  /** The ID of the endpoint that handled the request. */
  endpointId?: string

  /** Additional information about the endpoint. */
  cookie?: Record<string, string>
}
