import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isAcceptGrantRequest } from '../../lib/smarthome-sdk/directives/acceptGrant/AcceptGrantHandlerInputFactory'
import request from './fixtures/acceptGrantRequest.json'

describe('accept grant request', function() {
  it('identifies the payload when header is correct', function() {
    const req = _.cloneDeep(request)

    expect(isAcceptGrantRequest(req)).to.equal(true)
  })
  it('does not identify the payload when namespace is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    expect(isAcceptGrantRequest(req)).to.equal(false)
  })
  it('does not identify the payload when name is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    expect(isAcceptGrantRequest(req)).to.equal(false)
  })
  it('does not identify the payload when payloadVersion is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    expect(isAcceptGrantRequest(req)).to.equal(false)
  })
})
