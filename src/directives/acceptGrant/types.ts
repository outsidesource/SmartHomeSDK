/**
 * Error types exclusive to AcceptGrant directives.
 */
export enum AcceptGrantErrorTypes {
  /** The AcceptGrant directive failed. */
  AcceptGrantFailed = 'ACCEPT_GRANT_FAILED'
}

/**
 * A payload representing an AcceptGrant request.
 * {@see https://developer.amazon.com/en-US/docs/alexa/device-apis/alexa-authorization.html}
 */
export interface AcceptGrantRequestPayload {
  /** Information that identifies a user in Amazon Alexa systems. */
  grant: {
    /** The type of grant. Currently, the only valid value is {@link OAuth2.AuthorizationCode}. */
    type: string

    /** An authorization code for the user. */
    code: string
  }
  /** Information that identifies a user in a linked account service or system. */
  grantee: {
    /** The type of grantee. Currently, the only valid value is {@code BearerToken}. */
    type: string

    /** The user access token received by Alexa during the account linking process. */
    token: string
  }
}
