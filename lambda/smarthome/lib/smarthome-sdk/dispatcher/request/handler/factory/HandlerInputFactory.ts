import { ResponseBuilder } from '../../../../response/ResponseBuilder'
import { HandlerInput } from '../HandlerInput'
import { LambdaContext } from '../LambdaContext'
import { Request, RequestPayload } from '../Request'

/**
 * Provides a strategy for creating {@link HandlerInput} for a given request and context.
 */
export interface HandlerInputFactory<TResponseBuilder extends ResponseBuilder> {
  /**
   * A predicate that determines if this factory can create a {@link HandlerInput} for a given request and context.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  canCreate(request: Request<RequestPayload>, context?: LambdaContext): boolean

  /**
   * Fulfills the request and returns a valid response.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  create(request: Request<RequestPayload>, context?: LambdaContext): HandlerInput<TResponseBuilder> | undefined
 }
