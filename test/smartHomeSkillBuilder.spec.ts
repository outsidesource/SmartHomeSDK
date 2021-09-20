import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { AcceptGrantErrorTypes } from '../src/directives/acceptGrant/AcceptGrantErrorTypes'
import { HandlerInput } from '../src/dispatcher/request/handler/HandlerInput'
import { PayloadSignature, RequestPayload } from '../src/dispatcher/request/handler/Request'
import { ErrorTypes } from '../src/response/ErrorTypes'
import { Response, ResponsePayload } from '../src/response/Response'
import { ResponseBuilder } from '../src/response/ResponseBuilder'
import { SmartHomeSkillFactory } from '../src/skill/factory/SmartHomeSkillFactory'
import { getLambdaCallback, getLambdaContext } from './fixtures'
import failResponse from './fixtures/acceptGrantError.json'
import request from './fixtures/acceptGrantRequest.json'
import succeedResponse from './fixtures/acceptGrantResponse.json'

const successfulRequestHandler = {
  canHandle: (input: HandlerInput<RequestPayload, ResponseBuilder>) => true,
  handle: (input: HandlerInput<RequestPayload, ResponseBuilder>) => input.responseBuilder.getSucceedResponse(),
}
const failedRequestHandler = {
  canHandle: (input: HandlerInput<RequestPayload, ResponseBuilder>) => true,
  handle: (input: HandlerInput<RequestPayload, ResponseBuilder>) => input.responseBuilder.getFailResponse(AcceptGrantErrorTypes.AcceptGrantFailed, 'This is a test error'),
}
const throwingRequestHandler = {
  canHandle: (input: HandlerInput<RequestPayload, ResponseBuilder>) => true,
  handle: (input: HandlerInput<RequestPayload, ResponseBuilder>) => { throw Error('This is a test error') },
}
const errorHandler = {
  canHandle: (input: HandlerInput<RequestPayload, ResponseBuilder>, error: Error) => true,
  handle: (input: HandlerInput<RequestPayload, ResponseBuilder>, error: Error) => input.responseBuilder.getFailResponse(ErrorTypes.InternalError, error.message),
}
const lambdaContext = getLambdaContext()

describe('smart home skill builder', function() {
  afterEach(function(){
    sinon.restore()
  })
  it('creates a skill', function() {
    const builder = SmartHomeSkillFactory.init()
    const skill = builder.create()

    expect(skill).to.not.be.undefined
    expect(skill).to.not.be.null
  })
  describe('adding a single request handler', function() {
    it('creates arbitrary handler when provided a PayloadSignature', function() {
      const builder = SmartHomeSkillFactory.init()
      const payloadSignature: PayloadSignature = {namespace: 'namespace', name: 'name', payloadVersion: 'payloadVersion'}
      const executor = (input: HandlerInput<RequestPayload, ResponseBuilder>) => { return input.responseBuilder.getSucceedResponse() }

      builder.addRequestHandler(payloadSignature, executor)
  
      expect(builder.getSkillConfiguration().requestMappers.length).to.equal(1)
    })
    it('creates arbitrary handler when provided a PayloadSignature with an instance name', function() {
      const builder = SmartHomeSkillFactory.init()
      const payloadSignature: PayloadSignature = {namespace: 'namespace', name: 'name', payloadVersion: 'payloadVersion', instance: 'instance'}
      const executor = (input: HandlerInput<RequestPayload, ResponseBuilder>) => { return input.responseBuilder.getSucceedResponse() }

      builder.addRequestHandler(payloadSignature, executor)
  
      expect(builder.getSkillConfiguration().requestMappers.length).to.equal(1)
    })
  })
  describe('invoking the lambda', function() {
    it('creates a response when successful', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(successfulRequestHandler, 'handle')
      builder.addRequestHandlers(successfulRequestHandler)
      const test = (err?:Error, result?: Response<ResponsePayload>) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(result).to.deep.equal(succeedResponse)
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('invokes only the first request handler', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(successfulRequestHandler, 'handle')
      builder.addRequestHandlers(successfulRequestHandler, successfulRequestHandler)
      const test = (err?:Error, result?: Response<ResponsePayload>) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('creates an error response when the error is handled', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(failedRequestHandler, 'handle')
      const errorHandlerSpy = sinon.spy(errorHandler, 'handle')
      builder.addRequestHandlers(failedRequestHandler)
      builder.addErrorHandlers(errorHandler)
      const test = (err?:Error, result?: Response<ResponsePayload>) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(errorHandlerSpy.notCalled).to.be.true
        expect(result).to.deep.equal(failResponse)
        expect(err).to.be.undefined
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('invokes the error handler for unhandled errors', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(throwingRequestHandler, 'handle')
      const errorHandlerSpy = sinon.spy(errorHandler, 'handle')
      builder.addRequestHandlers(throwingRequestHandler)
      builder.addErrorHandlers(errorHandler)
      const expectedResult = _.cloneDeep(failResponse)
      expectedResult.event.payload.type = ErrorTypes.InternalError
      const test = (err?:Error, result?: Response<ResponsePayload>) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(errorHandlerSpy.calledOnce).to.be.true
        expect(result).to.deep.equal(expectedResult)
        expect(err).to.be.undefined
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('returns unhandled and uncaught errors to callback', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(throwingRequestHandler, 'handle')
      builder.addRequestHandlers(throwingRequestHandler)
      const test = (err?:Error, result?: Response<ResponsePayload>) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(err?.message).to.equal('This is a test error')
        expect(result).to.be.undefined
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
  })
})
