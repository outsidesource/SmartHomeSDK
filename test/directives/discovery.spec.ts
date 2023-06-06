import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { DiscoveryHandlerInputFactory, isDiscoveryRequest } from '../../src/directives/discovery/handlerInputFactory'
import { DiscoveryResponseBuilder } from '../../src/directives/discovery/responseBuilder'
import { DiscoveryRequestPayload } from '../../src/directives/discovery/types'
import { DiscoveryPayload, DisplayCategories, SemanticActionNames, SemanticStateNames } from '../../src/discovery/payload'
import { Locales } from '../../src/discovery/resourceLabel'
import { Request } from '../../src/dispatcher/request/handler/types'
import { ErrorTypes } from '../../src/response/errorTypes'
import { ErrorResponsePayload } from '../../src/response/payloads/types'
import { Response } from '../../src/response/types'
import { getLambdaContext, } from '../fixtures'
import { removeUndefinedProps } from '../helpers'

const request: Request<DiscoveryRequestPayload> = require('../fixtures/discoveryRequest.json')
const context = getLambdaContext()
const succeedResponse: Response<DiscoveryPayload> = require('../fixtures/discoveryResponse.json')
const failResponse: Response<ErrorResponsePayload> = require('../fixtures/errorResponse.json')

describe('discovery', function () {
  describe('request type guard', function () {
    it('returns true when the header is correct', function () {
      const actual = isDiscoveryRequest(request)

      expect(actual).to.be.true
    })

    it('returns false when the namespace is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.namespace = 'faux'

      const actual = isDiscoveryRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the name is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.name = 'faux'

      const actual = isDiscoveryRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the payloadVersion is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.payloadVersion = '0'

      const actual = isDiscoveryRequest(req)

      expect(actual).to.be.false
    })
  })



  describe('handler input factory', function () {
    const sut = DiscoveryHandlerInputFactory

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
        expect(actual?.responseBuilder).to.be.an.instanceOf(DiscoveryResponseBuilder)
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
      const sut = new DiscoveryResponseBuilder(request)
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

      const actual = sut.getSucceedResponse()

      expect(removeUndefinedProps(actual)).to.deep.equal(succeedResponse)
    })

    it('returns an error response for a failed request', function () {
      const sut = new DiscoveryResponseBuilder(request)

      const actual = sut.getFailResponse(ErrorTypes.InternalError, 'This is a test error')

      expect(actual).to.deep.equal(failResponse)
    })
  })
})
