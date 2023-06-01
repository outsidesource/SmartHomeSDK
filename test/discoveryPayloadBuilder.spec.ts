import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { AdditionalAttributesBuilder } from '../src/discovery/AdditionalAttributesBuilder'
import { CapabilityBuilder } from '../src/discovery/CapabilityBuilder'
import { DiscoveryEndpointBuilder } from '../src/discovery/DiscoveryEndpointBuilder'
import { DiscoveryEndpoint, DiscoveryPayload, DisplayCategories, SemanticActionNames, SemanticStateNames } from '../src/discovery/DiscoveryPayload'
import { DiscoveryPayloadBuilder } from '../src/discovery/DiscoveryPayloadBuilder'
import { PropertiesBuilder } from '../src/discovery/PropertiesBuilder'
import { Locales } from '../src/discovery/ResourceLabel'
import { SemanticActionBuilder } from '../src/discovery/SemanticActionBuilder'
import { SemanticStateBuilder } from '../src/discovery/SemanticStateBuilder'
import { removeUndefinedProps } from './fixtures'
import { createSinonStubInstance, toStringWithLeadingZeros } from './helpers'

const comprehensiveDiscoveryPayload: DiscoveryPayload = require('./fixtures/discoveryPayload.json')

describe('discovery payload builder', function () {
  it('creates a comprehensive payload', function () {
    const sut = new DiscoveryPayloadBuilder()
    sut.addDiscoveryEndpoint('WC:e889552c8a25', 'Sample Manufacturer', 'Smart Thermostat by Sample Manufacturer', 'My Home')
      .addAdditionalAttributes().withManufacturer('Sample Manufacturer').withModel('Sample Model').withSerialNumber('e889552c8a25').withFirmwareVersion('3.14').withSoftwareVersion('6.28').withCustomIdentifier('a8ab-e889552c8a25').getEndpointBuilder()
      .withDisplayCategories(DisplayCategories.Thermostat)
      .withCookie('macAddress', '62:7B:51:61:D3:19')
      .addCapability('Alexa', '3').getEndpointBuilder()
      .addCapability('Alexa.PowerController', '3').addProperties().withSupportedProperties('powerState').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.EndpointHealth', '3').addProperties().withSupportedProperties('connectivity').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.ThermostatController', '3')
      .addProperties().withSupportedProperties('thermostatMode').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder()
      .withConfiguration({ supportedModes: ['HEAT', 'COOL', 'AUTO', 'OFF',], }).getEndpointBuilder()
      .addCapability('Alexa.RangeController', '3').withInstance('FreshAirIntake.Position')
      .addProperties().withSupportedProperties('rangeValue').withProactivelyReported(true).withRetrievable(true).withNonControllable(false).getCapabilityBuilder()
      .withConfiguration({ supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1, }, presets: [{ rangeValue: 10, presetResources: { friendlyNames: [{ '@type': 'asset', value: { assetId: 'Alexa.Value.Maximum', }, },], }, }, { rangeValue: 0, presetResources: { friendlyNames: [{ '@type': 'asset', value: { assetId: 'Alexa.Value.Minimum', }, },], }, },], })
      .withTextResource('Fresh air intake', Locales.English_UnitedStates).withTextResource('Air intake', Locales.English_UnitedStates).withTextResource('Outdoor air', Locales.English_UnitedStates).withTextResource('Entrada de aire fresco', Locales.Spanish_UnitedStates).withTextResource('Entrada de aire', Locales.Spanish_UnitedStates).withTextResource('Aire exterior', Locales.Spanish_UnitedStates)
      .addSemanticAction('SetRangeValue').withActions(SemanticActionNames.Close).withDirectivePayload({ 'rangeValue': 0, }).getCapabilityBuilder()
      .addSemanticAction('SetRangeValue').withActions(SemanticActionNames.Open).withDirectivePayload({ 'rangeValue': 100, }).getCapabilityBuilder()
      .addSemanticAction('AdjustRangeValue').withActions(SemanticActionNames.Lower).withDirectivePayload({ 'rangeValueDelta': -10, 'rangeValueDeltaDefault': false, }).getCapabilityBuilder()
      .addSemanticAction('AdjustRangeValue').withActions(SemanticActionNames.Raise).withDirectivePayload({ 'rangeValueDelta': 10, 'rangeValueDeltaDefault': false, }).getCapabilityBuilder()
      .addSemanticState().withStates(SemanticStateNames.Closed).withValue(0).getCapabilityBuilder()
      .addSemanticState().withStates(SemanticStateNames.Open).withRange(1, 100).getCapabilityBuilder()
      .getEndpointBuilder()
      .withTcpIpConnection('A5:E9:A6:90:09:8A:C5:0E')
    sut.addDiscoveryEndpoint('WC:e889552c8a25 Z:0', 'Sample Manufacturer', 'Smart Thermostat Zone by Sample Manufacturer', 'Downstairs')
      .addAdditionalAttributes().withManufacturer('Sample Manufacturer').withModel('Sample Model').withSerialNumber('e889552c8a25').withFirmwareVersion('3.14').withSoftwareVersion('6.28').withCustomIdentifier('a8ab-e889552c8a25:0').getEndpointBuilder()
      .withDisplayCategories(DisplayCategories.Thermostat, DisplayCategories.TemperatureSensor)
      .withCookie('macAddress', '62:7B:51:61:D3:19')
      .addCapability('Alexa', '3').getEndpointBuilder()
      .addCapability('Alexa.BrightnessController', '3').addProperties().withSupportedProperties('brightness').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.ThermostatController', '3')
      .addProperties().withSupportedProperties('targetSetpoint', 'lowerSetpoint', 'upperSetpoint').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder()
      .withConfiguration({ supportsScheduling: true, }).getEndpointBuilder()
      .addCapability('Alexa.TemperatureSensor', '3').addProperties().withSupportedProperties('temperature').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .withRelationship('isConnectedBy', 'WC:e889552c8a25')
    sut.addDiscoveryEndpoint('WC:e889552c8a25 Z:1', 'Sample Manufacturer', 'Smart Thermostat Zone by Sample Manufacturer', 'Upstairs')
      .addAdditionalAttributes().withManufacturer('Sample Manufacturer').withModel('Sample Model').withSerialNumber('e889552c8a25').withFirmwareVersion('3.14').withSoftwareVersion('6.28').withCustomIdentifier('a8ab-e889552c8a25:1').getEndpointBuilder()
      .withDisplayCategories(DisplayCategories.Thermostat, DisplayCategories.TemperatureSensor)
      .withCookie('macAddress', '62:7B:51:61:D3:19')
      .addCapability('Alexa', '3').getEndpointBuilder()
      .addCapability('Alexa.BrightnessController', '3').addProperties().withSupportedProperties('brightness').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('Alexa.ThermostatController', '3')
      .addProperties().withSupportedProperties('targetSetpoint', 'lowerSetpoint', 'upperSetpoint').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder()
      .withConfiguration({ supportsScheduling: true, }).getEndpointBuilder()
      .addCapability('Alexa.TemperatureSensor', '3').addProperties().withSupportedProperties('temperature').withProactivelyReported(true).withRetrievable(true).getCapabilityBuilder().getEndpointBuilder()
      .withRelationship('isConnectedBy', 'WC:e889552c8a25')

    const actual = sut.getPayload()

    expect(removeUndefinedProps(actual)).to.deep.equal(comprehensiveDiscoveryPayload)
  })

  it('creates a payload with no endpoints when none are present', function () {
    const sut = new DiscoveryPayloadBuilder()

    const actual = sut.getPayload()

    expect(actual.endpoints).to.be.empty
  })

  it('throws if too many endpoints are added', function () {
    const sut = new DiscoveryPayloadBuilder()

    for (let i = 0; i < 301; i++) {
      sut.addDiscoveryEndpoint(`endpoint-${toStringWithLeadingZeros(i, 3)}`, 'manufacturerName', 'description', `friendly name ${toStringWithLeadingZeros(i, 3)}`)
        .withDisplayCategories(DisplayCategories.Other)
        .addCapability('Alexa', '3')
    }

    expect(() => sut.getPayload()).to.throw('The number of endpoints cannot exceed 300.')
  })

  it('throws if semantic action names are used more than once in a single endpoint', function () {
    const sut = new DiscoveryPayloadBuilder()
    sut.addDiscoveryEndpoint('endpointId', 'manufacturerName', 'description', 'friendly name')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capability0', '3').addSemanticAction('directiveName').withActions(SemanticActionNames.Open).getCapabilityBuilder().getEndpointBuilder()
      .addCapability('capability1', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Open).getCapabilityBuilder().getEndpointBuilder()

    expect(() => sut.getPayload()).to.throw('Duplicate semantic action names found for the following: [{"action":"Alexa.Actions.Open","locations":[{"endpoint":"endpointId","capability":"capability0"},{"endpoint":"endpointId","capability":"capability1","instance":"instanceName"}]}]')
  })

  it('throws if semantic action names are used more than once across multiple endpoints', function () {
    const sut = new DiscoveryPayloadBuilder()
    sut.addDiscoveryEndpoint('endpointId0', 'manufacturerName', 'description', 'friendly name 0')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower).getCapabilityBuilder().getEndpointBuilder()
    sut.addDiscoveryEndpoint('endpointId1', 'manufacturerName', 'description', 'friendly name 1')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower).getCapabilityBuilder().getEndpointBuilder()

    expect(() => sut.getPayload()).to.throw('Duplicate semantic action names found for the following: [{"action":"Alexa.Actions.Lower","locations":[{"endpoint":"endpointId0","capability":"capabilityName","instance":"instanceName"},{"endpoint":"endpointId1","capability":"capabilityName","instance":"instanceName"}]}]')
  })

  it('throws if multiple semantic action names are used more than once', function () {
    const sut = new DiscoveryPayloadBuilder()
    sut.addDiscoveryEndpoint('endpointId0', 'manufacturerName', 'description', 'friendly name 0')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower, SemanticActionNames.Close).getCapabilityBuilder().getEndpointBuilder()
    sut.addDiscoveryEndpoint('endpointId1', 'manufacturerName', 'description', 'friendly name 1')
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower, SemanticActionNames.Close).getCapabilityBuilder().getEndpointBuilder()

    expect(() => sut.getPayload()).to.throw('Duplicate semantic action names found for the following: [{"action":"Alexa.Actions.Lower","locations":[{"endpoint":"endpointId0","capability":"capabilityName","instance":"instanceName"},{"endpoint":"endpointId1","capability":"capabilityName","instance":"instanceName"}]},{"action":"Alexa.Actions.Close","locations":[{"endpoint":"endpointId0","capability":"capabilityName","instance":"instanceName"},{"endpoint":"endpointId1","capability":"capabilityName","instance":"instanceName"}]}]')
  })
})



describe('discovery endpoint builder', function () {
  const minimalEndpoint: DiscoveryEndpoint = {
    endpointId: 'endpointId',
    manufacturerName: 'manufacturerName',
    description: 'description',
    friendlyName: 'friendly name',
    displayCategories: [DisplayCategories.Other,],
    capabilities: [
      {
        type: 'AlexaInterface',
        interface: 'Alexa',
        version: '3',
      },
    ],
  }

  afterEach(function () {
    sinon.restore()
  })

  it('creates a minimal endpoint', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')

    const actual = sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')
      .getEndpointBuilder()
      .getEndpoint()

    expect(removeUndefinedProps(actual)).to.deep.equal(minimalEndpoint)
  })

  it('creates an endpoint with a unicode friendly name', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'Système Maison')
    const expected = _.cloneDeep(minimalEndpoint)
    expected.friendlyName = 'Système Maison'

    const actual = sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')
      .getEndpointBuilder()
      .getEndpoint()

    expect(removeUndefinedProps(actual)).to.deep.equal(expected)
  })

  it('creates an endpoint with a Zigbee connection', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const expectedEndpoint = _.cloneDeep(minimalEndpoint)
    expectedEndpoint.connections = [
      {
        type: 'ZIGBEE',
        macAddress: '00:11:22:33:44:55',
      },
    ]

    const actual = sut
      .withDisplayCategories(DisplayCategories.Other)
      .withZigbeeConnection('00:11:22:33:44:55')
      .addCapability('Alexa', '3')
      .getEndpointBuilder()
      .getEndpoint()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedEndpoint)
  })

  it('creates an endpoint with a ZWave connection', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const expectedEndpoint = _.cloneDeep(minimalEndpoint)
    expectedEndpoint.connections = [
      {
        type: 'ZWAVE',
        homeId: '0x01234567',
        nodeId: '0x89',
      },
    ]

    const actual = sut
      .withDisplayCategories(DisplayCategories.Other)
      .withZWaveConnection('0x01234567', '0x89')
      .addCapability('Alexa', '3')
      .getEndpointBuilder()
      .getEndpoint()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedEndpoint)
  })

  it('creates an endpoint with an unknown connection', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    const expectedEndpoint = _.cloneDeep(minimalEndpoint)
    expectedEndpoint.connections = [
      {
        type: 'UNKNOWN',
        value: '00:11:22:33:44:55',
      },
    ]

    const actual = sut
      .withDisplayCategories(DisplayCategories.Other)
      .withUnknownConnection('00:11:22:33:44:55')
      .addCapability('Alexa', '3')
      .getEndpointBuilder()
      .getEndpoint()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedEndpoint)
  })

  it('throws if the endpoint ID is empty', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, '', 'manufacturerName', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The endpoint ID "" does not match the expected format.')
  })

  it('throws if the endpoint ID is too long', function () {
    const longString = '0'.repeat(257)
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, longString, 'manufacturerName', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw(`The endpoint ID "${longString}" does not match the expected format.`)
  })

  it('throws if the endpoint ID contains a bad character', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'contains a comma, which is bad', 'manufacturerName', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The endpoint ID "contains a comma, which is bad" does not match the expected format.')
  })

  it('throws if the manufacturer name is empty', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', '', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The manufacturer name cannot be empty.')
  })

  it('throws if the manufacturer name is too long', function () {
    const longString = '0'.repeat(129)
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', longString, 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw(`The manufacturer name "${longString}" is too long.`)
  })

  it('throws if the description is empty', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', '', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The description cannot be empty.')
  })

  it('throws if the description is too long', function () {
    const longString = '0'.repeat(129)
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', longString, 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw(`The description "${longString}" is too long.`)
  })

  it('throws if the friendly name is empty', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', '')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The friendly name "" does not match the expected format.')
  })

  it('throws if the friendly name is too long', function () {
    const longString = '0'.repeat(129)
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', longString)
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw(`The friendly name "${longString}" does not match the expected format.`)
  })

  it('throws if the friendly name contains a bad character', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'contains a comma, which is bad')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The friendly name "contains a comma, which is bad" does not match the expected format.')
  })

  it('throws if no display categories have been specified', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    sut
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('At least one display category is required.')
  })

  it('throws if no capabilities have been specified', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)

    expect(() => sut.getEndpoint()).to.throw('At least one capability is required.')
  })

  it('throws if too many capabilities have been specified', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)

    for (let i = 0; i < 101; i++) {
      sut.addCapability(`capability-${toStringWithLeadingZeros(i, 3)}`, String(i))
    }

    expect(() => sut.getEndpoint()).to.throw('The number of capabilities cannot exceed 100.')
  })

  it('throws if too much cookie data is specified', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryPayloadBuilder)
    const sut = new DiscoveryEndpointBuilder(parentBuilderStub, 'endpointId', 'manufacturerName', 'description', 'friendly name')
    sut
      .withDisplayCategories(DisplayCategories.Other)
      .withCookie('data', '0'.repeat(5000))
      .addCapability('Alexa', '3')

    expect(() => sut.getEndpoint()).to.throw('The cookie cannot be larger than 5000 bytes.')
  })
})



describe('additional attributes builder', function () {
  afterEach(function () {
    sinon.restore()
  })

  describe('creates valid attributes only X is provided', function () {
    it('manufacturer', function () {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const sut = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        manufacturer: 'value',
      }

      const actual = sut
        .withManufacturer('value')
        .getAdditionalAttributes()

      expect(removeUndefinedProps(actual)).to.deep.equal(expectedAttributes)
    })

    it('model', function () {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const sut = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        model: 'value',
      }

      const actual = sut
        .withModel('value')
        .getAdditionalAttributes()

      expect(removeUndefinedProps(actual)).to.deep.equal(expectedAttributes)
    })

    it('serial number', function () {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const sut = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        serialNumber: 'value',
      }

      const actual = sut
        .withSerialNumber('value')
        .getAdditionalAttributes()

      expect(removeUndefinedProps(actual)).to.deep.equal(expectedAttributes)
    })

    it('firmware version', function () {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const sut = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        firmwareVersion: 'value',
      }

      const actual = sut
        .withFirmwareVersion('value')
        .getAdditionalAttributes()

      expect(removeUndefinedProps(actual)).to.deep.equal(expectedAttributes)
    })

    it('software version', function () {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const sut = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        softwareVersion: 'value',
      }

      const actual = sut
        .withSoftwareVersion('value')
        .getAdditionalAttributes()

      expect(removeUndefinedProps(actual)).to.deep.equal(expectedAttributes)
    })

    it('custom identifier', function () {
      const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
      const sut = new AdditionalAttributesBuilder(parentBuilderStub)
      const expectedAttributes = {
        customIdentifier: 'value',
      }

      const actual = sut
        .withCustomIdentifier('value')
        .getAdditionalAttributes()

      expect(removeUndefinedProps(actual)).to.deep.equal(expectedAttributes)
    })
  })

  it('creates undefined if no attributes are specified', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)

    const actual = sut.getAdditionalAttributes()

    expect(actual).to.be.undefined
  })

  it('throws if the manufacturer is too long', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    sut.withManufacturer(longString)

    expect(() => sut.getAdditionalAttributes()).to.throw(`The manufacturer "${longString}" is too long.`)
  })

  it('throws if the model is too long', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    sut.withModel(longString)

    expect(() => sut.getAdditionalAttributes()).to.throw(`The model "${longString}" is too long.`)
  })

  it('throws if the serial number is too long', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    sut.withSerialNumber(longString)

    expect(() => sut.getAdditionalAttributes()).to.throw(`The serial number "${longString}" is too long.`)
  })

  it('throws if the firmware version is too long', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    sut.withFirmwareVersion(longString)

    expect(() => sut.getAdditionalAttributes()).to.throw(`The firmware version "${longString}" is too long.`)
  })

  it('throws if the software version is too long', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    sut.withSoftwareVersion(longString)

    expect(() => sut.getAdditionalAttributes()).to.throw(`The software version "${longString}" is too long.`)
  })

  it('throws if the custom identifier is too long', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new AdditionalAttributesBuilder(parentBuilderStub)
    const longString = '0'.repeat(257)
    sut.withCustomIdentifier(longString)

    expect(() => sut.getAdditionalAttributes()).to.throw(`The custom identifier "${longString}" is too long.`)
  })
})



describe('capability builder', function () {
  afterEach(function () {
    sinon.restore()
  })

  it('creates a capability with verifications', function () {
    const parentBuilderStub = createSinonStubInstance(DiscoveryEndpointBuilder)
    const sut = new CapabilityBuilder(parentBuilderStub, 'interfaceName', 'version')
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

    const actual = sut
      .withVerification('directiveName')
      .getCapability()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedCapability)
  })
})



describe('properties builder', function () {
  afterEach(function () {
    sinon.restore()
  })

  it('creates a properties with names only when no flags are specified', function () {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const sut = new PropertiesBuilder(parentBuilderStub)
    const expectedProperties = {
      supported: [
        {
          name: 'interfaceProperty',
        },
      ],
    }

    const actual = sut
      .withSupportedProperties('interfaceProperty')
      .getProperties()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedProperties)
  })

  it('creates a properties with flags only when no names are specified', function () {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const sut = new PropertiesBuilder(parentBuilderStub)
    const expectedProperties = {
      proactivelyReported: true,
      retrievable: true,
    }

    const actual = sut
      .withProactivelyReported(true)
      .withRetrievable(true)
      .getProperties()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedProperties)
  })
})



describe('semantic action builder', function () {
  afterEach(function () {
    sinon.restore()
  })

  it('creates a mapping when no payload is specified', function () {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const sut = new SemanticActionBuilder(parentBuilderStub, 'directiveName')
    const expectedMapping = {
      '@type': 'ActionsToDirective',
      actions: [SemanticActionNames.Open, SemanticActionNames.Raise],
      directive: { name: 'directiveName', }
    }

    const actual = sut
      .withActions(SemanticActionNames.Open, SemanticActionNames.Raise)
      .getMapping()

    expect(removeUndefinedProps(actual)).to.deep.equal(expectedMapping)
  })

  it('throws if no actions are specified', function () {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const sut = new SemanticActionBuilder(parentBuilderStub, 'directiveName')

    expect(() => sut.getMapping()).to.throw('At least one semantic action must be specified.')
  })
})



describe('semantic state builder', function () {
  afterEach(function () {
    sinon.restore()
  })

  it('throws if no states are specified', function () {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const sut = new SemanticStateBuilder(parentBuilderStub)

    expect(() => sut.getMapping()).to.throw('At least one semantic state must be specified.')
  })

  it('throws if no value or range are specified', function () {
    const parentBuilderStub = createSinonStubInstance(CapabilityBuilder)
    const sut = new SemanticStateBuilder(parentBuilderStub)
      .withStates(SemanticStateNames.Open)

    expect(() => sut.getMapping()).to.throw('Either a value or range must be specified.')
  })
})
