import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../../dispatcher/request/handler/LambdaContext'
import {
  Request,
  RequestPayload
} from '../../dispatcher/request/handler/Request'
import { InterfaceCommandResponseBuilder } from './InterfaceCommandResponseBuilder'

/**
 * A factory for {@link HandlerInput} when the request is an interface command.
 */
export const InterfaceCommandHandlerInputFactory: HandlerInputFactory<InterfaceCommandResponseBuilder> = {
  canCreate(request: Request<RequestPayload>, context?: LambdaContext) {
    return true
  },
  create(
    request: Request<RequestPayload>,
    context?: LambdaContext
  ): HandlerInput<InterfaceCommandResponseBuilder> | undefined {
    return {
      request,
      context,
      responseBuilder: new InterfaceCommandResponseBuilder(request)
    }
  }
}
