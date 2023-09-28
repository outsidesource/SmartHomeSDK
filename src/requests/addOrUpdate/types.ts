import { type DiscoveryPayload } from '../../discovery/payload'
import { type Scope } from '../../util/types'

/** Represents the payload for modifying a collection of endpoints associated with the skill. */
export interface AddOrUpdateReportPayload extends DiscoveryPayload {
  /** The Bearer token information associated with the request. */
  scope: Scope
}
