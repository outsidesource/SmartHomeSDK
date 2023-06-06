import { Context } from 'aws-lambda'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput, Request } from '../../dispatcher/request/handler/types'
import { InterfaceCommandResponseBuilder } from './responseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is an interface command.
 */
export const InterfaceCommandHandlerInputFactory: HandlerInputFactory<unknown, InterfaceCommandResponseBuilder> = {
  canCreate (request: Request<unknown>, context: Context): boolean {
    return true
  },

  create (request: Request<unknown>, context: Context): HandlerInput<unknown, InterfaceCommandResponseBuilder> | undefined {
    return {
      request,
      context,
      responseBuilder: new InterfaceCommandResponseBuilder(request)
    }
  }
}
