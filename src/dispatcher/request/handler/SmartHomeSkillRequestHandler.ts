import { RequestHandler } from 'ask-sdk-runtime'
import { Response, ResponsePayload } from '../../../response/Response'
import { ResponseBuilder } from '../../../response/ResponseBuilder'
import { HandlerInput } from './HandlerInput'

/**
 * A base implementation for user-created handler logic for accept grant requests.
 */
export abstract class SmartHomeSkillRequestHandler
  implements
    RequestHandler<HandlerInput<ResponseBuilder>, Response<ResponsePayload>> {
  /**
   * A predicate that determines if this handler can handle this type of request.
   * @param input Information about the request and executing context.
   */
  abstract canHandle(
    input: HandlerInput<ResponseBuilder>
  ): boolean | Promise<boolean>

  /**
   * Fulfills the request and returns a valid response.
   * @param input Information about the request and executing context.
   */
  abstract handle(
    input: HandlerInput<ResponseBuilder>
  ): Response<ResponsePayload> | Promise<Response<ResponsePayload>>
}
