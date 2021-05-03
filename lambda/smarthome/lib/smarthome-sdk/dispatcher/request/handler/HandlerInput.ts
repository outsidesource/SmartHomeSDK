import { LambdaContext } from './LambdaContext'
import { Request, RequestPayload } from './Request'

/**
 * An interface that represents components passed into {@link SmartHomeSkillRequestHandler} and {@link SmartHomeSkillErrorHandler}.
 */
export interface HandlerInput {
  /**
   * The directive and payload for the request.
   */
  request: Request<RequestPayload>

  /**
   * The context that the lambda is running in.
   */
  context?: LambdaContext
}
