/**
 * Contains information about the request, specifically the header and payload.
 */
export interface Request<TPayload extends RequestPayload> {
  directive: {
    header: {
      namespace: string,
      name: string,
      messageId: string,
      payloadVersion: string,
    },
    payload?: TPayload,
  }
}

/**
 * An interface for identifying payload types.
 */
export interface PayloadSignature { 
  namespace: string, 
  name: string, 
  payloadVersion: string, 
}

/**
 * Base interface for all request payloads.
 */
export interface RequestPayload {
}
