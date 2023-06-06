import { Context } from 'aws-lambda'
import _ from 'lodash'
import { HandlerInputFactory } from '../../src/dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInputFactoryRepository } from '../../src/dispatcher/request/handler/factory/repository'
import { Request } from '../../src/dispatcher/request/handler/types'
import { ResponseBuilder } from '../../src/response/baseResponseBuilder'
import { ErrorResponsePayload } from '../../src/response/payloads/types'
import { Response } from '../../src/response/types'
import { SmartHomeSkill } from '../../src/skill'

export function getLambdaContext(): Context {
  return _.merge({}, require('./lambdaContext.json'), { getRemainingTimeInMillis: (() => 0) })
}

export function getLambdaCallback(
  done: (error?: Error | string | null) => void,
  test?: (err?: Error | string | null, result?: Response<unknown>) => void) {
  return (err?: Error | string | null, result?: Response<unknown>) => {
    try {
      if (test !== undefined) {
        test(err, result)
      }
    } catch (error: unknown) {
      done(error as Error)
      return
    }
    done()
  }
}



export interface TestRequestPayload {
  customInput: number
}

export interface TestResponsePayload {
  customOutput: number
}

export class TestResponseBuilder extends ResponseBuilder {
  private value = 0

  constructor(request: Request<TestRequestPayload>) {
    super(request)
  }

  setValue(value: number): this {
    this.value = value
    return this
  }

  getSucceedResponse(): Response<TestResponsePayload> {
    return this.getPayloadEnvelope('Testing', 'Test.Response', '3', { customOutput: this.value })
  }

  getFailResponse(type: string, message: string): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope('Testing', 'ErrorResponse', '3', { type, message, })
  }
}

export class TestSmartHomeSkill extends SmartHomeSkill {
  overwriteHandlerInputFactories (...newFactories: Array<HandlerInputFactory<unknown, ResponseBuilder>>) {
    this.handlerInputFactoryRepository = new HandlerInputFactoryRepository(...newFactories)
  }
}
