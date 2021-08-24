/**
 * Contains information about the request, specifically the header and payload.
 */
export interface Request<TPayload extends RequestPayload> {
  directive: {
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

    /** Contains optional information about which endpoint the directive is targetting. */
    endpoint?: {
      /** The endpoint ID that is being targetted. */
      endpointId: string

      /** Contains additional data associated with the endpoint. */
      cookie?: {
        [key: string]: string
      }

      /** Contains credentials that can be used with the request. */
      scope?: {
        /** Should always be "BearerToken". */
        type: 'BearerToken'

        /** An OAuth2 bearer token. */
        token: string
      }
    }

    /** The request payload. */
    payload?: TPayload
  }
}

/**
 * An interface for identifying payload types.
 */
export interface PayloadSignature {
  /** The namespace and interface for the operation in the message. */
  namespace: string

  /** The name of the operation in the message. */
  name: string

  /** The version of the interface specified in the namespace field. */
  payloadVersion: string
}

/**
 * Base interface for all request payloads.
 */
export interface RequestPayload {}
