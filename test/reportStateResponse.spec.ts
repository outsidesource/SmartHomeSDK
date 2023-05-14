import { expect } from 'chai'
import 'mocha'
import { ReportStateResponseBuilder } from '../src/directives/reportState/ReportStateResponseBuilder'
import { Request } from '../src/dispatcher/request/handler/Request'
import { ErrorTypes } from '../src/response/ErrorTypes'
import { Response } from '../src/response/Response'
import { EmptyResponsePayload } from '../src/response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../src/response/payloads/ErrorResponsePayload'

const request: Request<unknown> = require('./fixtures/reportStateRequest.json')
const succeedResponse: Response<EmptyResponsePayload> = require('./fixtures/reportStateResponse.json')
const failResponse: Response<ErrorResponsePayload> = require('./fixtures/errorResponse.json')

describe('report state response builder', function () {
  it('creates a successful response for a successful request', function () {
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

  it('creates an error response for a failed request', function () {
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
