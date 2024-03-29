import { type Context } from 'aws-lambda'
import { type AttributesManager } from '../../../../attributes/types'
import { type ResponseBuilder } from '../../../../responses/baseResponseBuilder'
import { type HandlerInput, type Request } from '../types'

/**
 * Provides a strategy for creating {@link HandlerInput} for a given request and context.
 */
export interface HandlerInputFactory<TRequestPayload, TResponseBuilder extends ResponseBuilder<TResponsePayload>, TResponsePayload> {
  /**
   * A predicate that determines if this factory can create a {@link HandlerInput} for a given request and context.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  canCreate: (request: Request<unknown>, context: Context) => boolean

  /**
   * Fulfills the request and returns a valid response.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   * @param attributesManager The service that stores/retrieves attributes.
   */
  create: (request: Request<TRequestPayload>, context: Context, attributesManager: AttributesManager) => HandlerInput<TRequestPayload, TResponseBuilder, TResponsePayload> | undefined
}
