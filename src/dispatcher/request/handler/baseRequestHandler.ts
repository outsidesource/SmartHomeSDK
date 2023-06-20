/* istanbul ignore file */

import { RequestHandler } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../response/baseResponseBuilder'
import { Response } from '../../../response/types'
import { HandlerInput } from './types'

/**
 * A base implementation for request handler logic.
 */
export abstract class SmartHomeSkillRequestHandler<TRequestPayload, TResponseBuilder extends ResponseBuilder, TResponsePayload> implements RequestHandler<HandlerInput<TRequestPayload, TResponseBuilder>, Response<TResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  abstract canHandle (input: HandlerInput<TRequestPayload, TResponseBuilder>): boolean | Promise<boolean>

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<TRequestPayload, TResponseBuilder>): Response<TResponsePayload> | Promise<Response<TResponsePayload>>
}
