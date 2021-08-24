import { expect } from 'chai'
import 'mocha'
import { ReportStateResponseBuilder } from '../../lib/smarthome-sdk/directives/reportState/ReportStateResponseBuilder'
import { Request, RequestPayload } from '../../lib/smarthome-sdk/dispatcher/request/handler/Request'
import { ErrorTypes } from '../../lib/smarthome-sdk/response/ErrorTypes'
import failResponse from './fixtures/errorResponse.json'
import succeedResponse from './fixtures/reportStateResponse.json'

const request: Request<RequestPayload> = require('./fixtures/reportStateRequest.json')

describe('report state response builder', function() {
  it('creates a successful response for a successful request', function() {
    const builder = new ReportStateResponseBuilder(request)
    builder
      .withProperty('Alexa.ThermostatController', 'targetSetpoint', { value: 25.0, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50Z'), 6000)
      .withProperty('Alexa.ThermostatController', 'thermostatMode', 'HEAT', new Date('2017-02-03T16:20:50Z'), 6000)
      .withProperty('Alexa.EndpointHealth', 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
      .addEndpoint().withEndpointId('endpointId').withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

    const response = builder
      .getSucceedResponse()

    expect(response).to.deep.equal(succeedResponse)
  })
  it('creates an error response for a failed request', function() {
    const builder = new ReportStateResponseBuilder(request)
    const response = builder
      .getFailResponse(ErrorTypes.InternalError, 'This is a test error')

    expect(response).to.deep.equal(failResponse)
  })
  it('throws if no endpoint ID is specified', function() {
    const builder = new ReportStateResponseBuilder(request)
    builder
      .addEndpoint().withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

    expect(function(){ builder.getSucceedResponse() }).to.throw('An endpoint ID is required.')
  })
})
