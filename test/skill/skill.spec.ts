import { UserAgentManager } from 'ask-sdk-runtime'
import { Context } from 'aws-lambda'
import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { HandlerInput, Request } from '../../src/dispatcher/request/handler/types'
import { Response } from '../../src/response/types'
import { SmartHomeSkill } from '../../src/skill'
import { SkillBuilders } from '../../src/skill/skillBuilders'
import { TestRequestPayload, TestResponseBuilder, TestResponsePayload, TestSmartHomeSkill, getLambdaContext } from '../fixtures'

const standardConfig = SkillBuilders.smarthome().getSkillConfiguration()
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
const requestHandler = {
  canHandle: (input: HandlerInput<unknown, TestResponseBuilder, TestResponsePayload>) => true,
  handle: (input: HandlerInput<unknown, TestResponseBuilder, TestResponsePayload>) => {
    const req = input.request as Request<TestRequestPayload>

    input.responseBuilder.setValue(req.directive.payload!.customInput)

    return input.responseBuilder.getSucceedResponse()
  }
}



describe('smart home skill', function () {
  afterEach(function () {
    sinon.restore()
  })



  describe('ctor()', function () {
    it('registers a custom user agents', function () {
      const spy = sinon.spy(UserAgentManager, 'registerComponent')
      const config = _.cloneDeep(standardConfig)
      config.customUserAgent = 'customUserAgent'

      const sut = new SmartHomeSkill(config)

      expect(spy.callCount).to.equal(2)
      expect(spy.secondCall.args).to.deep.equal(['customUserAgent'])
    })
  })



  describe('invoke()', function () {
    it('throws when no handler input factory can handle the request ', async function () {
      const handlerInputFactory = {
        canCreate: (request: Request<unknown>, context: Context) => false,
        create: (request: Request<unknown>, context: Context) => undefined
      }
      const sut = new TestSmartHomeSkill(standardConfig)
      sut.overwriteHandlerInputFactories(handlerInputFactory)

      return Promise.resolve(sut.invoke(request, lambdaContext)).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal(`No handler input factory for request: {"namespace":"Testing","name":"Test","payloadVersion":"3","messageId":"4b409868-dc4b-ce7f-5ec9-0d6410e74f20"}`)
        }
      )
    })

    it('throws when the handler input factory cannot create a handler input', async function () {
      const handlerInputFactory = {
        canCreate: (request: Request<unknown>, context: Context) => true,
        create: (request: Request<unknown>, context: Context) => undefined
      }
      const sut = new TestSmartHomeSkill(standardConfig)
      sut.overwriteHandlerInputFactories(handlerInputFactory)

      return Promise.resolve(sut.invoke(request, lambdaContext)).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal(`Unable to create handler input for request: {"namespace":"Testing","name":"Test","payloadVersion":"3","messageId":"4b409868-dc4b-ce7f-5ec9-0d6410e74f20"}`)
        }
      )
    })

    it('returns a response when invoked', async function () {
      const builder = SkillBuilders.smarthome()
      builder.addRequestHandlers(requestHandler)
      builder.withHandlerInputFactories(testHandlerInputFactory)
      const sut = new TestSmartHomeSkill(builder.getSkillConfiguration())

      const actual = await sut.invoke(request, lambdaContext) as Response<TestResponsePayload>

      expect(actual.event.payload.customOutput).to.equal(3.14)
    })
  })



  describe('supports()', function () {
    it('returns true when the request is valid', function () {
      const sut = new SmartHomeSkill(standardConfig)

      const actual = sut.supports(request, lambdaContext)

      expect(actual).to.be.true
    })

    it('returns true when the request is not valid', function () {
      const req = _.cloneDeep(request)
      req.directive.header.name = 'faux'
      const sut = new SmartHomeSkill(standardConfig)

      const actual = sut.supports(req, lambdaContext)

      expect(actual).to.be.true
    })
  })



  describe('appendAdditionalUserAgent()', function () {
    it('registers additional user agents', function () {
      const spy = sinon.spy(UserAgentManager, 'registerComponent')
      const sut = new SmartHomeSkill(standardConfig)
      spy.resetHistory()

      sut.appendAdditionalUserAgent('additionalUserAgent')

      expect(spy.callCount).to.equal(1)
      expect(spy.firstCall.args).to.deep.equal(['additionalUserAgent'])
    })
  })
})
