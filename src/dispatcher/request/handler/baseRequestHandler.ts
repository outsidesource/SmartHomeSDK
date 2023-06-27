/* istanbul ignore file */

import { RequestHandler } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../responses/baseResponseBuilder'
import { Response } from '../../../responses/types'
import { HandlerInput } from './types'

/**
 * A base implementation for request handler logic.
 */
export abstract class SmartHomeSkillRequestHandler<TRequestPayload, TResponseBuilder extends ResponseBuilder<TResponsePayload>, TResponsePayload> implements RequestHandler<HandlerInput<TRequestPayload, TResponseBuilder, TResponsePayload>, Response<TResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  abstract canHandle (input: HandlerInput<TRequestPayload, TResponseBuilder, TResponsePayload>): boolean | Promise<boolean>

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<TRequestPayload, TResponseBuilder, TResponsePayload>): Response<TResponsePayload> | Promise<Response<TResponsePayload>>
}
