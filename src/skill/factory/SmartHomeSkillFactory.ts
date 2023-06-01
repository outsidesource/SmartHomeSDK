import { RequestHandler, RuntimeConfigurationBuilder } from 'ask-sdk-runtime'
import { Context, Handler } from 'aws-lambda'
import { AcceptGrantHandlerInputFactory } from '../../directives/acceptGrant/AcceptGrantHandlerInputFactory'
import { DiscoveryHandlerInputFactory } from '../../directives/discovery/DiscoveryHandlerInputFactory'
import { InterfaceCommandHandlerInputFactory } from '../../directives/interfaceCommand/InterfaceCommandHandlerInputFactory'
import { ReportStateHandlerInputFactory } from '../../directives/reportState/ReportStateHandlerInputFactory'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { PayloadSignature, Request } from '../../dispatcher/request/handler/Request'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillRequestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillResponseInterceptor'
import { Response } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'
import { SmartHomeSkill } from '../SmartHomeSkill'
import { SmartHomeSkillConfiguration } from '../SmartHomeSkillConfiguration'
import { InlineErrorExecutor, InlineErrorMatcher, InlineRequestExecutor, InlineRequestInterceptor, InlineRequestMatcher, InlineResponseInterceptor, SmartHomeSkillBuilder } from './SmartHomeSkillBuilder'

/**
 * Provider for {@link SmartHomeSkillBuilder}
 */
export default function (): SmartHomeSkillBuilder {
  const runtimeConfigurationBuilder = new RuntimeConfigurationBuilder<HandlerInput<unknown, ResponseBuilder>, Response<unknown>>()
  let thisCustomUserAgent: string
  let thisSkillId: string
  let thisHandlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder>> = [
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
        ? (input: HandlerInput<unknown, ResponseBuilder>) =>
            input.request.directive.header.namespace === matcher.namespace &&
            input.request.directive.header.name === matcher.name &&
            input.request.directive.header.payloadVersion === matcher.payloadVersion &&
            input.request.directive.header.instance === matcher.instance
        : matcher

      runtimeConfigurationBuilder.addRequestHandler(canHandle, executor)

      return this
    },
    addRequestHandlers (
      ...requestHandlers: Array<RequestHandler<HandlerInput<unknown, ResponseBuilder>, Response<unknown>>>
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
    addErrorHandlers (
      ...errorHandlers: SmartHomeSkillErrorHandler[]
    ): SmartHomeSkillBuilder {
      runtimeConfigurationBuilder.addErrorHandlers(...errorHandlers)

      return this
    },
    withCustomUserAgent (customUserAgent: string): SmartHomeSkillBuilder {
      thisCustomUserAgent = customUserAgent

      return this
    },
    withSkillId (skillId: string): SmartHomeSkillBuilder {
      thisSkillId = skillId

      return this
    },
    withHandlerInputFactories (
      ...handlerInputFactories: Array<HandlerInputFactory<unknown, ResponseBuilder>>
    ): SmartHomeSkillBuilder {
      thisHandlerInputFactories = [
        ...new Set([...thisHandlerInputFactories, ...handlerInputFactories])
      ]

      return this
    },
    getSkillConfiguration (): SmartHomeSkillConfiguration {
      const runtimeConfiguration = runtimeConfigurationBuilder.getRuntimeConfiguration()

      return {
        ...runtimeConfiguration,
        customUserAgent: thisCustomUserAgent,
        skillId: thisSkillId,
        handlerInputFactories: thisHandlerInputFactories
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
