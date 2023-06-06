import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { ReportStateHandlerInputFactory, isReportStateRequest } from '../../src/directives/reportState/handlerInputFactory'
import { ReportStateResponseBuilder } from '../../src/directives/reportState/responseBuilder'
import { Request } from '../../src/dispatcher/request/handler/types'
import { ErrorTypes } from '../../src/response/errorTypes'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../src/response/payloads/types'
import { Response } from '../../src/response/types'
import { getLambdaContext } from '../fixtures'

const request: Request<unknown> = require('../fixtures/reportStateRequest.json')
const context = getLambdaContext()
const succeedResponse: Response<EmptyResponsePayload> = require('../fixtures/reportStateResponse.json')
const failResponse: Response<ErrorResponsePayload> = require('../fixtures/errorResponse.json')

describe('report state', function () {
  describe('request type guard', function () {
    it('returns true when the header is correct and the endpoint is present', function () {
      const actual = isReportStateRequest(request)

      expect(actual).to.be.true
    })

    it('returns false when the namespace is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.namespace = 'faux'

      const actual = isReportStateRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the name is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.name = 'faux'

      const actual = isReportStateRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the payloadVersion is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.payloadVersion = '0'

      const actual = isReportStateRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the endpoint is missing', function () {
      const req = _.cloneDeep(request)
      req.directive.endpoint = undefined

      const actual = isReportStateRequest(req)

      expect(actual).to.be.false
    })
  })



  describe('handler input factory', function () {
    const sut = ReportStateHandlerInputFactory

    describe('canCreate()', function () {
      it('returns true when the request can be handled', function () {
        const actual = sut.canCreate(request, context)

        expect(actual).to.be.true
      })

      it('returns false when the request cannot be handled', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'

        const actual = sut.canCreate(req, context)

        expect(actual).to.be.false
      })
    })



    describe('create()', function () {
      it('returns a handler input when the request can be handled', function () {
        const actual = sut.create(request, context)

        expect(actual?.request).to.equal(request)
        expect(actual?.context).to.equal(context)
        expect(actual?.responseBuilder).to.be.an.instanceOf(ReportStateResponseBuilder)
      })

      it('returns undefined when the request cannot be handled', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'

        const actual = sut.create(req, context)

        expect(actual).to.be.undefined
      })
    })
  })



  describe('response builder', function () {
    it('returns a successful response for a successful request', function () {
      const sut = new ReportStateResponseBuilder(request)
      sut
        .withProperty('Alexa.ThermostatController', undefined, 'targetSetpoint', { value: 25.0, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50Z'), 6000)
        .withProperty('Alexa.ThermostatController', undefined, 'thermostatMode', 'HEAT', new Date('2017-02-03T16:20:50Z'), 6000)
        .withProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
        .withProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 6000)
        .addEndpoint().withEndpointId('endpointId').withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

      const actual = sut.getSucceedResponse()

      expect(actual).to.deep.equal(succeedResponse)
    })

    it('returns an error response for a failed request', function () {
      const sut = new ReportStateResponseBuilder(request)

      const actual = sut.getFailResponse(ErrorTypes.InternalError, 'This is a test error')

      expect(actual).to.deep.equal(failResponse)
    })

    it('throws if no endpoint ID is specified', function () {
      const sut = new ReportStateResponseBuilder(request)

      sut.addEndpoint().withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

      expect(() => sut.getSucceedResponse()).to.throw('An endpoint ID is required.')
    })
  })
})
