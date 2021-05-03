import { expect } from 'chai'
import 'mocha'
import sinon from 'sinon'
import { HandlerInput } from '../../lib/smarthome-sdk/dispatcher/request/handler/HandlerInput'
import { Response } from '../../lib/smarthome-sdk/response/Response'
import { SmartHomeSkillFactory } from '../../lib/smarthome-sdk/skill/factory/SmartHomeSkillFactory'
import { getLambdaCallback, getLambdaContext } from './fixtures'
import request from './fixtures/acceptGrantRequest.json'

const successfulRequestHandler = {
  canHandle: (input: HandlerInput) => true,
  handle: (input: HandlerInput) => { 
    return { customValue: 3.14, } 
  },
}
const failedRequestHandler = {
  canHandle: (input: HandlerInput) => true,
  handle: (input: HandlerInput) => { throw Error('This is a test error') },
}
const errorHandler = {
  canHandle: (input: HandlerInput, error: Error) => true,
  handle: (input: HandlerInput, error: Error) => { return { errorMessage: error.message, } },
}
const lambdaContext = getLambdaContext()

describe('smart home skill builder', function() {
  afterEach(function(){
    sinon.restore()
  })
  describe('adding a single request handler', function() {
    it('creates arbitrary handler when provided a PayloadSignature', function() {
      const builder = SmartHomeSkillFactory.init()
      const payloadSignature = {namespace: 'namespace', name: 'name', payloadVersion: 'payloadVersion'}
      const executor = (input: HandlerInput) => { return {} }

      builder.addRequestHandler(payloadSignature, executor)
  
      expect(builder.getSkillConfiguration().requestMappers.length).to.equal(1)
    })
  })
  describe('invoking the lambda', function() {
    it('creates a response when successful', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(successfulRequestHandler, 'handle')
      builder.addRequestHandlers(successfulRequestHandler)
      const test = (err?:Error, result?: Response) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(result).to.deep.equal({ customValue: 3.14, })
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('invokes only the first request handler', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(successfulRequestHandler, 'handle')
      builder.addRequestHandlers(successfulRequestHandler, successfulRequestHandler)
      const test = (err?:Error, result?: Response) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(result).to.deep.equal({ customValue: 3.14, })
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('catches unhandled errors', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(failedRequestHandler, 'handle')
      builder.addRequestHandlers(failedRequestHandler)
      const test = (err?:Error, result?: Response) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(err?.message).to.equal('This is a test error')
        expect(result).to.be.undefined
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
    it('invokes the error handler for unhandled errors', function(done) {
      const builder = SmartHomeSkillFactory.init()
      const requestHandlerSpy = sinon.spy(failedRequestHandler, 'handle')
      const errorHandlerSpy = sinon.spy(errorHandler, 'handle')
      builder.addRequestHandlers(failedRequestHandler)
      builder.addErrorHandlers(errorHandler)
      const test = (err?:Error, result?: Response) => {
        expect(requestHandlerSpy.calledOnce).to.be.true
        expect(errorHandlerSpy.calledOnce).to.be.true
        expect(result).to.deep.equal({ errorMessage: 'This is a test error', })
      }

      builder.lambda()(request, lambdaContext, getLambdaCallback(done, test))
    })
  })
})
