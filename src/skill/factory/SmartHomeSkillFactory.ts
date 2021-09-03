import { RequestHandler, RuntimeConfigurationBuilder } from 'ask-sdk-runtime'
import { AcceptGrantHandlerInputFactory } from '../../directives/acceptGrant/AcceptGrantHandlerInputFactory'
import { DiscoveryHandlerInputFactory } from '../../directives/discovery/DiscoveryHandlerInputFactory'
import { InterfaceCommandHandlerInputFactory } from '../../directives/interfaceCommand/InterfaceCommandHandlerInputFactory'
import { ReportStateHandlerInputFactory } from '../../directives/reportState/ReportStateHandlerInputFactory'
import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInputFactory } from '../../dispatcher/request/handler/factory/HandlerInputFactory'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../../dispatcher/request/handler/LambdaContext'
import {
  PayloadSignature,
  Request,
  RequestPayload
} from '../../dispatcher/request/handler/Request'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillRequestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillResponseInterceptor'
import { Response, ResponsePayload } from '../../response/Response'
import { ResponseBuilder } from '../../response/ResponseBuilder'
import { SmartHomeSkill } from '../SmartHomeSkill'
import { SmartHomeSkillConfiguration } from '../SmartHomeSkillConfiguration'
import { SmartHomeSkillBuilder } from './SmartHomeSkillBuilder'

/**
 * Type definition of LambdaHandler which contains inputs received in lambda function.
 *  https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html.
 */
export type LambdaHandler = (
  request: Request<RequestPayload>,
  context: LambdaContext | undefined,
  callback: (err?: Error, result?: Response<ResponsePayload>) => void
) => void

/**
 * Provider for {@link SmartHomeSkillBuilder}
 */
export class SmartHomeSkillFactory {
  static init(): SmartHomeSkillBuilder {
    const runtimeConfigurationBuilder = new RuntimeConfigurationBuilder<
      HandlerInput<RequestPayload, ResponseBuilder>,
      Response<ResponsePayload>
    >()
    let thisCustomUserAgent: string
    let thisSkillId: string
    let thisHandlerInputFactories: Array<HandlerInputFactory<
      RequestPayload,
      ResponseBuilder
    >> = [
      AcceptGrantHandlerInputFactory,
      DiscoveryHandlerInputFactory,
      ReportStateHandlerInputFactory,
      InterfaceCommandHandlerInputFactory
    ]

    return {
      addRequestHandler(
        matcher:
          | ((
              input: HandlerInput<RequestPayload, ResponseBuilder>
            ) => Promise<boolean> | boolean)
          | PayloadSignature,
        executor: (
          input: HandlerInput<RequestPayload, ResponseBuilder>
        ) => Promise<Response<ResponsePayload>> | Response<ResponsePayload>
      ): SmartHomeSkillBuilder {
        const canHandle = isPayloadSignature(matcher)
          ? (input: HandlerInput<RequestPayload, ResponseBuilder>) =>
              input.request.directive.header.namespace === matcher.namespace &&
              input.request.directive.header.name === matcher.name &&
              input.request.directive.header.payloadVersion ===
                matcher.payloadVersion
          : matcher

        runtimeConfigurationBuilder.addRequestHandler(canHandle, executor)

        return this
      },
      addRequestHandlers(
        ...requestHandlers: Array<
          RequestHandler<
            HandlerInput<RequestPayload, ResponseBuilder>,
            Response<ResponsePayload>
          >
        >
      ): SmartHomeSkillBuilder {
        runtimeConfigurationBuilder.addRequestHandlers(...requestHandlers)

        return this
      },
      addRequestInterceptors(
        ...executors: Array<
          | SmartHomeSkillRequestInterceptor
          | ((
              input: HandlerInput<RequestPayload, ResponseBuilder>
            ) => Promise<void> | void)
        >
      ): SmartHomeSkillBuilder {
        runtimeConfigurationBuilder.addRequestInterceptors(...executors)

        return this
      },
      addResponseInterceptors(
        ...executors: Array<
          | SmartHomeSkillResponseInterceptor
          | ((
              input: HandlerInput<RequestPayload, ResponseBuilder>,
              response?: Response<ResponsePayload>
            ) => Promise<void> | void)
        >
      ): SmartHomeSkillBuilder {
        runtimeConfigurationBuilder.addResponseInterceptors(...executors)

        return this
      },
      addErrorHandler(
        matcher: (
          input: HandlerInput<RequestPayload, ResponseBuilder>,
          error: Error
        ) => Promise<boolean> | boolean,
        executor: (
          input: HandlerInput<RequestPayload, ResponseBuilder>,
          error: Error
        ) => Promise<Response<ResponsePayload>> | Response<ResponsePayload>
      ): SmartHomeSkillBuilder {
        runtimeConfigurationBuilder.addErrorHandler(matcher, executor)

        return this
      },
      addErrorHandlers(
        ...errorHandlers: SmartHomeSkillErrorHandler[]
      ): SmartHomeSkillBuilder {
        runtimeConfigurationBuilder.addErrorHandlers(...errorHandlers)

        return this
      },
      withCustomUserAgent(customUserAgent: string): SmartHomeSkillBuilder {
        thisCustomUserAgent = customUserAgent

        return this
      },
      withSkillId(skillId: string): SmartHomeSkillBuilder {
        thisSkillId = skillId

        return this
      },
      withHandlerInputFactories(
        ...handlerInputFactories: Array<
          HandlerInputFactory<RequestPayload, ResponseBuilder>
        >
      ): SmartHomeSkillBuilder {
        thisHandlerInputFactories = [
          ...new Set([...thisHandlerInputFactories, ...handlerInputFactories])
        ]

        return this
      },
      getSkillConfiguration(): SmartHomeSkillConfiguration {
        const runtimeConfiguration = runtimeConfigurationBuilder.getRuntimeConfiguration()

        return {
          ...runtimeConfiguration,
          customUserAgent: thisCustomUserAgent,
          skillId: thisSkillId,
          handlerInputFactories: thisHandlerInputFactories
        }
      },
      create(): SmartHomeSkill {
        return new SmartHomeSkill(this.getSkillConfiguration())
      },
      lambda(): LambdaHandler {
        const skill = new SmartHomeSkill(this.getSkillConfiguration())

        return (
          request: Request<RequestPayload>,
          context: LambdaContext | undefined,
          callback: (err?: Error, result?: Response<ResponsePayload>) => void
        ) => {
          skill
            .invoke(request, context)
            .then(response => {
              callback(undefined, response)
            })
            .catch(err => {
              callback(err)
            })
        }
      }
    }
  }

  private constructor() {}
}

function isPayloadSignature(
  x:
    | ((
        input: HandlerInput<RequestPayload, ResponseBuilder>
      ) => Promise<boolean> | boolean)
    | PayloadSignature
): x is PayloadSignature {
  return 'namespace' in x && 'name' in x && 'payloadVersion' in x
}
