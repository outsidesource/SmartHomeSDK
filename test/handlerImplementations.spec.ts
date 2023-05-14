import { expect } from 'chai'
import 'mocha'
import { AcceptGrantRequestPayload } from '../src/directives/acceptGrant/AcceptGrantRequestPayload'
import { AcceptGrantResponseBuilder } from '../src/directives/acceptGrant/AcceptGrantResponseBuilder'
import { DiscoveryRequestPayload } from '../src/directives/discovery/DiscoveryRequestPayload'
import { DiscoveryResponseBuilder } from '../src/directives/discovery/DiscoveryResponseBuilder'
import { InterfaceCommandResponseBuilder } from '../src/directives/interfaceCommand/InterfaceCommandResponseBuilder'
import { ReportStateResponseBuilder } from '../src/directives/reportState/ReportStateResponseBuilder'
import { DiscoveryPayload } from '../src/discovery/DiscoveryPayload'
import { AcceptGrantRequestHandler } from '../src/dispatcher/request/handler/AcceptGrantRequestHandler'
import { DiscoveryRequestHandler } from '../src/dispatcher/request/handler/DiscoveryRequestHandler'
import { HandlerInput } from '../src/dispatcher/request/handler/HandlerInput'
import { InterfaceCommandRequestHandler } from '../src/dispatcher/request/handler/InterfaceCommandRequestHandler'
import { ReportStateRequestHandler } from '../src/dispatcher/request/handler/ReportStateRequestHandler'
import { SmartHomeSkillRequestHandler } from '../src/dispatcher/request/handler/SmartHomeSkillRequestHandler'
import { ErrorTypes } from '../src/response/ErrorTypes'
import { Response } from '../src/response/Response'
import { ResponseBuilder } from '../src/response/ResponseBuilder'
import { EmptyResponsePayload } from '../src/response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../src/response/payloads/ErrorResponsePayload'

describe('handler implementations', function () {
  it('accept grant', function () {
    expect(() => new AcceptGrantHandler(true)).to.not.throw()
    expect(() => new AcceptGrantHandler(false)).to.not.throw()
  })

  it('discovery', function () {
    expect(() => new DiscoveryHandler(true)).to.not.throw()
    expect(() => new DiscoveryHandler(false)).to.not.throw()
  })

  it('interface command', function () {
    expect(() => new InterfaceCommandHandler(true)).to.not.throw()
    expect(() => new InterfaceCommandHandler(false)).to.not.throw()
  })

  it('report state', function () {
    expect(() => new ReportStateHandler(true)).to.not.throw()
    expect(() => new ReportStateHandler(false)).to.not.throw()
  })

  it('generic smart home request handler', function () {
    expect(() => new GenericHandler(true)).to.not.throw()
    expect(() => new GenericHandler(false)).to.not.throw()
  })
})

class AcceptGrantHandler extends AcceptGrantRequestHandler {
  constructor(private succeed: boolean) {
    super()
  }

  handle(input: HandlerInput<AcceptGrantRequestPayload, AcceptGrantResponseBuilder>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>> {
    const requestClassName = input.request.constructor.name

    if (!this.succeed) {
      return input.responseBuilder.getFailResponse(ErrorTypes.InternalError, 'This is a test failure')
    }

    return input.responseBuilder.getSucceedResponse()
  }
}

class DiscoveryHandler extends DiscoveryRequestHandler {
  constructor(private succeed: boolean) {
    super()
  }

  handle(input: HandlerInput<DiscoveryRequestPayload, DiscoveryResponseBuilder>): Response<DiscoveryPayload | ErrorResponsePayload> | Promise<Response<DiscoveryPayload | ErrorResponsePayload>> {
    const requestClassName = input.request.constructor.name

    if (!this.succeed) {
      return input.responseBuilder.getFailResponse(ErrorTypes.InternalError, 'This is a test failure')
    }

    return input.responseBuilder.getSucceedResponse()
  }
}

class InterfaceCommandHandler extends InterfaceCommandRequestHandler {
  constructor(private succeed: boolean) {
    super()
  }

  handle(input: HandlerInput<unknown, InterfaceCommandResponseBuilder>): Response<unknown | ErrorResponsePayload> | Promise<Response<unknown | ErrorResponsePayload>> {
    const requestClassName = input.request.constructor.name

    if (!this.succeed) {
      return input.responseBuilder.getFailResponse(ErrorTypes.InternalError, 'This is a test failure')
    }

    return input.responseBuilder.getSucceedResponse()
  }
}

class ReportStateHandler extends ReportStateRequestHandler {
  constructor(private succeed: boolean) {
    super()
  }

  handle(input: HandlerInput<unknown, ReportStateResponseBuilder>): Response<EmptyResponsePayload | ErrorResponsePayload> | Promise<Response<EmptyResponsePayload | ErrorResponsePayload>> {
    const requestClassName = input.request.constructor.name

    if (!this.succeed) {
      return input.responseBuilder.getFailResponse(ErrorTypes.InternalError, 'This is a test failure')
    }

    return input.responseBuilder.getSucceedResponse()
  }
}

class GenericHandler extends SmartHomeSkillRequestHandler {
  constructor(private succeed: boolean) {
    super()
  }

  canHandle(input: HandlerInput<unknown, ResponseBuilder>): boolean | Promise<boolean> {
    return true
  }
  handle(input: HandlerInput<unknown, ResponseBuilder>): Response<unknown | ErrorResponsePayload> | Promise<Response<unknown | ErrorResponsePayload>> {
    const requestClassName = input.request.constructor.name

    if (!this.succeed) {
      return input.responseBuilder.getFailResponse(ErrorTypes.InternalError, 'This is a test failure')
    }

    return input.responseBuilder.getSucceedResponse()
  }
}
