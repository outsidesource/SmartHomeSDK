import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { InterfaceCommandHandlerInputFactory } from '../../src/directives/interfaceCommand/handlerInputFactory'
import { InterfaceCommandResponseBuilder } from '../../src/directives/interfaceCommand/responseBuilder'
import { Request } from '../../src/dispatcher/request/handler/types'
import { ErrorTypes } from '../../src/responses/errorTypes'
import { ErrorResponsePayload } from '../../src/responses/payloads/types'
import { Response } from '../../src/responses/types'
import { getLambdaContext, } from '../fixtures'
import { removeUndefinedProps } from '../helpers'

const request: Request<unknown> = require('../fixtures/interfaceCommandRequest.json')
const deferredRequest: Request<unknown> = require('../fixtures/deferredInterfaceCommandRequest.json')
const context = getLambdaContext()
const succeedResponse: Response<unknown> = require('../fixtures/interfaceCommandResponse.json')
const deferredResponse: Response<unknown> = require('../fixtures/deferredInterfaceCommandResponse.json')
const failResponse: Response<ErrorResponsePayload> = require('../fixtures/errorResponse.json')

describe('interface command', function () {
  describe('handler input factory', function () {
    const sut = InterfaceCommandHandlerInputFactory

    describe('canCreate()', function () {
      it('returns true when the request can be handled', function () {
        const actual = sut.canCreate(request, context)

        expect(actual).to.be.true
      })

      it('returns true for all requests', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'

        const actual = sut.canCreate(req, context)

        expect(actual).to.be.true
      })
    })



    describe('create()', function () {
      it('returns a handler input when the request can be handled', function () {
        const actual = sut.create(request, context)

        expect(actual?.request).to.equal(request)
        expect(actual?.context).to.equal(context)
        expect(actual?.responseBuilder).to.be.an.instanceOf(InterfaceCommandResponseBuilder)
      })

      it('returns a handler input when the request type is not recognized', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'

        const actual = sut.create(request, context)

        expect(actual?.request).to.equal(request)
        expect(actual?.context).to.equal(context)
        expect(actual?.responseBuilder).to.be.an.instanceOf(InterfaceCommandResponseBuilder)
      })
    })
  })



  describe('response builder', function () {
    it('returns a successful response for a successful request', function () {
      const sut = new InterfaceCommandResponseBuilder(request)
      sut
        .addContext()
        .withProperty('Alexa.ThermostatController', undefined, 'thermostatMode', 'HEAT', new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.ThermostatController', undefined, 'targetSetpoint', { value: 20.0, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.TemperatureSensor', undefined, 'temperature', { value: 19.3, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 1000)
      sut
        .addEndpoint().withEndpointId('endpointId')

      const actual = sut.getSucceedResponse()

      expect(removeUndefinedProps(actual)).to.deep.equal(succeedResponse)
    })

    it('returns a successful response when the namespace, name, and payload are changed', function () {
      const sut = new InterfaceCommandResponseBuilder(request)
      sut
        .withNamespace('myNamespace').withName('myName').withPayload({ prop: 'value', })
        .addContext()
        .withProperty('Alexa.ThermostatController', undefined, 'thermostatMode', 'HEAT', new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.ThermostatController', undefined, 'targetSetpoint', { value: 20.0, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.TemperatureSensor', undefined, 'temperature', { value: 19.3, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 1000)
      sut
        .addEndpoint().withEndpointId('endpointId')
      const expected = _.cloneDeep(succeedResponse)
      expected.event.header.namespace = 'myNamespace'
      expected.event.header.name = 'myName'
      expected.event.payload = { prop: 'value' }

      const actual = sut.getSucceedResponse()

      expect(removeUndefinedProps(actual)).to.deep.equal(expected)
    })

    it('returns a deferred response for a request that cannot be fulfilled immediately', function () {
      const sut = new InterfaceCommandResponseBuilder(deferredRequest)
      const expected = _.cloneDeep(deferredResponse)
      expected.event.payload = {}

      const actual = sut.getDeferredResponse('VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')

      expect(removeUndefinedProps(actual)).to.deep.equal(expected)
    })

    it('returns a deferred response with an estimated deferral time when given a number of seconds', function () {
      const sut = new InterfaceCommandResponseBuilder(deferredRequest)

      const actual = sut.getDeferredResponse('VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu', 15)

      expect(removeUndefinedProps(actual)).to.deep.equal(deferredResponse)
    })

    it('returns an error response for a failed request', function () {
      const sut = new InterfaceCommandResponseBuilder(request)

      const actual = sut.getFailResponse(ErrorTypes.InternalError, 'This is a test error')

      expect(removeUndefinedProps(actual)).to.deep.equal(failResponse)
    })

    it('throws if no endpoint ID is specified', function () {
      const sut = new InterfaceCommandResponseBuilder(request)

      sut.addEndpoint().withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

      expect(() => sut.getSucceedResponse()).to.throw('An endpoint ID is required.')
    })
  })
})
