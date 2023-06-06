import { Context } from 'aws-lambda'
import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { HandlerInput, PayloadSignature, Request } from '../../src/dispatcher/request/handler/types'
import { ResponseBuilder } from '../../src/response/baseResponseBuilder'
import { ErrorTypes } from '../../src/response/errorTypes'
import { Response } from '../../src/response/types'
import SmartHomeSkillFactory from '../../src/skill/factory/skillFactory'
import { SkillBuilders } from '../../src/skill/skillBuilders'
import { TestRequestPayload, TestResponseBuilder, TestResponsePayload, getLambdaCallback, getLambdaContext } from '../fixtures'

const request: Request<TestRequestPayload> = {
  directive: {
    header: {
      namespace: 'Testing',
      name: 'Test',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
    },
    payload: { customInput: 3.14, },
  }
}
const lambdaContext = getLambdaContext()
const testHandlerInputFactory = {
  canCreate: (request: Request<unknown>, context: Context) => true,
  create: (request: Request<unknown>, context: Context) => ({
    request,
    context,
    responseBuilder: new TestResponseBuilder(request as Request<TestRequestPayload>)
  })
}
const testRequestInterceptor = (input: HandlerInput<unknown, ResponseBuilder>) => { }
const testResponseInterceptor = (input: HandlerInput<unknown, ResponseBuilder>, response?: Response<unknown>) => { }
const testErrorHandler = {
  canHandle: (input: HandlerInput<unknown, ResponseBuilder>, error: Error) => true,
  handle: (input: HandlerInput<unknown, ResponseBuilder>, error: Error) => {
    return {
      event: {
        header: {
          namespace: 'genericErrorNamespace',
          name: 'genericErrorName',
          payloadVersion: 'genericErrorPayloadVersion',
          messageId: input.request.directive.header.messageId
        },
        payload: error.message
      }
    }
  }
}
const succeedRequestHandler = {
  canHandle: (input: HandlerInput<unknown, TestResponseBuilder>) => true,
  handle: (input: HandlerInput<unknown, TestResponseBuilder>) => {
    const req = input.request as Request<TestRequestPayload>

    input.responseBuilder.setValue(req.directive.payload!.customInput)

    return input.responseBuilder.getSucceedResponse()
  }
}
const failRequestHandler = {
  canHandle: (input: HandlerInput<unknown, TestResponseBuilder>) => true,
  handle: (input: HandlerInput<unknown, TestResponseBuilder>) => {
    const req = input.request as Request<TestRequestPayload>

    return input.responseBuilder.getFailResponse(ErrorTypes.InternalError, 'This is a test error')
  }
}
const errorRequestHandler = {
  canHandle: (input: HandlerInput<unknown, TestResponseBuilder>) => true,
  handle: (input: HandlerInput<unknown, TestResponseBuilder>) => {
    throw new Error('This is a test error')
  }
}



describe('smart home skill builder factory', function () {
  it('returns the skill builder', function () {
    const builder = SkillBuilders.smarthome()

    expect(builder).to.exist
  })
})



describe('smart home skill builder', function () {
  afterEach(function () {
    sinon.restore()
  })



  describe('addRequestHandler()', function () {
    it('creates an arbitrary handler when provided a matcher', function () {
      const sut = SmartHomeSkillFactory()
      const matcher = (input: HandlerInput<unknown, ResponseBuilder>) => true
      const executor = (input: HandlerInput<unknown, ResponseBuilder>) => { return input.responseBuilder.getSucceedResponse() }

      sut.addRequestHandler(matcher, executor)
      const actual = sut.getSkillConfiguration()

      expect((actual.requestMappers[0] as any).requestHandlerChains.length).to.equal(1)
    })

    it('creates an arbitrary handler when provided a PayloadSignature', function () {
      const sut = SmartHomeSkillFactory()
      const payloadSignature: PayloadSignature = { namespace: 'namespace', name: 'name', payloadVersion: 'payloadVersion' }
      const executor = (input: HandlerInput<unknown, ResponseBuilder>) => { return input.responseBuilder.getSucceedResponse() }

      sut.addRequestHandler(payloadSignature, executor)
      const actual = sut.getSkillConfiguration()

      expect((actual.requestMappers[0] as any).requestHandlerChains.length).to.equal(1)
    })

    it('creates an arbitrary handler when provided a PayloadSignature with an instance name', function () {
      const sut = SmartHomeSkillFactory()
      const payloadSignature: PayloadSignature = { namespace: 'namespace', name: 'name', payloadVersion: 'payloadVersion', instance: 'instance' }
      const executor = (input: HandlerInput<unknown, ResponseBuilder>) => { return input.responseBuilder.getSucceedResponse() }

      sut.addRequestHandler(payloadSignature, executor)
      const actual = sut.getSkillConfiguration()

      expect((actual.requestMappers[0] as any).requestHandlerChains.length).to.equal(1)
    })

    describe('signature matcher', function () {
      const builder = SmartHomeSkillFactory()
      const payloadSignature: PayloadSignature = { namespace: 'namespace', name: 'name', payloadVersion: 'payloadVersion', instance: 'instance' }
      const executor = (input: HandlerInput<unknown, ResponseBuilder>) => { return input.responseBuilder.getSucceedResponse() }
      builder.addRequestHandler(payloadSignature, executor)
      const config = builder.getSkillConfiguration()
      const sut = (config.requestMappers[0] as any).requestHandlerChains[0].requestHandler.canHandle as (input: HandlerInput<unknown, ResponseBuilder>) => boolean

      it('returns true when the signature matches the specified signature', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'namespace'
        req.directive.header.name = 'name'
        req.directive.header.payloadVersion = 'payloadVersion'
        req.directive.header.instance = 'instance'
        const handlerInput = {
          request: req,
          context: lambdaContext,
          responseBuilder: new TestResponseBuilder(req)
        }

        const actual = sut(handlerInput)

        expect(actual).to.be.true
      })

      it('returns false when the namespace does not match', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'
        req.directive.header.name = 'name'
        req.directive.header.payloadVersion = 'payloadVersion'
        req.directive.header.instance = 'instance'
        const handlerInput = {
          request: req,
          context: lambdaContext,
          responseBuilder: new TestResponseBuilder(req)
        }

        const actual = sut(handlerInput)

        expect(actual).to.be.false
      })

      it('returns false when the name does not match', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'namespace'
        req.directive.header.name = 'faux'
        req.directive.header.payloadVersion = 'payloadVersion'
        req.directive.header.instance = 'instance'
        const handlerInput = {
          request: req,
          context: lambdaContext,
          responseBuilder: new TestResponseBuilder(req)
        }

        const actual = sut(handlerInput)

        expect(actual).to.be.false
      })

      it('returns false when the payload version does not match', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'namespace'
        req.directive.header.name = 'name'
        req.directive.header.payloadVersion = 'faux'
        req.directive.header.instance = 'instance'
        const handlerInput = {
          request: req,
          context: lambdaContext,
          responseBuilder: new TestResponseBuilder(req)
        }

        const actual = sut(handlerInput)

        expect(actual).to.be.false
      })

      it('returns false when the instance does not match', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'namespace'
        req.directive.header.name = 'name'
        req.directive.header.payloadVersion = 'payloadVersion'
        req.directive.header.instance = 'faux'
        const handlerInput = {
          request: req,
          context: lambdaContext,
          responseBuilder: new TestResponseBuilder(req)
        }

        const actual = sut(handlerInput)

        expect(actual).to.be.false
      })
    })
  })



  describe('addRequestHandlers()', function () {
    it('adds the specified request handler', function () {
      const sut = SmartHomeSkillFactory()

      sut.addRequestHandlers(succeedRequestHandler)
      const actual = sut.getSkillConfiguration()

      expect((actual.requestMappers[0] as any).requestHandlerChains.length).to.equal(1)
    })
  })



  describe('addRequestInterceptors()', function () {
    it('adds the specified interceptor', function () {
      const sut = SmartHomeSkillFactory()

      sut.addRequestInterceptors(testRequestInterceptor)
      const actual = sut.getSkillConfiguration()

      expect(actual.requestInterceptors?.length).to.equal(1)
    })
  })



  describe('addResponseInterceptors()', function () {
    it('adds the specified interceptor', function () {
      const sut = SmartHomeSkillFactory()

      sut.addResponseInterceptors(testResponseInterceptor)
      const actual = sut.getSkillConfiguration()

      expect(actual.responseInterceptors?.length).to.equal(1)
    })
  })



  describe('addErrorHandler()', function () {
    it('adds the specified inline error handler', function () {
      const sut = SmartHomeSkillFactory()

      sut.addErrorHandler(testErrorHandler.canHandle, testErrorHandler.handle)
      const actual = sut.getSkillConfiguration()

      expect((actual.errorMapper as any).errorHandlers.length).to.equal(1)
    })
  })



  describe('addErrorHandlers()', function () {
    it('adds the specified error handler', function () {
      const sut = SmartHomeSkillFactory()

      sut.addErrorHandlers(testErrorHandler)
      const actual = sut.getSkillConfiguration()

      expect((actual.errorMapper as any).errorHandlers.length).to.equal(1)
    })
  })



  describe('withCustomUserAgent()', function () {
    it('sets the custom user agent to the specified value', function () {
      const sut = SmartHomeSkillFactory()

      sut.withCustomUserAgent('customUserAgent')
      const actual = sut.getSkillConfiguration()

      expect(actual.customUserAgent).to.equal('customUserAgent')
    })
  })



  describe('withSkillId()', function () {
    it('sets the skill id to the specified value', function () {
      const sut = SmartHomeSkillFactory()

      sut.withSkillId('22a897ad-7206-409d-be54-8e2c111d8581')
      const actual = sut.getSkillConfiguration()

      expect(actual.skillId).to.equal('22a897ad-7206-409d-be54-8e2c111d8581')
    })
  })



  describe('withHandlerInputFactories()', function () {
    it('adds the specified handler input factory to the top of the list', function () {
      const sut = SmartHomeSkillFactory()

      sut.withHandlerInputFactories(testHandlerInputFactory)
      const actual = sut.getSkillConfiguration()

      expect(actual.handlerInputFactories.length).to.equal(5)
      expect(actual.handlerInputFactories[0]).to.equal(testHandlerInputFactory)
    })
  })



  describe('getSkillConfiguration()', function () {
    it('returns a skill configuration with the default handler input factories', function () {
      const sut = SmartHomeSkillFactory()

      const actual = sut.getSkillConfiguration()

      expect(actual.handlerInputFactories.length).to.equal(4)
    })
  })



  describe('create()', function () {
    it('returns the skill', function () {
      const sut = SmartHomeSkillFactory()

      const actual = sut.create()

      expect(actual).to.exist
    })
  })



  describe('lambda()', function () {
    it('returns the lambda when invoked', function () {
      const sut = SmartHomeSkillFactory()

      const actual = sut.lambda()

      expect(actual).to.exist
    })

    it('invokes the callback when a successful response is returned', function (done: Mocha.Done) {
      const builder = SmartHomeSkillFactory()
      builder.withHandlerInputFactories(testHandlerInputFactory)
      builder.addRequestHandlers(succeedRequestHandler)
      const callback = getLambdaCallback(done, (err, res) => {
        expect(err).to.be.undefined
        expect((res as Response<TestResponsePayload>).event.header.name).to.equal('Test.Response')
      })
      const sut = builder.lambda()

      sut(request, lambdaContext, callback)
    })

    it('invokes the callback when a failed response is returned', function (done: Mocha.Done) {
      const builder = SmartHomeSkillFactory()
      builder.withHandlerInputFactories(testHandlerInputFactory)
      builder.addRequestHandlers(failRequestHandler)
      const callback = getLambdaCallback(done, (err, res) => {
        expect(err).to.be.undefined
        expect((res as Response<TestResponsePayload>).event.header.name).to.equal('ErrorResponse')
      })
      const sut = builder.lambda()

      sut(request, lambdaContext, callback)
    })

    it('invokes the callback when an error is returned', function (done: Mocha.Done) {
      const builder = SmartHomeSkillFactory()
      builder.withHandlerInputFactories(testHandlerInputFactory)
      builder.addRequestHandlers(errorRequestHandler)
      const callback = getLambdaCallback(done, (err, res) => {
        expect(res).to.be.undefined
        expect((err as Error).message).to.equal('This is a test error')
      })
      const sut = builder.lambda()

      sut(request, lambdaContext, callback)
    })
  })
})
