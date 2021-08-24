import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { DiscoveryRequestPayload } from '../src/directives/discovery/DiscoveryRequestPayload'
import { DiscoveryEndpoint, DisplayCategories, SemanticActionNames, SemanticStateNames } from '../src/directives/discovery/DiscoveryResponsePayload'
import { AdditionalAttributesBuilder } from '../src/directives/discovery/factory/AdditionalAttributesBuilder'
import { CapabilityBuilder } from '../src/directives/discovery/factory/CapabilityBuilder'
import { DiscoveryEndpointBuilder } from '../src/directives/discovery/factory/DiscoveryEndpointBuilder'
import { DiscoveryResponseBuilder } from '../src/directives/discovery/factory/DiscoveryResponseBuilder'
import { PropertiesBuilder } from '../src/directives/discovery/factory/PropertiesBuilder'
import { SemanticActionBuilder } from '../src/directives/discovery/factory/SemanticActionBuilder'
import { SemanticStateBuilder } from '../src/directives/discovery/factory/SemanticStateBuilder'
import { Locales } from '../src/directives/discovery/ResourceLabel'
import { Request } from '../src/dispatcher/request/handler/Request'
import { ErrorTypes } from '../src/response/ErrorTypes'
import succeedResponse from './fixtures/discoveryResponse.json'
import failResponse from './fixtures/errorResponse.json'
import { createSinonStubInstance, toStringWithLeadingZeros } from './helpers'

const request: Request<DiscoveryRequestPayload> = require('./fixtures/discoveryRequest.json')

describe('discovery response builder', function() {
  afterEach(function() {
    sinon.restore()
  })
  it('creates a successful response for a successful request', function() {
    const builder = new DiscoveryResponseBuilder(request)
    builder.addDiscoveryEndpoint('WC:e889552c8a25', 'Sample Manufacturer', 'Smart Thermostat by Sample Manufacturer', 'My Home')
      .addAdditionalAttributes().withManufacturer('Sample Manufacturer').withModel('Sample Model').withSerialNumber('e889552c8a25').withFirmwareVersion('3.14').withSoftwareVersion('6.28').withCustomIdentifier('a8ab-e889552c8a25').getEndpointBuilder()
      .withDisplayCategories(DisplayCategories.Thermostat)
      .withCookie('macAddress', '62:7B:51:61:D3:19')
      .addCapability('Alexa', '3').getEndpointBuilder()
      .addCapability('Alexa.PowerController', '3').addProperties().withSupportedProperties('powerState').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.EndpointHealth', '3').addProperties().withSupportedProperties('connectivity').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.ThermostatController', '3')
        .addProperties().withSupportedProperties('thermostatMode').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder()
        .withConfiguration({supportedModes: ['HEAT','COOL','AUTO','OFF', ], }).getEndpointBuilder()
      .addCapability('Alexa.RangeController', '3').withInstance('FreshAirIntake.Position')
        .addProperties().withSupportedProperties('rangeValue').withProactivelyReported(true).withRetrievable(true).withNonControllable(false).getCapabilityBuilder()
        .withConfiguration({supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1, }, presets: [ { rangeValue: 10, presetResources: { friendlyNames: [ {'@type': 'asset', value: { assetId: 'Alexa.Value.Maximum', }, }, ], }, }, { rangeValue: 0, presetResources: { friendlyNames: [ { '@type': 'asset', value: { assetId: 'Alexa.Value.Minimum', }, }, ], }, }, ], })
        .withTextResource('Fresh air intake', Locales.English_UnitedStates).withTextResource('Air intake', Locales.English_UnitedStates).withTextResource('Outdoor air', Locales.English_UnitedStates).withTextResource('Entrada de aire fresco', Locales.Spanish_UnitedStates).withTextResource('Entrada de aire', Locales.Spanish_UnitedStates).withTextResource('Aire exterior', Locales.Spanish_UnitedStates)
        .addSemanticAction('SetRangeValue').withActions(SemanticActionNames.Close).withDirectivePayload({ 'rangeValue': 0, }).getCapabilityBuilder()
        .addSemanticAction('SetRangeValue').withActions(SemanticActionNames.Open).withDirectivePayload({ 'rangeValue': 100, }).getCapabilityBuilder()
        .addSemanticAction('AdjustRangeValue').withActions(SemanticActionNames.Lower).withDirectivePayload({ 'rangeValueDelta': -10, 'rangeValueDeltaDefault': false, }).getCapabilityBuilder()
        .addSemanticAction('AdjustRangeValue').withActions(SemanticActionNames.Raise).withDirectivePayload({ 'rangeValueDelta': 10, 'rangeValueDeltaDefault': false, }).getCapabilityBuilder()
        .addSemanticState().withStates(SemanticStateNames.Closed).withValue(0).getCapabilityBuilder()
        .addSemanticState().withStates(SemanticStateNames.Open).withRange(1, 100).getCapabilityBuilder()
        .getEndpointBuilder()
      .withTcpIpConnection('A5:E9:A6:90:09:8A:C5:0E')
    builder.addDiscoveryEndpoint('WC:e889552c8a25 Z:0', 'Sample Manufacturer', 'Smart Thermostat Zone by Sample Manufacturer', 'Downstairs')
      .addAdditionalAttributes().withManufacturer('Sample Manufacturer').withModel('Sample Model').withSerialNumber('e889552c8a25').withFirmwareVersion('3.14').withSoftwareVersion('6.28').withCustomIdentifier('a8ab-e889552c8a25:0').getEndpointBuilder()
      .withDisplayCategories(DisplayCategories.Thermostat, DisplayCategories.TemperatureSensor)
      .withCookie('macAddress', '62:7B:51:61:D3:19')
      .addCapability('Alexa', '3').getEndpointBuilder()
      .addCapability('Alexa.BrightnessController', '3').addProperties().withSupportedProperties('brightness').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.ThermostatController', '3')
        .addProperties().withSupportedProperties('targetSetpoint', 'lowerSetpoint', 'upperSetpoint').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder()
        .withConfiguration({supportsScheduling: true, }).getEndpointBuilder()
      .addCapability('Alexa.TemperatureSensor', '3').addProperties().withSupportedProperties('temperature').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .withRelationship('isConnectedBy', 'WC:e889552c8a25')
    builder.addDiscoveryEndpoint('WC:e889552c8a25 Z:1', 'Sample Manufacturer', 'Smart Thermostat Zone by Sample Manufacturer', 'Upstairs')
      .addAdditionalAttributes().withManufacturer('Sample Manufacturer').withModel('Sample Model').withSerialNumber('e889552c8a25').withFirmwareVersion('3.14').withSoftwareVersion('6.28').withCustomIdentifier('a8ab-e889552c8a25:1').getEndpointBuilder()
      .withDisplayCategories(DisplayCategories.Thermostat, DisplayCategories.TemperatureSensor)
      .withCookie('macAddress', '62:7B:51:61:D3:19')
      .addCapability('Alexa', '3').getEndpointBuilder()
      .addCapability('Alexa.BrightnessController', '3').addProperties().withSupportedProperties('brightness').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.ThermostatController', '3')
        .addProperties().withSupportedProperties('targetSetpoint', 'lowerSetpoint', 'upperSetpoint').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder()
        .withConfiguration({supportsScheduling: true, }).getEndpointBuilder()
      .addCapability('Alexa.TemperatureSensor', '3').addProperties().withSupportedProperties('temperature').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .withRelationship('isConnectedBy', 'WC:e889552c8a25')

    expect(builder.getSucceedResponse()).to.deep.equal(succeedResponse)
  })
  it('creates an error response for a failed request', function() {
    const builder = new DiscoveryResponseBuilder(request)
    const response = builder
      .getFailResponse(ErrorTypes.InternalError, 'This is a test error')

    expect(response).to.deep.equal(failResponse)
  })
  it('throws if no endpoints are added', function() {
    const builder = new DiscoveryResponseBuilder(request)

    expect(function(){ builder.getSucceedResponse() }).to.throw('At least one endpoint is required.')
  })
  it('throws if too many endpoints are added', function() {
    const builder = new DiscoveryResponseBuilder(request)

    for (let i = 0; i < 301; i++) {
      builder.addDiscoveryEndpoint(`endpoint-${toStringWithLeadingZeros(i, 3)}`, 'manufacturerName', 'description', `friendly name ${toStringWithLeadingZeros(i, 3)}`)
        .withDisplayCategories(DisplayCategories.Other)
        .addCapability('Alexa', '3')
    }

    expect(function(){ builder.getSucceedResponse() }).to.throw('The number of endpoints cannot exceed 300.')
  })
  it('throws if semantic action names are used more than once in a single endpoint', function() {
    const builder = new DiscoveryResponseBuilder(request)
    builder.addDiscoveryEndpoint('endpointId', 'manufacturerName', 'description', 'friendly name')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capability0', '3').addSemanticAction('directiveName').withActions(SemanticActionNames.Open).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('capability1', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Open).getCapabilityBuilder().getEndpointBuilder()
      
    expect(function(){ builder.getSucceedResponse() }).to.throw('Duplicate semantic action names found for the following: [{"action":"Alexa.Actions.Open","locations":[{"endpoint":"endpointId","capability":"capability0"},{"endpoint":"endpointId","capability":"capability1","instance":"instanceName"}]}]')
  })
  it('throws if semantic action names are used more than once across multiple endpoints', function() {
    const builder = new DiscoveryResponseBuilder(request)
    builder.addDiscoveryEndpoint('endpointId0', 'manufacturerName', 'description', 'friendly name 0')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower).getCapabilityBuilder().getEndpointBuilder()
    builder.addDiscoveryEndpoint('endpointId1', 'manufacturerName', 'description', 'friendly name 1')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower).getCapabilityBuilder().getEndpointBuilder()
      
    expect(function(){ builder.getSucceedResponse() }).to.throw('Duplicate semantic action names found for the following: [{"action":"Alexa.Actions.Lower","locations":[{"endpoint":"endpointId0","capability":"capabilityName","instance":"instanceName"},{"endpoint":"endpointId1","capability":"capabilityName","instance":"instanceName"}]}]')
  })
  it('throws if multiple semantic action names are used more than once', function() {
    const builder = new DiscoveryResponseBuilder(request)
    builder.addDiscoveryEndpoint('endpointId0', 'manufacturerName', 'description', 'friendly name 0')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower, SemanticActionNames.Close).getCapabilityBuilder().getEndpointBuilder()
    builder.addDiscoveryEndpoint('endpointId1', 'manufacturerName', 'description', 'friendly name 1')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower, SemanticActionNames.Close).getCapabilityBuilder().getEndpointBuilder()
      
    expect(function(){ builder.getSucceedResponse() }).to.throw('Duplicate semantic action names found for the following: [{"action":"Alexa.Actions.Lower","locations":[{"endpoint":"endpointId0","capability":"capabilityName","instance":"instanceName"},{"endpoint":"endpointId1","capability":"capabilityName","instance":"instanceName"}]},{"action":"Alexa.Actions.Close","locations":[{"endpoint":"endpointId0","capability":"capabilityName","instance":"instanceName"},{"endpoint":"endpointId1","capability":"capabilityName","instance":"instanceName"}]}]')
  })
})

describe('discovery endpoint builder', function() {
  const minimalEndpoint: DiscoveryEndpoint = {
    endpointId: 'endpointId',
    manufacturerName: 'manufacturerName',
    description: 'description',
    friendlyName: 'friendly name',
    displayCategories: [ DisplayCategories.Other, ],
    capabilities: [
      {
        type: 'AlexaInterface',
        interface: 'Alexa',
        version: '3',
      },
    ],
  }

  afterEach(function() {
    sinon.restore()
  })
  it('creates a minimal endpoint', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const endpoint = builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')
        .getEndpointBuilder()
      .getEndpoint()

    expect(endpoint).to.deep.equal(minimalEndpoint)
  })
  it('creates an endpoint with a Zigbee connection', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const expectedEndpoint = _.cloneDeep(minimalEndpoint)
    expectedEndpoint.connections = [
      {
        type: 'ZIGBEE',
        macAddress: '00:11:22:33:44:55',
      },
    ]
    const endpoint = builder
      .withDisplayCategories(DisplayCategories.Other)
      .withZigbeeConnection('00:11:22:33:44:55')
      .addCapability('Alexa', '3')
        .getEndpointBuilder()
      .getEndpoint()

    expect(endpoint).to.deep.equal(expectedEndpoint)
  })
  it('creates an endpoint with a ZWave connection', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const expectedEndpoint = _.cloneDeep(minimalEndpoint)
    expectedEndpoint.connections = [
      {
        type: 'ZWAVE',
        homeId: '0x01234567',
        nodeId: '0x89',
      },
    ]
    const endpoint = builder
      .withDisplayCategories(DisplayCategories.Other)
      .withZWaveConnection('0x01234567', '0x89')
      .addCapability('Alexa', '3')
        .getEndpointBuilder()
      .getEndpoint()

    expect(endpoint).to.deep.equal(expectedEndpoint)
  })
  it('creates an endpoint with an unknown connection', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const expectedEndpoint = _.cloneDeep(minimalEndpoint)
    expectedEndpoint.connections = [
      {
        type: 'UNKNOWN',
        value: '00:11:22:33:44:55',
      },
    ]
    const endpoint = builder
      .withDisplayCategories(DisplayCategories.Other)
      .withUnknownConnection('00:11:22:33:44:55')
      .addCapability('Alexa', '3')
        .getEndpointBuilder()
      .getEndpoint()

    expect(endpoint).to.deep.equal(expectedEndpoint)
  })
  it('throws if the endpoint ID is empty', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, '', 'manufacturerName', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The endpoint ID "" does not match the expected format.')
  })
  it('throws if the endpoint ID is too long', function() {
    const longString = '0'.repeat(257)
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, longString, 'manufacturerName', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw(`The endpoint ID "${longString}" does not match the expected format.`)
  })
  it('throws if the endpoint ID contains a bad character', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'contains a comma, which is bad', 'manufacturerName', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The endpoint ID "contains a comma, which is bad" does not match the expected format.')
  })
  it('throws if the manufacturer name is empty', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', '', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The manufacturer name cannot be empty.')
  })
  it('throws if the manufacturer name is too long', function() {
    const longString = '0'.repeat(129)
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', longString, 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw(`The manufacturer name "${longString}" is too long.`)
  })
  it('throws if the description is empty', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', '', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The description cannot be empty.')
  })
  it('throws if the description is too long', function() {
    const longString = '0'.repeat(129)
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', longString, 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw(`The description "${longString}" is too long.`)
  })
  it('throws if the friendly name is empty', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', '')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The friendly name "" does not match the expected format.')
  })
  it('throws if the friendly name is too long', function() {
    const longString = '0'.repeat(129)
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', longString)
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw(`The friendly name "${longString}" does not match the expected format.`)
  })
  it('throws if the friendly name contains a bad character', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'contains a comma, which is bad')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The friendly name "contains a comma, which is bad" does not match the expected format.')
  })
  it('throws if no display categories have been specified', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    builder
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('At least one display category is required.')
  })
  it('throws if no capabilities have been specified', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)

    expect(function(){ builder.getEndpoint() }).to.throw('At least one capability is required.')
  })
  it('throws if too many capabilities have been specified', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)

    for (let i = 0; i < 101; i++) {
      builder.addCapability(`capability-${toStringWithLeadingZeros(i, 3)}`, String(i))
    }

    expect(function(){ builder.getEndpoint() }).to.throw('The number of capabilities cannot exceed 100.')
  })
  it('throws if too much cookie data is specified', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryResponseBuilder)
    const builder = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    builder
      .withDisplayCategories(DisplayCategories.Other)
      .withCookie('data', '0'.repeat(5000))
      .addCapability('Alexa', '3')

    expect(function(){ builder.getEndpoint() }).to.throw('The cookie cannot be larger than 5000 bytes.')
  })
})

describe('additional attributes builder', function() {
  afterEach(function() {
    sinon.restore()
  })
  describe('creates valid attributes only X is provided', function() {
    it('manufacturer', function() {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const builder = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        manufacturer: 'value',
      }
      const attributes = builder
        .withManufacturer('value')
        .getAdditionalAttributes()
  
      expect(attributes).to.deep.equal(expectedAttributes)
    })
    it('model', function() {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const builder = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        model: 'value',
      }
      const attributes = builder
        .withModel('value')
        .getAdditionalAttributes()
  
      expect(attributes).to.deep.equal(expectedAttributes)
    })
    it('serial number', function() {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const builder = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        serialNumber: 'value',
      }
      const attributes = builder
        .withSerialNumber('value')
        .getAdditionalAttributes()
  
      expect(attributes).to.deep.equal(expectedAttributes)
    })
    it('firmware version', function() {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const builder = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        firmwareVersion: 'value',
      }
      const attributes = builder
        .withFirmwareVersion('value')
        .getAdditionalAttributes()
  
      expect(attributes).to.deep.equal(expectedAttributes)
    })
    it('software version', function() {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const builder = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        softwareVersion: 'value',
      }
      const attributes = builder
        .withSoftwareVersion('value')
        .getAdditionalAttributes()
  
      expect(attributes).to.deep.equal(expectedAttributes)
    })
    it('custom identifier', function() {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const builder = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        customIdentifier: 'value',
      }
      const attributes = builder
        .withCustomIdentifier('value')
        .getAdditionalAttributes()
  
      expect(attributes).to.deep.equal(expectedAttributes)
    })
  })
  it('creates undefined if no attributes are specified', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const attributes = builder.getAdditionalAttributes()

    expect(attributes).to.be.undefined
  })
  it('throws if the manufacturer is too long', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    builder.withManufacturer(longString)

    expect(function(){ builder.getAdditionalAttributes() }).to.throw(`The manufacturer "${longString}" is too long.`)
  })
  it('throws if the model is too long', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    builder.withModel(longString)

    expect(function(){ builder.getAdditionalAttributes() }).to.throw(`The model "${longString}" is too long.`)
  })
  it('throws if the serial number is too long', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    builder.withSerialNumber(longString)

    expect(function(){ builder.getAdditionalAttributes() }).to.throw(`The serial number "${longString}" is too long.`)
  })
  it('throws if the firmware version is too long', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    builder.withFirmwareVersion(longString)

    expect(function(){ builder.getAdditionalAttributes() }).to.throw(`The firmware version "${longString}" is too long.`)
  })
  it('throws if the software version is too long', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    builder.withSoftwareVersion(longString)

    expect(function(){ builder.getAdditionalAttributes() }).to.throw(`The software version "${longString}" is too long.`)
  })
  it('throws if the custom identifier is too long', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    builder.withCustomIdentifier(longString)

    expect(function(){ builder.getAdditionalAttributes() }).to.throw(`The custom identifier "${longString}" is too long.`)
  })
})

describe('capability builder', function() {
  afterEach(function() {
    sinon.restore()
  })
  it('creates a capability with verifications', function() {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const builder = new CapabilityBuilder(parentBuilderStub, 'interfaceName', 'version')
    const expectedCapability = {
      type: 'AlexaInterface',
      interface: 'interfaceName',
      version: 'version',
      verificationsRequired: [
        {
          directive: 'directiveName',
          methods: [
            {
              '@type': 'Confirmation'
            },
          ],
        },
      ],
    }
    const capability = builder
      .withVerification('directiveName')
      .getCapability()

    expect(capability).to.deep.equal(expectedCapability)
  })
})

describe('properties builder', function() {
  afterEach(function() {
    sinon.restore()
  })
  it('creates a properties with names only when no flags are specified', function() {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const builder = new PropertiesBuilder(parentBuilderStub)
    const expectedProperties = {
      supported: [
        {
          name: 'interfaceProperty',
        },
      ],
    }
    const properties = builder
      .withSupportedProperties('interfaceProperty')
      .getProperties()

    expect(properties).to.deep.equal(expectedProperties)
  })
  it('creates a properties with flags only when no names are specified', function() {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const builder = new PropertiesBuilder(parentBuilderStub)
    const expectedProperties = {
      proactivelyReported: true,
      retrievable: true,
    }
    const properties = builder
      .withProactivelyReported(true)
      .withRetrievable(true)
      .getProperties()

    expect(properties).to.deep.equal(expectedProperties)
  })
})

describe('semantic action builder', function() {
  afterEach(function() {
    sinon.restore()
  })
  it('creates a mapping when no payload is specified', function() {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const builder = new SemanticActionBuilder(parentBuilderStub, 'directiveName')
    const expectedMapping = {
      '@type': 'ActionsToDirective',
      actions: [SemanticActionNames.Open, SemanticActionNames.Raise],
      directive: { name: 'directiveName', }
    }
    const mapping = builder
      .withActions(SemanticActionNames.Open, SemanticActionNames.Raise)
      .getMapping()

    expect(mapping).to.deep.equal(expectedMapping)
  })
  it('throws if no actions are specified', function() {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const builder = new SemanticActionBuilder(parentBuilderStub, 'directiveName')

    expect(function(){ builder.getMapping() }).to.throw('At least one semantic action must be specified.')
  })
})

describe('semantic state builder', function() {
  afterEach(function() {
    sinon.restore()
  })
  it('throws if no states are specified', function() {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const builder = new SemanticStateBuilder(parentBuilderStub)

    expect(function(){ builder.getMapping() }).to.throw('At least one semantic state must be specified.')
  })
  it('throws if no value or range are specified', function() {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const builder = new SemanticStateBuilder(parentBuilderStub)
      .withStates(SemanticStateNames.Open)

    expect(function(){ builder.getMapping() }).to.throw('Either a value or range must be specified.')
  })
})
