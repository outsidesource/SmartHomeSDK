import { ScopedSmartHomeSkillRequestBuilder } from '../../outboundRequest/scopedRequestBuilder'
import { Request } from '../../outboundRequest/types'
import { findDuplicates } from '../../util/helpers'
import { DeleteReportPayload } from './types'

const namespace = 'Alexa.Discovery'
const name = 'DeleteReport'
const payloadVersion = '3'

/**
 * Represents a {@link SmartHomeSkillRequestBuilder} for a DeleteReport request to the event gateway.
 */
export class DeleteReportRequestBuilder extends ScopedSmartHomeSkillRequestBuilder<DeleteReportPayload> {
  private readonly endpointIds: string[] = []

  /**
   * Generates a request body with endpoints to remove.
   * @returns The compiled request body.
   */
  getRequestBody (): Request<DeleteReportPayload> {
    if (this.endpointIds.length === 0) {
      throw Error('At least one endpoint is required.')
    }

    const duplicates = findDuplicates(this.endpointIds, id => id)
    if (duplicates.length > 0) {
      throw new Error(`Duplicate endpoint ids found for the following: ${JSON.stringify(duplicates)}`)
    }

    const payload = this.getDeleteReportPayload(this.endpointIds)

    return this.getPayloadEnvelope(namespace, name, payloadVersion, payload)
  }

  private getDeleteReportPayload (endpointIds: string[]): DeleteReportPayload {
    return {
      endpoints: endpointIds.map(id => ({ endpointId: id })),
      scope: this.getScope()
    }
  }

  /**
   * Adds an endpoint to the list of endpoints to remove.
   * @param endpointId The identifier for the endpoint. The identifier must be unique across all devices for the skill. The identifier must be consistent for all discovery, addOrUpdate, and delete requests for the same device. An identifier can contain letters or numbers, spaces, and the following special characters: _ - = # ; : ? @ &. The identifier can't exceed 256 characters.
   * @returns This builder.
   */
  addEndpointId (endpointId: string): this {
    this.endpointIds.push(endpointId)
    return this
  }
}
