import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { DisplayCategories, SemanticActionNames, SemanticStateNames } from '../../src/discovery/payload'
import { Locales } from '../../src/discovery/resourceLabel'
import { Request } from '../../src/outboundRequest/types'
import { AddOrUpdateReportRequestBuilder } from '../../src/reports/addOrUpdate/requestBuilder'
import { AddOrUpdateReportPayload } from '../../src/reports/addOrUpdate/types'
import { removeUndefinedProps } from '../helpers'

const filledRequest: Request<AddOrUpdateReportPayload> = require('../fixtures/addOrUpdateReportRequest.json')
const emptyRequest: Request<AddOrUpdateReportPayload> = require('../fixtures/addOrUpdateReportEmptyRequest.json')

describe('add or update report', function () {
  describe('request builder', function () {
    describe('when adding or updating devices', function () {
      it('returns a successful request when messageId, discovery details, and token specified', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
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
        sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

        const actual = sut.getRequestBody()

        expect(removeUndefinedProps(actual)).to.deep.equal(filledRequest)
      })

      it('returns a successful request with a partitioned token', function () {
        const req = _.cloneDeep(filledRequest)
        req.event.payload.scope = {
          type: 'BearerTokenWithPartition' as const,
          token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
          partition: 'Partition',
          userId: 'UserId'
        }
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
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
        sut.withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')

        const actual = sut.getRequestBody()

        expect(removeUndefinedProps(actual)).to.deep.equal(req)
      })

      it('throws when no token is present', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        sut.addDiscoveryEndpoint('endpointId0', 'manufacturerName', 'description', 'friendly name 0')
          .withDisplayCategories(DisplayCategories.Other)
          .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower, SemanticActionNames.Close).getCapabilityBuilder().getEndpointBuilder()

        expect(() => sut.getRequestBody()).to.throw('A token is required.')
      })

      it('throws when adding or updating but no endpoints are present', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

        expect(() => sut.getRequestBody()).to.throw('At least one endpoint is required.')
      })

      it('throws when duplicate endpoints have been added', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        sut.addDiscoveryEndpoint('WC:e889552c8a25', 'Sample Manufacturer', 'Smart Thermostat by Sample Manufacturer', 'My Home')
          .withDisplayCategories(DisplayCategories.Thermostat)
          .addCapability('Alexa', '3').getEndpointBuilder()
        sut.addDiscoveryEndpoint('WC:e889552c8a25', 'Sample Manufacturer', 'Smart Thermostat by Sample Manufacturer', 'My Home')
          .withDisplayCategories(DisplayCategories.Thermostat)
          .addCapability('Alexa', '3').getEndpointBuilder()

        expect(() => sut.getRequestBody()).to.throw('Duplicate endpoint ids found for the following: ["WC:e889552c8a25"]')
      })
    })



    describe('when there are no devices', function () {
      it('returns a successful request when messageId and token specified', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

        const actual = sut.getNoEndpointsRequestBody()

        expect(actual).to.deep.equal(emptyRequest)
      })

      it('returns a successful request when an irrelevant endpoint is specified', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
        sut.addDiscoveryEndpoint('endpointId0', 'manufacturerName', 'description', 'friendly name 0')
          .withDisplayCategories(DisplayCategories.Other)
          .addCapability('capabilityName', '3').withInstance('instanceName').addSemanticAction('directiveName').withActions(SemanticActionNames.Lower, SemanticActionNames.Close).getCapabilityBuilder().getEndpointBuilder()
        sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

        const actual = sut.getNoEndpointsRequestBody()

        expect(actual).to.deep.equal(emptyRequest)
      })

      it('throws when no token is present', function () {
        const sut = new AddOrUpdateReportRequestBuilder()
        sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')

        expect(() => sut.getNoEndpointsRequestBody()).to.throw('A token is required.')
      })
    })
  })
})
