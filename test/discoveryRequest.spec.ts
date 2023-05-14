import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isDiscoveryRequest } from '../src/directives/discovery/DiscoveryHandlerInputFactory'
import { DiscoveryRequestPayload } from '../src/directives/discovery/DiscoveryRequestPayload'
import { Request } from '../src/dispatcher/request/handler/Request'

const request: Request<DiscoveryRequestPayload> = require('./fixtures/discoveryRequest.json')

describe('discovery request', function () {
  it('identifies the payload when header is correct', function () {
    const actual = isDiscoveryRequest(request)

    expect(actual).to.equal(true)
  })

  it('does not identify the payload when namespace is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    const actual = isDiscoveryRequest(req)

    expect(actual).to.equal(false)
  })

  it('does not identify the payload when name is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    const actual = isDiscoveryRequest(req)

    expect(actual).to.equal(false)
  })

  it('does not identify the payload when payloadVersion is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    const actual = isDiscoveryRequest(req)

    expect(actual).to.equal(false)
  })
})
