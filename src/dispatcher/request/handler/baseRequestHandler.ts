/* istanbul ignore file */

import { RequestHandler } from 'ask-sdk-runtime'
import { ResponseBuilder } from '../../../response/baseResponseBuilder'
import { ErrorResponsePayload } from '../../../response/payloads/types'
import { Response } from '../../../response/types'
import { HandlerInput } from './types'

/**
 * A base implementation for request handler logic.
 */
export abstract class SmartHomeSkillRequestHandler implements RequestHandler<HandlerInput<unknown, ResponseBuilder>, Response<unknown | ErrorResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  abstract canHandle (input: HandlerInput<unknown, ResponseBuilder>): boolean | Promise<boolean>

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<unknown, ResponseBuilder>): Response<unknown | ErrorResponsePayload> | Promise<Response<unknown | ErrorResponsePayload>>
}
