import { ResponseBuilder } from '../../../../response/ResponseBuilder'
import { LambdaContext } from '../LambdaContext'
import { Request } from '../Request'
import { HandlerInputFactory } from './HandlerInputFactory'

/**
 * An in-memory repository for storing and locating {@link HandlerInputFactory}.
 */
export class HandlerInputFactoryRepository {
  private factories: Array<HandlerInputFactory<unknown, ResponseBuilder>>

  constructor(
    ...handlerInputFactories: Array<
      HandlerInputFactory<unknown, ResponseBuilder>
    >
  ) {
    this.factories = handlerInputFactories
  }

  /**
   * Finds a {@link HandlerInputFactory} that can create a {@link HandlerInput} for the given request and context.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   * @returns The first registered {@link HandlerInputFactory} that can create a {@link HandlerInput} or {@code undefined}.
   */
  getHandlerInputFactory(
    request: Request<unknown>,
    context?: LambdaContext
  ): HandlerInputFactory<unknown, ResponseBuilder> | undefined {
    return this.factories.find(f => f.canCreate(request, context))
  }
}
