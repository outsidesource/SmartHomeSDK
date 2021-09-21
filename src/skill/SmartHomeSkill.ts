import {
  createAskSdkUserAgent,
  GenericRequestDispatcher,
  RequestDispatcher,
  Skill,
  UserAgentManager
} from 'ask-sdk-runtime'
import { HandlerInputFactoryRepository } from '../dispatcher/request/handler/factory/HandlerInputFactoryRepository'
import { HandlerInput } from '../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../dispatcher/request/handler/LambdaContext'
import { Request } from '../dispatcher/request/handler/Request'
import { Response } from '../response/Response'
import { ResponseBuilder } from '../response/ResponseBuilder'
import { SmartHomeSkillConfiguration } from './SmartHomeSkillConfiguration'

/**
 * Top level container for request dispatcher.
 */
export class SmartHomeSkill
  implements Skill<Request<unknown>, Response<unknown>> {
  protected requestDispatcher: RequestDispatcher<
    HandlerInput<unknown, ResponseBuilder>,
    Response<unknown>
  >
  // protected persistenceAdapter: PersistenceAdapter;
  // protected apiClient: ApiClient;
  protected customUserAgent?: string
  protected skillId?: string
  protected handlerInputFactoryRepository: HandlerInputFactoryRepository

  constructor(skillConfiguration: SmartHomeSkillConfiguration) {
    // this.persistenceAdapter = skillConfiguration.persistenceAdapter;
    // this.apiClient = skillConfiguration.apiClient;
    this.customUserAgent = skillConfiguration.customUserAgent
    this.skillId = skillConfiguration.skillId
    this.handlerInputFactoryRepository = new HandlerInputFactoryRepository(
      ...skillConfiguration.handlerInputFactories
    )

    this.requestDispatcher = new GenericRequestDispatcher<
      HandlerInput<unknown, ResponseBuilder>,
      Response<unknown>
    >({
      requestMappers: skillConfiguration.requestMappers,
      handlerAdapters: skillConfiguration.handlerAdapters,
      errorMapper: skillConfiguration.errorMapper,
      requestInterceptors: skillConfiguration.requestInterceptors,
      responseInterceptors: skillConfiguration.responseInterceptors
    })

    const packageInfo =
      process.env.NODE_ENV === 'test'
        ? require('../../package.json')
        : require('../package.json')
    UserAgentManager.registerComponent(
      createAskSdkUserAgent(packageInfo.version)
    )
    if (this.customUserAgent) {
      UserAgentManager.registerComponent(this.customUserAgent)
    }
  }

  /**
   * Invokes the dispatcher to handler the request envelope and construct the handler input.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  async invoke(
    request: Request<unknown>,
    context?: LambdaContext
  ): Promise<Response<unknown>> {
    const handlerInputFactory = this.handlerInputFactoryRepository.getHandlerInputFactory(
      request,
      context
    )

    if (!handlerInputFactory) {
      throw Error(
        `No handler input factory for request: ${JSON.stringify(
          request.directive.header
        )}`
      )
    }

    const input = handlerInputFactory.create(request, context)

    if (!input) {
      throw Error(
        `Unable to create handler input for request: ${JSON.stringify(
          request.directive.header
        )}`
      )
    }

    return this.requestDispatcher.dispatch(input)
  }

  /**
   * Determines if the skill can support the specific request type.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  supports(request: Request<unknown>, context?: LambdaContext): boolean {
    return !!request && !!context
  }

  /**
   * Append additional user agent info
   * @param userAgent
   */
  appendAdditionalUserAgent(userAgent: string): void {
    UserAgentManager.registerComponent(userAgent)
  }
}
