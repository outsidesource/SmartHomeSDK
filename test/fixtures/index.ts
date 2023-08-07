import { Context } from 'aws-lambda'
import _ from 'lodash'
import { AttributesManager, PersistenceAdapter } from '../../src/attributes/types'
import { HandlerInputFactory } from '../../src/dispatcher/request/handler/factory/baseHandlerInputFactory'
import { HandlerInputFactoryRepository } from '../../src/dispatcher/request/handler/factory/repository'
import { Request } from '../../src/dispatcher/request/handler/types'
import { ResponseBuilder } from '../../src/responses/baseResponseBuilder'
import { ErrorResponsePayload } from '../../src/responses/payloads/types'
import { Response } from '../../src/responses/types'
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

export class FauxAttributesManager implements AttributesManager {
  requestData: { [key: string]: unknown } = {}
  persistentData: { [key: string]: unknown } = {}

  getRequestAttributes = (): { [key: string]: unknown } => this.requestData
  setRequestAttributes = (requestAttributes: { [key: string]: unknown }): void => {
    this.requestData = requestAttributes
  }

  getPersistentAttributes = (useCache?: boolean | undefined, defaultAttributes?: { [key: string]: unknown } | undefined): Promise<{ [key: string]: unknown }> => Promise.resolve(this.persistentData)
  setPersistentAttributes = (persistentAttributes: { [key: string]: unknown }): void => {
    this.persistentData = persistentAttributes
  }
  savePersistentAttributes = (): Promise<void> => Promise.resolve()
  deletePersistentAttributes = (): Promise<void> => {
    this.persistentData = {}
    return Promise.resolve()
  }
}

export function getPersistenceAdapter(forceError: boolean = false, withDelete: boolean = true): PersistenceAdapter {
  let thisPersistentAttributes: { [key: string]: unknown } = {}

  return {
    getAttributes: function (request: Request<unknown>, context: Context): Promise<{ [key: string]: unknown }> {
      return forceError
        ? Promise.reject(new Error('Intentionally rejecting'))
        : Promise.resolve(thisPersistentAttributes)
    },

    saveAttributes: function (request: Request<unknown>, context: Context, attributes: { [key: string]: unknown }): Promise<void> {
      thisPersistentAttributes = attributes
      return forceError
        ? Promise.reject(new Error('Intentionally rejecting'))
        : Promise.resolve()
    },

    deleteAttributes:
      withDelete
        ? function (request: Request<unknown>, context: Context): Promise<void> {
          thisPersistentAttributes = {}
          return forceError
            ? Promise.reject(new Error('Intentionally rejecting'))
            : Promise.resolve()
        }
        : undefined
  }
}

export interface TestRequestPayload {
  customInput: number
}

export interface TestResponsePayload {
  customOutput: number
}

export class TestResponseBuilder extends ResponseBuilder<TestResponsePayload> {
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
  overwriteHandlerInputFactories(...newFactories: Array<HandlerInputFactory<unknown, ResponseBuilder<TestResponsePayload>, TestResponsePayload>>) {
    this.handlerInputFactoryRepository = new HandlerInputFactoryRepository(...newFactories)
  }
}
