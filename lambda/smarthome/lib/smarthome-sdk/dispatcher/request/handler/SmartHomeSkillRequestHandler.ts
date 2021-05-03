import { RequestHandler } from 'ask-sdk-runtime'
import { Response } from '../../../response/Response'
import { HandlerInput } from './HandlerInput'

/**
 * An interface for user-created handler logic.
 */
export interface SmartHomeSkillRequestHandler extends RequestHandler<HandlerInput, Response> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle(input: HandlerInput): Promise<boolean> | boolean

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  handle(input: HandlerInput): Promise<Response> | Response
}
