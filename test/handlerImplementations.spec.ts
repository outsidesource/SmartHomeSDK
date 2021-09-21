import { expect } from 'chai'
import 'mocha'
import { AcceptGrantRequestPayload } from '../src/directives/acceptGrant/AcceptGrantRequestPayload'
import { AcceptGrantResponseBuilder } from '../src/directives/acceptGrant/AcceptGrantResponseBuilder'
import { DiscoveryRequestPayload } from '../src/directives/discovery/DiscoveryRequestPayload'
import { DiscoveryResponseBuilder } from '../src/directives/discovery/DiscoveryResponseBuilder'
import { DiscoveryPayload } from '../src/directives/discovery/factory/DiscoveryPayload'
import { InterfaceCommandResponseBuilder } from '../src/directives/interfaceCommand/InterfaceCommandResponseBuilder'
import { ReportStateResponseBuilder } from '../src/directives/reportState/ReportStateResponseBuilder'
import { AcceptGrantRequestHandler } from '../src/dispatcher/request/handler/AcceptGrantRequestHandler'
import { DiscoveryRequestHandler } from '../src/dispatcher/request/handler/DiscoveryRequestHandler'
import { HandlerInput } from '../src/dispatcher/request/handler/HandlerInput'
import { InterfaceCommandRequestHandler } from '../src/dispatcher/request/handler/InterfaceCommandRequestHandler'
import { ReportStateRequestHandler } from '../src/dispatcher/request/handler/ReportStateRequestHandler'
import { SmartHomeSkillRequestHandler } from '../src/dispatcher/request/handler/SmartHomeSkillRequestHandler'
import { EmptyResponsePayload } from '../src/response/payloads/EmptyResponsePayload'
import { Response } from '../src/response/Response'
import { ResponseBuilder } from '../src/response/ResponseBuilder'

describe('handler implementations', function() {
  it('accept grant', function() {
    expect(function() { new AcceptGrantHandler() }).to.not.throw()
  })

  it('discovery', function() {
    expect(function() { new DiscoveryHandler() }).to.not.throw()
  })

  it('interface command', function() {
    expect(function() { new InterfaceCommandHandler() }).to.not.throw()
  })

  it('report state', function() {
    expect(function() { new ReportStateHandler() }).to.not.throw()
  })

  it('generic smart home request handler', function() {
    expect(function() { new GenericHandler() }).to.not.throw()
  })
})

class AcceptGrantHandler extends AcceptGrantRequestHandler {
  handle(input: HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>): Response<EmptyResponsePayload> | Promise<Response<EmptyResponsePayload>> {
    const requestClassName = input.request.constructor.name
    return input.responseBuilder.getSucceedResponse()
  }
}

class DiscoveryHandler extends DiscoveryRequestHandler {
  handle(input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>): Response<DiscoveryPayload> | Promise<Response<DiscoveryPayload>> {
    const requestClassName = input.request.constructor.name
    return input.responseBuilder.getSucceedResponse()
  }
}

class InterfaceCommandHandler extends InterfaceCommandRequestHandler {
  handle(input: HandlerInput<unknown, InterfaceCommandResponseBuilder>): Response<unknown> | Promise<Response<unknown>> {
    const requestClassName = input.request.constructor.name
    return input.responseBuilder.getSucceedResponse()
  }
}

class ReportStateHandler extends ReportStateRequestHandler {
  handle(input: HandlerInput<unknown, ReportStateResponseBuilder>): Response<EmptyResponsePayload> | Promise<Response<EmptyResponsePayload>> {
    const requestClassName = input.request.constructor.name
    return input.responseBuilder.getSucceedResponse()
  }
}

class GenericHandler extends SmartHomeSkillRequestHandler {
  canHandle(input: HandlerInput<unknown, ResponseBuilder>): boolean | Promise<boolean> {
    return true
  }
  handle(input: HandlerInput<unknown, ResponseBuilder>): Response<unknown> | Promise<Response<unknown>> {
    const requestClassName = input.request.constructor.name
    return input.responseBuilder.getSucceedResponse()
  }
}
