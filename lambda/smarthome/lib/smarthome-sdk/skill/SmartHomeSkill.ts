import { createAskSdkUserAgent, GenericRequestDispatcher, RequestDispatcher, Skill, UserAgentManager } from 'ask-sdk-runtime'
import { HandlerInput } from '../dispatcher/request/handler/HandlerInput'
import { LambdaContext } from '../dispatcher/request/handler/LambdaContext'
import { Request, RequestPayload } from '../dispatcher/request/handler/Request'
import { Response } from '../response/Response'
import { SmartHomeSkillConfiguration } from './SmartHomeSkillConfiguration'

/**
 * Top level container for request dispatcher.
 */
export class SmartHomeSkill implements Skill<Request<RequestPayload>, Response> {
  protected requestDispatcher: RequestDispatcher<HandlerInput, Response>
  // protected persistenceAdapter: PersistenceAdapter;
  // protected apiClient: ApiClient;
  protected customUserAgent?: string
  protected skillId?: string

  constructor(skillConfiguration: SmartHomeSkillConfiguration) {
    // this.persistenceAdapter = skillConfiguration.persistenceAdapter;
    // this.apiClient = skillConfiguration.apiClient;
    this.customUserAgent = skillConfiguration.customUserAgent
    this.skillId = skillConfiguration.skillId

    this.requestDispatcher = new GenericRequestDispatcher<HandlerInput, Response>({
        requestMappers: skillConfiguration.requestMappers,
        handlerAdapters: skillConfiguration.handlerAdapters,
        errorMapper: skillConfiguration.errorMapper,
        requestInterceptors: skillConfiguration.requestInterceptors,
        responseInterceptors: skillConfiguration.responseInterceptors,
    })

    const packageInfo = require('../../../package.json')
    UserAgentManager.registerComponent(createAskSdkUserAgent(packageInfo.version))
    if (this.customUserAgent) {
        UserAgentManager.registerComponent(this.customUserAgent)
    }
  }

  /**
   * Invokes the dispatcher to handler the request envelope and construct the handler input.
   * @param request
   * @param context
   */
  async invoke(request: Request<RequestPayload>, context?: LambdaContext): Promise<Response> {
    const input: HandlerInput = {
      request,
      context,
    }

    return this.requestDispatcher.dispatch(input)
  }

  /**
   * Determines if the skill can support the specific request type.
   * @param request
   * @param context
   */
  supports(request: Request<RequestPayload>, context?: LambdaContext): boolean {
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
