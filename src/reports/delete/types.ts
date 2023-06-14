import { Scope } from '../../response/types'

/** Represents the payload for removing a collection of endpoints associated with the skill. */
export interface DeleteReportPayload {
  /**
   * The endpoints to delete.
   */
  endpoints: Array<{
    /**
     * The identifier for the endpoint. The identifier must be unique
     * across all devices for the skill. The identifier must be consistent
     * for all discovery, addOrUpdate, and delete requests for the same device.
     */
    endpointId: string
  }>

  /** The Bearer token information associated with the request. */
  scope: Scope
}
