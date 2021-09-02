import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { ChangeCauseType, ChangeReportPayload } from '../src/changeReport/ChangeReportPayload'
import { ChangeReportRequest } from '../src/changeReport/ChangeReportRequest'
import { ChangeReportRequestBuilder } from '../src/changeReport/ChangeReportRequestBuilder'

const request: ChangeReportRequest<ChangeReportPayload> = require('./fixtures/changeReportRequest.json')

describe('change report request builder', function() {
  it('creates a successful request when messageId, endpointId, and change cause specified', function() {
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
    const requestBody = builder.getRequestBody()

    expect(requestBody).to.deep.equal(request)
  })
  it('creates a successful partitioned token request when messageId, endpointId, and change cause specified', function() {
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .addEndpoint()
        .withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
    const requestBody = builder.getRequestBody()

    const expected = _.cloneDeep(request)
    expected.event.endpoint.scope = {
      type: 'BearerTokenWithPartition',
      token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
      partition: 'Partition',
      userId: 'UserId',
    }

    expect(requestBody).to.deep.equal(expected)
  })
  it('creates a successful request when multiple properties have the same instance but different namespaces', function() {
    const req = _.cloneDeep(request)
    req.context!.properties!.push({ 
      namespace: 'Alexa.InventoryUsageSensor',
      instance: 'air filter',
      name: 'level',
      value: { '@type': 'Percentage', 'value': 74 },
      timeOfSample: '2017-02-03T16:20:50.000Z',
      uncertaintyInMilliseconds: 60000
    })
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.InventoryUsageSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
    const requestBody = builder.getRequestBody()

    expect(requestBody).to.deep.equal(req)
  })
  it('creates a successful request when multiple properties have the same namespace but different instances', function() {
    const req = _.cloneDeep(request)
    req.context!.properties!.push({ 
      namespace: 'Alexa.InventoryLevelSensor',
      instance: 'humidifier pad',
      name: 'level',
      value: { '@type': 'Percentage', 'value': 74 },
      timeOfSample: '2017-02-03T16:20:50.000Z',
      uncertaintyInMilliseconds: 60000
    })
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.InventoryLevelSensor', 'humidifier pad', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
    const requestBody = builder.getRequestBody()

    expect(requestBody).to.deep.equal(req)
  })
  it('throws an exception if duplicate unchanged properties are added', function() {
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)

    expect(function(){ builder.getRequestBody() }).to.throw('The following unchanged properties are duplicated: ["{\\"namespace\\":\\"Alexa.PowerController\\",\\"name\\":\\"powerState\\",\\"value\\":\\"ON\\",\\"timeOfSample\\":\\"2017-02-03T16:20:50.000Z\\",\\"uncertaintyInMilliseconds\\":60000}"]')
  })
  it('throws an exception if duplicate changed properties are added', function() {
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)

    expect(function(){ builder.getRequestBody() }).to.throw('The following changed properties are duplicated: ["{\\"namespace\\":\\"Alexa.BrightnessController\\",\\"name\\":\\"brightness\\",\\"value\\":85,\\"timeOfSample\\":\\"2017-02-03T16:20:50.000Z\\",\\"uncertaintyInMilliseconds\\":0}"]')
  })
  it('throws an exception if a property is both changed and unchanged', function() {
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
      .withUnchangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)

    expect(function(){ builder.getRequestBody() }).to.throw('The following properties cannot be both changed and unchanged: [{"namespace":"Alexa.BrightnessController","name":"brightness","value":85,"timeOfSample":"2017-02-03T16:20:50.000Z","uncertaintyInMilliseconds":0}]')
  })
  it('throws an exception if no changed properties are specified', function() {
    const builder = new ChangeReportRequestBuilder(
      '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
      'endpointId',
      ChangeCauseType.PhysicalInteraction)
    builder
      .withUnchangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)

    expect(function(){ builder.getRequestBody() }).to.throw('At least one property must have changed.')
  })
})
