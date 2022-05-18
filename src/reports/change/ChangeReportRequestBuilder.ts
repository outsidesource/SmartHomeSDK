import { Request } from '../../outboundRequest/Request'
import { RequestBuilder } from '../../outboundRequest/RequestBuilder'
import {
  findPropStateDuplicates,
  getPropertyState,
  isSamePropState,
  PropState
} from '../../response/Response'
import { ChangeCauseType, ChangeReportPayload } from './ChangeReportPayload'

const namespace = 'Alexa'
const name = 'ChangeReport'
const payloadVersion = '3'

/**
 * Represents a {@link RequestBuilder} for a ChangeReport request to the event gateway.
 */
export class ChangeReportRequestBuilder extends RequestBuilder {
  private unchangedProperties: PropState[] = []
  private changedProperties: PropState[] = []

  constructor(endpointId: string, private changeCause: ChangeCauseType) {
    super()
    this.addEndpoint().withEndpointId(endpointId)
  }

  getRequestBody(): Request<ChangeReportPayload> {
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

    const duplicates = findPropStateDuplicates(this.changedProperties)

    if (duplicates.length > 0) {
      throw Error(
        `The following changed properties are duplicated: ${duplicates}`
      )
    }

    const intersection = this.unchangedProperties.filter(x =>
      this.changedProperties.find(y => isSamePropState(x, y))
    )

    if (intersection.length > 0) {
      throw Error(
        `The following properties cannot be both changed and unchanged: ${JSON.stringify(
          intersection
        )}`
      )
    }

    if (this.changedProperties.length === 0) {
      throw Error('At least one property must have changed.')
    }

    return this.getPayloadEnvelope(namespace, name, payloadVersion, {
      change: {
        cause: {
          type: this.changeCause
        },
        properties: this.changedProperties.map(prop => getPropertyState(prop))
      }
    })
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
  withUnchangedProperty(
    namespace: string,
    instance: string | undefined,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
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
  withChangedProperty(
    namespace: string,
    instance: string | undefined,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
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
