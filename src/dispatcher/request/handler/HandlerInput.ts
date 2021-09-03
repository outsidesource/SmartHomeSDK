import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { LambdaContext } from './LambdaContext'
import { Request, RequestPayload } from './Request'

/**
 * An interface that represents components passed into {@link RequestHandler} and {@link SmartHomeSkillErrorHandler}.
 */
export interface HandlerInput<
  TRequestPayload extends RequestPayload,
  TResponseBuilder extends ResponseBuilder
> {
  /**
   * The directive and payload for the request.
   */
  request: Request<TRequestPayload>

  /**
   * The context that the lambda is running in.
   */
  context?: LambdaContext

  /**
   * The builder to create a response.
   */
  responseBuilder: TResponseBuilder
}
