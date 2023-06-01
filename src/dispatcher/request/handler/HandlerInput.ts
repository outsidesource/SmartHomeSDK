import { Context } from 'aws-lambda'
import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { Request } from './Request'

/**
 * An interface that represents components passed into {@link RequestHandler} and {@link SmartHomeSkillErrorHandler}.
 */
export interface HandlerInput<TRequestPayload, TResponseBuilder extends ResponseBuilder> {
  /**
   * The directive and payload for the request.
   */
  request: Request<TRequestPayload>

  /**
   * The context that the lambda is running in.
   */
  context: Context

  /**
   * The builder to create a response.
   */
  responseBuilder: TResponseBuilder
}
