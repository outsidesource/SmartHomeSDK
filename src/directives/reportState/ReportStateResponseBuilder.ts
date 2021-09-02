import {
  Request,
  RequestPayload
} from '../../dispatcher/request/handler/Request'
import { EmptyResponsePayload } from '../../response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../../response/payloads/ErrorResponsePayload'
import { Response } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'

const namespace = 'Alexa'
const succeedName = 'StateReport'
const failName = 'ErrorResponse'
const payloadVersion = '3'

/**
 * Represents a {@link ResponseBuilder} for the ReportState directive.
 */
export class ReportStateResponseBuilder extends ResponseBuilder {
  private properties: PropState[] = []

  constructor(request: Request<RequestPayload>) {
    super(request)
  }

  getSucceedResponse(): Response<EmptyResponsePayload> {
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

    const envelope = this.getPayloadEnvelope(
      namespace,
      succeedName,
      payloadVersion,
      {}
    )

    if (!envelope.event.endpoint?.endpointId) {
      throw Error('An endpoint ID is required.')
    }

    return envelope
  }

  getFailResponse(
    type: string,
    message: string
  ): Response<ErrorResponsePayload> {
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
  withProperty(
    namespace: string,
    instance: string | undefined,
    name: string,
    value: unknown,
    timeOfSample: Date,
    uncertaintyInMilliseconds: number
  ): this {
    this.properties.push({
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

/** Represents a PropertyState with a Date timestamp. */
interface PropState {
  /**
   * The type of controller. This should match the
   * `capabilities[i].interface` value given at discovery.
   */
  namespace: string

  /**
   * The name of the instance. This should match the
   * `capabilities[i].instance` value given at discovery.
   */
  instance?: string

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
