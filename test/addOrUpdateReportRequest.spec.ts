import { expect } from 'chai'
import 'mocha'
import { AddOrUpdateReportRequestBuilder } from '../src/addOrUpdateReport/AddOrUpdateReportRequestBuilder'
import { DiscoveryPayload, DisplayCategories, SemanticActionNames, SemanticStateNames } from '../src/discovery/DiscoveryPayload'
import { Locales } from '../src/discovery/ResourceLabel'
import { Request } from '../src/outboundRequest/Request'

const request: Request<DiscoveryPayload> = require('./fixtures/addOrUpdateReportRequest.json')

describe('add or update report request builder', function() {
  it('creates a successful request when messageId and discovery details specified', function() {
    const builder = new AddOrUpdateReportRequestBuilder()
    builder.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
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

    const requestBody = builder.getRequestBody()

    expect(requestBody).to.deep.equal(request)
  })
  it('throws when no endpoints are present', function() {
    const builder = new AddOrUpdateReportRequestBuilder()

    expect(function(){ builder.getRequestBody() }).to.throw('At least one endpoint is required.')
  })
})
