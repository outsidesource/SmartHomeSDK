import { DiscoveryPayload } from '../../discovery/DiscoveryPayload'
import { Scope } from '../../response/Response'

/** Represents the payload for modifying a collection of endpoints associated with the skill. */
export interface AddOrUpdateReportPayload extends DiscoveryPayload {
  /** The Bearer token information associated with the request. */
  scope: Scope
}
