import { type Context } from 'aws-lambda'
import { type AttributesManager } from '../../attributes/types'
import { type HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { type HandlerInput, type Request } from '../../dispatcher/request/handler/types'
import { InterfaceCommandResponseBuilder } from './responseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is an interface command.
 */
export const InterfaceCommandHandlerInputFactory: HandlerInputFactory<unknown, InterfaceCommandResponseBuilder, unknown> = {
  canCreate (request: Request<unknown>, context: Context): boolean {
    return true
  },

  create (request: Request<unknown>, context: Context, attributesManager: AttributesManager): HandlerInput<unknown, InterfaceCommandResponseBuilder, unknown> | undefined {
    return {
      request,
      context,
      attributesManager,
      responseBuilder: new InterfaceCommandResponseBuilder(request)
    }
  }
}
