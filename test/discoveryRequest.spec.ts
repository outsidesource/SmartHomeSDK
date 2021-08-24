import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isDiscoveryRequest } from '../src/directives/discovery/DiscoveryHandlerInputFactory'
import request from './fixtures/discoveryRequest.json'

describe('discovery request', function() {
  it('identifies the payload when header is correct', function() {
    const req = _.cloneDeep(request)

    expect(isDiscoveryRequest(req)).to.equal(true)
  })
  it('does not identify the payload when namespace is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    expect(isDiscoveryRequest(req)).to.equal(false)
  })
  it('does not identify the payload when name is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    expect(isDiscoveryRequest(req)).to.equal(false)
  })
  it('does not identify the payload when payloadVersion is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    expect(isDiscoveryRequest(req)).to.equal(false)
  })
})
