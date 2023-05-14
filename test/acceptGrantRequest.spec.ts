import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isAcceptGrantRequest } from '../src/directives/acceptGrant/AcceptGrantHandlerInputFactory'
import { AcceptGrantRequestPayload } from '../src/directives/acceptGrant/AcceptGrantRequestPayload'
import { Request } from '../src/dispatcher/request/handler/Request'

const request: Request<AcceptGrantRequestPayload> = require('./fixtures/acceptGrantRequest.json')

describe('accept grant request', function () {
  it('identifies the payload when header is correct', function () {
    const actual = isAcceptGrantRequest(request)

    expect(actual).to.be.true
  })

  it('does not identify the payload when namespace is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    const actual = isAcceptGrantRequest(req)

    expect(actual).to.be.false
  })

  it('does not identify the payload when name is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    const actual = isAcceptGrantRequest(req)

    expect(actual).to.be.false
  })

  it('does not identify the payload when payloadVersion is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    const actual = isAcceptGrantRequest(req)

    expect(actual).to.be.false
  })
})
