import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { Request } from '../../src/outboundRequest/types'
import { ChangeReportRequestBuilder, ContextBuilder, EndpointBuilder } from '../../src/reports/change/requestBuilder'
import { ChangeCauseType, ChangeReportPayload } from '../../src/reports/change/types'
import { createSinonStubInstance, removeUndefinedProps } from '../helpers'

const request: Request<ChangeReportPayload> = require('../fixtures/changeReportRequest.json')

describe('change report', function () {
  afterEach(function () {
    sinon.restore()
  })



  describe('request builder', function () {
    it('returns a successful request when messageId, endpointId, and change cause specified', function () {
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
      sut
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(request)
    })

    it('returns a successful partitioned token request when messageId, endpointId, and change cause specified', function () {
      const req = _.cloneDeep(request)
      req.event.endpoint!.scope = {
        type: 'BearerTokenWithPartition',
        token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
        partition: 'Partition',
        userId: 'UserId',
      }
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .addEndpoint()
        .withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
      sut
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(req)
    })

    it('returns a successful request when multiple properties have the same instance but different namespaces', function () {
      const req = _.cloneDeep(request)
      req.context!.properties!.push({
        namespace: 'Alexa.InventoryUsageSensor',
        instance: 'air filter',
        name: 'level',
        value: { '@type': 'Percentage', 'value': 74 },
        timeOfSample: '2017-02-03T16:20:50.000Z',
        uncertaintyInMilliseconds: 60000
      })
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
      sut
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.InventoryUsageSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(req)
    })

    it('returns a successful request when multiple properties have the same namespace but different instances', function () {
      const req = _.cloneDeep(request)
      req.context!.properties!.push({
        namespace: 'Alexa.InventoryLevelSensor',
        instance: 'humidifier pad',
        name: 'level',
        value: { '@type': 'Percentage', 'value': 74 },
        timeOfSample: '2017-02-03T16:20:50.000Z',
        uncertaintyInMilliseconds: 60000
      })
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
      sut
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.InventoryLevelSensor', 'air filter', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.EndpointHealth', undefined, 'connectivity', { value: 'OK' }, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.InventoryLevelSensor', 'humidifier pad', 'level', { '@type': 'Percentage', 'value': 74 }, new Date('2017-02-03T16:20:50Z'), 60000)

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(req)
    })

    it('throws an exception when duplicate unchanged properties are added', function () {
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)

      expect(() => sut.getRequestBody()).to.throw('The following properties are duplicated: {\"namespace\":\"Alexa.PowerController\",\"name\":\"powerState\"}')
    })

    it('throws an exception when duplicate changed properties are added', function () {
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.PowerController', undefined, 'powerState', 'ON', new Date('2017-02-03T16:20:50Z'), 60000)

      expect(() => sut.getRequestBody()).to.throw('The following changed properties are duplicated: {\"namespace\":\"Alexa.BrightnessController\",\"name\":\"brightness\"}')
    })

    it('throws an exception when a property is both changed and unchanged', function () {
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withUnchangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)

      expect(() => sut.getRequestBody()).to.throw('The following properties cannot be both changed and unchanged: [{"namespace":"Alexa.BrightnessController","name":"brightness","value":85,"timeOfSample":"2017-02-03T16:20:50.000Z","uncertaintyInMilliseconds":0}]')
    })

    it('throws an exception when no changed properties are specified', function () {
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .withUnchangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)

      expect(() => sut.getRequestBody()).to.throw('At least one property must have changed.')
    })

    it('returns a request when a context is added without unchanged properties', function () {
      const sut = new ChangeReportRequestBuilder(
        'endpointId',
        ChangeCauseType.PhysicalInteraction)
      sut
        .withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .withCookie('macAddress', '62:7B:51:61:D3:19')
      sut
        .withChangedProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .addContext()
      const expected = _.cloneDeep(request)
      delete expected.context

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(expected)
    })

    it('returns the context when addContext() is invoked multiple times', function () {
      const sut = new ChangeReportRequestBuilder('endpointId', ChangeCauseType.PhysicalInteraction)

      const actual1 = sut.addContext()
      const actual2 = sut.addContext()

      expect(actual1).to.equal(actual2)
    })
  })



  describe('endpoint builder', function () {
    it('returns undefined when given no endpoint id', function () {
      const parentBuilderStub = createSinonStubInstance(ChangeReportRequestBuilder)
      const sut = new EndpointBuilder(parentBuilderStub)

      const actual = sut.getEndpoint()

      expect(actual).to.be.undefined
    })

    it('returns the parent builder when invoked', function () {
      const parentBuilderStub = createSinonStubInstance(ChangeReportRequestBuilder)
      const sut = new EndpointBuilder(parentBuilderStub)

      const actual = sut.getRequestBuilder()

      expect(actual).to.equal(parentBuilderStub)
    })
  })



  describe('context builder', function () {
    it('returns the parent builder when invoked', function () {
      const parentBuilderStub = createSinonStubInstance(ChangeReportRequestBuilder)
      const sut = new ContextBuilder(parentBuilderStub)

      const actual = sut.getRequestBuilder()

      expect(actual).to.equal(parentBuilderStub)
    })
  })
})
