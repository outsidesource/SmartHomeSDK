import { ResponseBuilder } from '../../responses/baseResponseBuilder'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../responses/payloads/types'
import { Response } from '../../responses/types'
import { PropState } from '../../util/types'

const namespace = 'Alexa'
const succeedName = 'StateReport'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for the ReportState directive.
 */
export class ReportStateResponseBuilder extends ResponseBuilder<EmptyResponsePayload> {
  private readonly properties: PropState[] = []

  getSucceedResponse (): Response<EmptyResponsePayload> {
    if (this.properties.length > 0) {
      const contextBuilder = this.addContext()
      this.properties.map(prop =>
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

    const envelope = this.getPayloadEnvelope(namespace, succeedName, payloadVersion, {})

    const endpointId = envelope.event.endpoint?.endpointId
    if (endpointId === undefined || endpointId === '') {
      throw new Error('An endpoint ID is required.')
    }

    return envelope
  }

  getFailResponse (type: string, message: string): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope(namespace, failName, payloadVersion, {
      type,
      message
    })
  }

  /**
   * Adds a report of a property value.
   * @param namespace The type of controller. This should match the `capabilities[i].interface` value given at discovery.
   * @param instance The name of the controller instance. This should match the `capabilities[i].instance` value given at discovery.
   * @param name The name of the property. This should match the `capabilities[i].properties.supported[j].name` value  given at discovery.
   * @param value The value of the property.
   * @param timeOfSample The date/time when the property was last updated.
   * @param uncertaintyInMilliseconds The uncertainty of the value in milliseconds.
   * @returns This builder.
   */
  withProperty (namespace: string, instance: string | undefined, name: string, value: unknown, timeOfSample: Date, uncertaintyInMilliseconds: number): this {
    this.properties.push({ namespace, instance, name, value, timeOfSample, uncertaintyInMilliseconds })
    return this
  }
}
