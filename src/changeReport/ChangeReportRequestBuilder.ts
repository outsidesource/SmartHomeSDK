import { ChangeCauseType, ChangeReportPayload } from './ChangeReportPayload'
import { Request } from './Request'
import { RequestBuilder } from './RequestBuilder'

const namespace = 'Alexa'
const name = 'ChangeReport'
const payloadVersion = '3'

/**
 * Represents a {@link RequestBuilder} for a ChangeReport request to the event gateway.
 */
export class ChangeReportRequestBuilder extends RequestBuilder {
  private unchangedProperties: PropState[] = []
  private changedProperties: PropState[] = []
  private changeCause: ChangeCauseType

  constructor(
    messageId: string,
    endpointId: string,
    changeCause: ChangeCauseType
  ) {
    super(messageId, endpointId)
    this.changeCause = changeCause
  }

  getRequestBody(): Request<ChangeReportPayload> {
    let duplicates = findDuplicates(this.unchangedProperties)

    if (duplicates.length > 0) {
      throw Error(
        `The following unchanged properties are duplicated: ${JSON.stringify(
          duplicates
        )}`
      )
    }

    duplicates = findDuplicates(this.changedProperties)

    if (duplicates.length > 0) {
      throw Error(
        `The following changed properties are duplicated: ${JSON.stringify(
          duplicates
        )}`
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

    if (this.unchangedProperties.length > 0) {
      const contextBuilder = this.addContext()
      this.unchangedProperties.map(prop =>
        contextBuilder.withProperty(
          prop.namespace,
          prop.name,
          prop.value,
          prop.timeOfSample,
          prop.uncertaintyInMilliseconds
        )
      )
    }

    return this.getPayloadEnvelope(namespace, name, payloadVersion, {
      change: {
        cause: {
          type: this.changeCause
        },
        properties: this.changedProperties.map(prop => ({
          namespace: prop.namespace,
          name: prop.name,
          value: prop.value,
          timeOfSample: prop.timeOfSample.toISOString(),
          uncertaintyInMilliseconds: prop.uncertaintyInMilliseconds
        }))
      }
    })
  }

  /**
   * Adds a report of an unchanged property value
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withUnchangedProperty(
    namespace: string,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
    this.unchangedProperties.push({
      namespace,
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
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withChangedProperty(
    namespace: string,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
    this.changedProperties.push({
      namespace,
      name,
      value,
      timeOfSample,
      uncertaintyInMilliseconds
    })
    return this
  }
}

/** Represents a PropertyState with a Date timestamp. */
interface PropState {
  /**
   * The type of controller. This should match the
   * `capabilities[i].interface` value given at discovery.
   */
  namespace: string

  /**
   * The name of the property. This should match the
   * `capabilities[i].properties.supported[j].name` value
   * given at discovery.
   */
  name: string

  /** The value of the property. */
  value: unknown

  /** The date/time when the property was sampled. */
  timeOfSample: Date

  /** The uncertainty of the value in milliseconds. */
  uncertaintyInMilliseconds: number
}

const isSamePropState = (x: PropState, y: PropState) => {
  return x.namespace === y.namespace && x.name === y.name
}

const findDuplicates = (arr: PropState[]) => {
  const histo = histogram(arr)
  return Object.keys(histo).filter(key => histo[key] > 1)
}

const histogram = (arr: PropState[]) => {
  return arr.reduce((histo: { [key: string]: number }, prop) => {
    const key = JSON.stringify(prop)
    return { ...histo, [key]: (histo[key] || 0) + 1 }
  }, {})
}
