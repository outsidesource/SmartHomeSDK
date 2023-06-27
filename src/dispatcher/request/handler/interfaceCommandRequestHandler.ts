import { InterfaceCommandResponseBuilder } from '../../../directives/interfaceCommand/responseBuilder'
import { ErrorResponsePayload } from '../../../responses/payloads/types'
import { Response } from '../../../responses/types'
import { SmartHomeSkillRequestHandler } from './baseRequestHandler'
import { HandlerInput } from './types'

/**
 * A base implementation for user-created handler logic for interface commands.
 */
export abstract class InterfaceCommandRequestHandler implements SmartHomeSkillRequestHandler<unknown, InterfaceCommandResponseBuilder, unknown | ErrorResponsePayload> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  canHandle (input: HandlerInput<unknown, InterfaceCommandResponseBuilder, unknown>): boolean | Promise<boolean> {
    return true
  }

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle (input: HandlerInput<unknown, InterfaceCommandResponseBuilder, unknown>): Response<unknown | ErrorResponsePayload> | Promise<Response<unknown | ErrorResponsePayload>>
}
