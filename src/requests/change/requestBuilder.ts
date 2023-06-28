import { ContextBuilder, EndpointBuilder, SmartHomeSkillRequestBuilder } from '../../requests/baseRequestBuilder'
import { Request } from '../../requests/types'
import { convertPropStateToPropertyState, findDuplicates, findIntersection, getPropStateKey, isSamePropState } from '../../util/helpers'
import { PropState } from '../../util/types'
import { ChangeCauseType, ChangeReportPayload } from './types'

const namespace = 'Alexa'
const name = 'ChangeReport'
const payloadVersion = '3'

/**
 * Represents a {@link SmartHomeSkillRequestBuilder} for a ChangeReport request to the event gateway.
 */
export class ChangeReportRequestBuilder extends SmartHomeSkillRequestBuilder<ChangeReportPayload> {
  private endpointBuilder?: EndpointBuilder<ChangeReportRequestBuilder, ChangeReportPayload>
  private contextBuilder?: ContextBuilder<ChangeReportRequestBuilder, ChangeReportPayload>
  private readonly unchangedProperties: PropState[] = []
  private readonly changedProperties: PropState[] = []

  constructor (endpointId: string, private readonly changeCause: ChangeCauseType) {
    super()
    this.addEndpoint().withEndpointId(endpointId)
  }

  getRequestBody (): Request<ChangeReportPayload> {
    if (this.unchangedProperties.length > 0) {
      const contextBuilder = this.addContext()
      this.unchangedProperties.map(prop =>
        contextBuilder.withProperty(
          prop.namespace,
          prop.instance,
          prop.name,
          prop.value,
          prop.timeOfSample,
          prop.uncertaintyInMilliseconds
        )
      )
    }

    const duplicates = findDuplicates(this.changedProperties, getPropStateKey)
    if (duplicates.length > 0) {
      throw Error(`The following changed properties are duplicated: ${duplicates.join()}`)
    }

    const intersection = findIntersection(this.unchangedProperties, this.changedProperties, isSamePropState)
    if (intersection.length > 0) {
      throw Error(`The following properties cannot be both changed and unchanged: ${JSON.stringify(intersection)}`)
    }

    if (this.changedProperties.length === 0) {
      throw Error('At least one property must have changed.')
    }

    const payload = this.getChangeReportPayload(this.changeCause, this.changedProperties)

    const request: Request<ChangeReportPayload> = this.getPayloadEnvelope(namespace, name, payloadVersion, undefined, payload)

    /* istanbul ignore else: only here to satisfy the type checker. can't actually happen */
    if (this.endpointBuilder !== undefined) {
      request.event.endpoint = this.endpointBuilder.getEndpoint()
    }

    /* istanbul ignore else: only here to satisfy the type checker. can't actually happen */
    if (this.contextBuilder !== undefined) {
      request.context = this.contextBuilder.getContext()
    }

    return request
  }

  private getChangeReportPayload (changeCause: ChangeCauseType, changedProperties: PropState[]): ChangeReportPayload {
    return {
      change: {
        cause: {
          type: changeCause
        },
        properties: changedProperties.map(convertPropStateToPropertyState)
      }
    }
  }

  /**
   * Adds a builder for the endpoint.
   * @returns A fluent mechanism for building an endpoint.
   */
  addEndpoint (): EndpointBuilder<ChangeReportRequestBuilder, ChangeReportPayload> {
    if (this.endpointBuilder !== undefined) {
      return this.endpointBuilder
    }
    return (this.endpointBuilder = new EndpointBuilder(this))
  }

  /**
   * Adds a builder for the context.
   * @returns A fluent mechanism for building a context.
   */
  addContext (): ContextBuilder<ChangeReportRequestBuilder, ChangeReportPayload> {
    if (this.contextBuilder !== undefined) {
      return this.contextBuilder
    }
    return (this.contextBuilder = new ContextBuilder(this))
  }

  /**
   * Adds a report of an unchanged property value
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param instance The name of the controller instance. This should match the `capabilities[i].instance` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withUnchangedProperty (namespace: string, instance: string | undefined, name: string, value: unknown, timeOfSample: Date, uncertaintyInMilliseconds: number): this {
    this.unchangedProperties.push({
      namespace,
      instance,
      name,
      value,
      timeOfSample,
      uncertaintyInMilliseconds
    })
    return this
  }

  /**
   * Adds a report of a changed property value
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param instance The name of the controller instance. This should match the `capabilities[i].instance` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withChangedProperty (namespace: string, instance: string | undefined, name: string, value: unknown, timeOfSample: Date, uncertaintyInMilliseconds: number): this {
    this.changedProperties.push({
      namespace,
      instance,
      name,
      value,
      timeOfSample,
      uncertaintyInMilliseconds
    })
    return this
  }
}
