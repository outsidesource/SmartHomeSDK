import { createAskSdkUserAgent, GenericRequestDispatcher, type RequestDispatcher, type Skill, UserAgentManager } from 'ask-sdk-runtime'
import { type Context } from 'aws-lambda'
import AttributesManagerFactory from '../attributes/attributesManagerFactory'
import { type PersistenceAdapter } from '../attributes/types'
import { HandlerInputFactoryRepository } from '../dispatcher/request/handler/factory/repository'
import { type HandlerInput, type Request } from '../dispatcher/request/handler/types'
import { PKG_VERSION } from '../prebuild-output'
import { type ResponseBuilder } from '../responses/baseResponseBuilder'
import { type Response } from '../responses/types'
import { type SmartHomeSkillConfiguration } from './configuration'

/**
 * Top level container for request dispatcher.
 */
export class SmartHomeSkill implements Skill<Request<unknown>, Response<unknown>> {
  protected requestDispatcher: RequestDispatcher<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>>

  protected persistenceAdapter?: PersistenceAdapter
  // protected apiClient: ApiClient
  protected customUserAgent?: string
  protected skillId?: string
  protected handlerInputFactoryRepository: HandlerInputFactoryRepository

  constructor (skillConfiguration: SmartHomeSkillConfiguration) {
    this.persistenceAdapter = skillConfiguration.persistenceAdapter
    // this.apiClient = skillConfiguration.apiClient;
    this.customUserAgent = skillConfiguration.customUserAgent
    this.skillId = skillConfiguration.skillId
    this.handlerInputFactoryRepository = new HandlerInputFactoryRepository(
      ...skillConfiguration.handlerInputFactories
    )

    this.requestDispatcher = new GenericRequestDispatcher<HandlerInput<unknown, ResponseBuilder<unknown>, unknown>, Response<unknown>>({
      requestMappers: skillConfiguration.requestMappers,
      handlerAdapters: skillConfiguration.handlerAdapters,
      errorMapper: skillConfiguration.errorMapper,
      requestInterceptors: skillConfiguration.requestInterceptors,
      responseInterceptors: skillConfiguration.responseInterceptors
    })

    UserAgentManager.registerComponent(createAskSdkUserAgent(PKG_VERSION))
    if (this.customUserAgent !== undefined && this.customUserAgent !== '') {
      UserAgentManager.registerComponent(this.customUserAgent)
    }
  }

  /**
   * Invokes the dispatcher to handler the request envelope and construct the handler input.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  async invoke (request: Request<unknown>, context: Context): Promise<Response<unknown>> {
    const handlerInputFactory = this.handlerInputFactoryRepository.getHandlerInputFactory(request, context)
    if (handlerInputFactory === undefined) {
      throw new Error(`No handler input factory for request: ${JSON.stringify(request.directive.header)}`)
    }

    const attributesManager = AttributesManagerFactory({
      persistenceAdapter: this.persistenceAdapter,
      request,
      context
    })

    const input = handlerInputFactory.create(request, context, attributesManager)
    if (input === undefined) {
      throw new Error(`Unable to create handler input for request: ${JSON.stringify(request.directive.header)}`)
    }

    return await this.requestDispatcher.dispatch(input)
  }

  /**
   * Determines if the skill can support the specific request type.
   * @param request The directive and payload for the request.
   * @param context The context that the lambda is running in.
   */
  supports (request: Request<unknown>, context: Context): boolean {
    return true
  }

  /**
   * Append additional user agent info
   * @param userAgent
   */
  appendAdditionalUserAgent (userAgent: string): void {
    UserAgentManager.registerComponent(userAgent)
  }
}
