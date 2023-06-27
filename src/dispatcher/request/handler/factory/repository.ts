import { Context } from 'aws-lambda'
import { ResponseBuilder } from '../../../../response/baseResponseBuilder'
import { Request } from '../types'
import { HandlerInputFactory } from './baseHandlerInputFactory'

/**
 * An in-memory repository for storing and locating {@link HandlerInputFactory}.
 */
export class HandlerInputFactoryRepository {
  private readonly factories: Array<HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown>>

  constructor (...handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown>>) {
    this.factories = handlerInputFactories
  }

  /**
   * Finds a {@link HandlerInputFactory} that can create a {@link HandlerInput} for the given request and context.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   * @returns The first registered {@link HandlerInputFactory} that can create a {@link HandlerInput} or {@code undefined}.
   */
  getHandlerInputFactory (request: Request<unknown>, context: Context): HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown> | undefined {
    return this.factories.find(f => f.canCreate(request, context))
  }
}
