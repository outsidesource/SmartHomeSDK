import { SmartHomeSkillErrorHandler } from '../../dispatcher/error/handler/SmartHomeSkillErrorHandler'
import { HandlerInput } from '../../dispatcher/request/handler/HandlerInput'
import { PayloadSignature } from '../../dispatcher/request/handler/Request'
import { SmartHomeSkillRequestHandler } from '../../dispatcher/request/handler/SmartHomeSkillRequestHandler'
import { SmartHomeSkillRequestInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillRequestInterceptor'
import { SmartHomeSkillResponseInterceptor } from '../../dispatcher/request/interceptor/SmartHomeSkillResponseInterceptor'
import { Response } from '../../response/Response'
import { SmartHomeSkill } from '../SmartHomeSkill'
import { SmartHomeSkillConfiguration } from '../SmartHomeSkillConfiguration'
import { LambdaHandler } from './SmartHomeSkillFactory'

/**
 * An interface which helps building a {@link SmartHomeSkill}.
 */
export interface SmartHomeSkillBuilder {
  addRequestHandler(matcher: ((input: HandlerInput) => Promise<boolean> | boolean) | PayloadSignature, executor: (input: HandlerInput) => Promise<Response> | Response): this
  addRequestHandlers(...requestHandlers: SmartHomeSkillRequestHandler[]): this
  addRequestInterceptors(...executors: Array<SmartHomeSkillRequestInterceptor | ((input: HandlerInput) => Promise<void> | void)>): this
  addResponseInterceptors(...executors: Array<SmartHomeSkillResponseInterceptor | ((input: HandlerInput, response?: Response) => Promise<void> | void)>): this
  addErrorHandler(matcher: (input: HandlerInput, error: Error) => Promise<boolean> | boolean, executor: (input: HandlerInput, error: Error) => Promise<Response> | Response): this
  addErrorHandlers(...errorHandlers: SmartHomeSkillErrorHandler[]): this
  withCustomUserAgent(customUserAgent: string): this
  withSkillId(skillId: string): this
  getSkillConfiguration(): SmartHomeSkillConfiguration
  create(): SmartHomeSkill
  lambda(): LambdaHandler
}
