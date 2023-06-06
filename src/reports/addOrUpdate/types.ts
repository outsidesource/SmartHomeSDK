import { DiscoveryPayload } from '../../discovery/payload'
import { Scope } from '../../response/types'

/** Represents the payload for modifying a collection of endpoints associated with the skill. */
export interface AddOrUpdateReportPayload extends DiscoveryPayload {
  /** The Bearer token information associated with the request. */
  scope: Scope
}
