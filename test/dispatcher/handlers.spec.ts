import { expect } from 'chai'
import 'mocha'
import { AcceptGrantResponseBuilder } from '../../src/directives/acceptGrant/responseBuilder'
import { AcceptGrantRequestPayload } from '../../src/directives/acceptGrant/types'
import { DiscoveryResponseBuilder } from '../../src/directives/discovery/responseBuilder'
import { DiscoveryRequestPayload } from '../../src/directives/discovery/types'
import { InterfaceCommandResponseBuilder } from '../../src/directives/interfaceCommand/responseBuilder'
import { ReportStateResponseBuilder } from '../../src/directives/reportState/responseBuilder'
import { DiscoveryPayload } from '../../src/discovery/payload'
import { AcceptGrantRequestHandler } from '../../src/dispatcher/request/handler/acceptGrantRequestHandler'
import { DiscoveryRequestHandler } from '../../src/dispatcher/request/handler/discoveryRequestHandler'
import { InterfaceCommandRequestHandler } from '../../src/dispatcher/request/handler/interfaceCommandRequestHandler'
import { ReportStateRequestHandler } from '../../src/dispatcher/request/handler/reportStateRequestHandler'
import { HandlerInput, Request } from '../../src/dispatcher/request/handler/types'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../src/responses/payloads/types'
import { Response } from '../../src/responses/types'
import { FauxAttributesManager, getLambdaContext } from '../fixtures'

const context = getLambdaContext()

describe('abstract handlers', function () {
  describe('accept grant', function () {
    it('falls back to the base canHandle() implementation', function () {
      const request: Request<AcceptGrantRequestPayload> = require('../fixtures/acceptGrantRequest.json')
      const sut = new AcceptGrantHandler()

      const actual = sut.canHandle({ request, context, attributesManager: new FauxAttributesManager(), responseBuilder: new AcceptGrantResponseBuilder(request) })

      expect(actual).to.be.true
    })
  })



  describe('discovery', function () {
    it('falls back to the base canHandle() implementation', function () {
      const request: Request<DiscoveryRequestPayload> = require('../fixtures/discoveryRequest.json')
      const sut = new DiscoveryHandler()

      const actual = sut.canHandle({ request, context, attributesManager: new FauxAttributesManager(), responseBuilder: new DiscoveryResponseBuilder(request) })

      expect(actual).to.be.true
    })
  })



  describe('interface command', function () {
    it('falls back to the base canHandle() implementation', function () {
      const request: Request<unknown> = require('../fixtures/interfaceCommandRequest.json')
      const sut = new InterfaceCommandHandler()

      const actual = sut.canHandle({ request, context, attributesManager: new FauxAttributesManager(), responseBuilder: new InterfaceCommandResponseBuilder(request) })

      expect(actual).to.be.true
    })
  })



  describe('report state', function () {
    it('falls back to the base canHandle() implementation', function () {
      const request: Request<unknown> = require('../fixtures/reportStateRequest.json')
      const sut = new ReportStateHandler()

      const actual = sut.canHandle({ request, context, attributesManager: new FauxAttributesManager(), responseBuilder: new ReportStateResponseBuilder(request) })

      expect(actual).to.be.true
    })
  })
})

class AcceptGrantHandler extends AcceptGrantRequestHandler {
  handle(input: HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder, EmptyResponsePayload>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>> {
    return input.responseBuilder.getSucceedResponse()
  }
}

class DiscoveryHandler extends DiscoveryRequestHandler {
  handle(input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder, DiscoveryPayload>): Response<DiscoveryPayload | ErrorResponsePayload> | Promise<Response<DiscoveryPayload | ErrorResponsePayload>> {
    return input.responseBuilder.getSucceedResponse()
  }
}

class InterfaceCommandHandler extends InterfaceCommandRequestHandler {
  handle(input: HandlerInput<unknown, InterfaceCommandResponseBuilder, unknown>): Response<unknown | ErrorResponsePayload> | Promise<Response<unknown | ErrorResponsePayload>> {
    return input.responseBuilder.getSucceedResponse()
  }
}

class ReportStateHandler extends ReportStateRequestHandler {
  handle(input: HandlerInput<unknown, ReportStateResponseBuilder, unknown>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>> {
    return input.responseBuilder.getSucceedResponse()
  }
}
