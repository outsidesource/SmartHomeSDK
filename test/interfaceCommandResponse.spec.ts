import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { InterfaceCommandResponseBuilder } from '../src/directives/interfaceCommand/InterfaceCommandResponseBuilder'
import { Request } from '../src/dispatcher/request/handler/Request'
import { ErrorTypes } from '../src/response/ErrorTypes'
import failResponse from './fixtures/errorResponse.json'
import succeedResponse from './fixtures/interfaceCommandResponse.json'

const request: Request<unknown> = require('./fixtures/interfaceCommandRequest.json')

describe('interface command response builder', function() {
  it('creates a successful response for a successful request', function() {
    const builder = new InterfaceCommandResponseBuilder(request)
    builder
      .addContext()
        .withProperty('Alexa.ThermostatController', undefined, 'thermostatMode', 'HEAT', new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.ThermostatController', undefined, 'targetSetpoint', { value: 20.0, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.TemperatureSensor', undefined, 'temperature', { value: 19.3, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 1000)
    builder
      .addEndpoint().withEndpointId('endpointId')

    const response = builder
      .getSucceedResponse()

    expect(response).to.deep.equal(succeedResponse)
  })
  it('creates a successful response when the namespace, name, and payload are changed', function() {
    const builder = new InterfaceCommandResponseBuilder(request)
    builder
      .withNamespace('myNamespace').withName('myName').withPayload({ prop: 'value', })
      .addContext()
        .withProperty('Alexa.ThermostatController', undefined, 'thermostatMode', 'HEAT', new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.ThermostatController', undefined, 'targetSetpoint', { value: 20.0, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 500)
        .withProperty('Alexa.TemperatureSensor', undefined, 'temperature', { value: 19.3, scale: 'CELSIUS' }, new Date('2017-02-03T16:20:50.52Z'), 1000)
    builder
      .addEndpoint().withEndpointId('endpointId')

    const expected = _.cloneDeep(succeedResponse)
    expected.event.header.namespace = 'myNamespace'
    expected.event.header.name = 'myName'
    expected.event.payload = { prop: 'value', }

    const response = builder
      .getSucceedResponse()

    expect(response).to.deep.equal(expected)
  })
  it('creates an error response for a failed request', function() {
    const builder = new InterfaceCommandResponseBuilder(request)
    const response = builder
      .getFailResponse(ErrorTypes.InternalError, 'This is a test error')

    expect(response).to.deep.equal(failResponse)
  })
  it('throws if no endpoint ID is specified', function() {
    const builder = new InterfaceCommandResponseBuilder(request)
    builder
      .addEndpoint().withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

    expect(function(){ builder.getSucceedResponse() }).to.throw('An endpoint ID is required.')
  })
})
