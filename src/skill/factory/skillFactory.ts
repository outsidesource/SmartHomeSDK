import { RequestHandler, RuntimeConfigurationBuilder } from 'ask-sdk-runtime'
import { Context, Handler } from 'aws-lambda'
import { SmartHomeSkill } from '..'
import { PersistenceAdapter } from '../../attributes/types'
import { AcceptGrantHandlerInputFactory } from '../../directives/acceptGrant/handlerInputFactory'
import { DiscoveryHandlerInputFactory } from '../../directives/discovery/handlerInputFactory'
import { InterfaceCommandHandlerInputFactory } from '../../directives/interfaceCommand/handlerInputFactory'
import { ReportStateHandlerInputFactory } from '../../directives/reportState/handlerInputFactory'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInput, PayloadSignature, Request } from '../../dispatcher/request/handler/types'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/requestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/responseInterceptor'
import { ResponseBuilder } from '../../responses/baseResponseBuilder'
import { Response } from '../../responses/types'
import { SmartHomeSkillConfiguration } from '../configuration'
import { InlineErrorExecutor, InlineErrorMatcher, InlineRequestExecutor, InlineRequestInterceptor, InlineRequestMatcher, InlineResponseInterceptor, SmartHomeSkillBuilder } from './skillBuilder'

/**
 * Provider for {@link SmartHomeSkillBuilder}
 */
export default function (): SmartHomeSkillBuilder {
  const runtimeConfigurationBuilder = new RuntimeConfigurationBuilder<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>>()
  let thisCustomUserAgent: string | undefined
  let thisPersistenceAdapter: PersistenceAdapter | undefined
  let thisSkillId: string | undefined
  const thisHandlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown>> = [
    AcceptGrantHandlerInputFactory,
    DiscoveryHandlerInputFactory,
    ReportStateHandlerInputFactory,
    InterfaceCommandHandlerInputFactory
  ]

  return {
    addRequestHandler (
      matcher: InlineRequestMatcher | PayloadSignature,
      executor: InlineRequestExecutor
    ): SmartHomeSkillBuilder {
      const canHandle = isPayloadSignature(matcher)
        ? (input: HandlerInput<unknown, ResponseBuilder<unknown>, unknown>) =>
            input.request.directive.header.namespace === matcher.namespace &&
            input.request.directive.header.name === matcher.name &&
            input.request.directive.header.payloadVersion === matcher.payloadVersion &&
            input.request.directive.header.instance === matcher.instance
        : matcher

      runtimeConfigurationBuilder.addRequestHandler(canHandle, executor)

      return this
    },
    addRequestHandlers (
      ...requestHandlers: Array<RequestHandler<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>>>
    ): SmartHomeSkillBuilder {
      runtimeConfigurationBuilder.addRequestHandlers(...requestHandlers)

      return this
    },
    addRequestInterceptors (
      ...executors: Array<SmartHomeSkillRequestInterceptor | InlineRequestInterceptor>
    ): SmartHomeSkillBuilder {
      runtimeConfigurationBuilder.addRequestInterceptors(...executors)

      return this
    },
    addResponseInterceptors (
      ...executors: Array<SmartHomeSkillResponseInterceptor | InlineResponseInterceptor>
    ): SmartHomeSkillBuilder {
      runtimeConfigurationBuilder.addResponseInterceptors(...executors)

      return this
    },
    addErrorHandler (
      matcher: InlineErrorMatcher,
      executor: InlineErrorExecutor
    ): SmartHomeSkillBuilder {
      runtimeConfigurationBuilder.addErrorHandler(matcher, executor)

      return this
    },
    addErrorHandlers (...errorHandlers: SmartHomeSkillErrorHandler[]): SmartHomeSkillBuilder {
      runtimeConfigurationBuilder.addErrorHandlers(...errorHandlers)

      return this
    },

    withCustomUserAgent (customUserAgent: string): SmartHomeSkillBuilder {
      thisCustomUserAgent = customUserAgent

      return this
    },

    withPersistenceAdapter (adapter: PersistenceAdapter) {
      thisPersistenceAdapter = adapter

      return this
    },

    withSkillId (skillId: string): SmartHomeSkillBuilder {
      thisSkillId = skillId

      return this
    },

    withHandlerInputFactories (...handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder<unknown>, unknown>>): SmartHomeSkillBuilder {
      thisHandlerInputFactories.unshift(...handlerInputFactories)

      return this
    },

    getSkillConfiguration (): SmartHomeSkillConfiguration {
      const runtimeConfiguration = runtimeConfigurationBuilder.getRuntimeConfiguration()

      return {
        ...runtimeConfiguration,
        customUserAgent: thisCustomUserAgent,
        persistenceAdapter: thisPersistenceAdapter,
        skillId: thisSkillId,
        handlerInputFactories: Array.from(new Set(thisHandlerInputFactories))
      }
    },

    create (): SmartHomeSkill {
      return new SmartHomeSkill(this.getSkillConfiguration())
    },

    lambda (): Handler<Request<unknown>, Response<unknown>> {
      const skill = new SmartHomeSkill(this.getSkillConfiguration())

      return (
        request: Request<unknown>,
        context: Context,
        callback: (error?: Error | string | null, result?: Response<unknown>) => void
      ) => {
        skill
          .invoke(request, context)
          .then(
            response => callback(undefined, response),
            err => callback(err)
          )
      }
    }
  }
}

function isPayloadSignature (value: InlineRequestMatcher | PayloadSignature): value is PayloadSignature {
  return 'namespace' in value && 'name' in value && 'payloadVersion' in value
}
