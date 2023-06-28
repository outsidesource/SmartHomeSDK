import { ContextBuilder } from '../../requests/baseRequestBuilder'
import { Request } from '../../requests/types'
import { ScopedSmartHomeSkillRequestBuilder } from '../scopedRequestBuilder'

const namespace = 'Alexa'
const name = 'Response'
const payloadVersion = '3'

/**
 * Represents a {@link SmartHomeSkillRequestBuilder} for a deferred response follow up request to the event gateway.
 */
export class DeferredFollowUpRequestBuilder extends ScopedSmartHomeSkillRequestBuilder<unknown> {
  private contextBuilder?: ContextBuilder<DeferredFollowUpRequestBuilder, unknown>

  constructor (private readonly endpointId: string, private readonly correlationToken: string) {
    super()
  }

  /**
   * Generates an outbound request. If you need a payload other than an empty object, either extend this class or set the payload in your caller.
   * @returns The compiled request.
   */
  getRequestBody (): Request<unknown> {
    const context = this.contextBuilder?.getContext()
    if (context === undefined) {
      throw new Error('At least one property must be reported.')
    }

    const request = this.getPayloadEnvelope(namespace, name, payloadVersion, this.correlationToken, {})

    request.event.endpoint = {
      endpointId: this.endpointId,
      scope: this.getScope()
    }
    request.context = context

    return request
  }

  /**
   * Adds a builder for the context.
   * @returns A fluent mechanism for building a context.
   */
  addContext (): ContextBuilder<DeferredFollowUpRequestBuilder, unknown> {
    if (this.contextBuilder !== undefined) {
      return this.contextBuilder
    }
    return (this.contextBuilder = new ContextBuilder(this))
  }
}
