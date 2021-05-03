import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isAcceptGrant } from '../../../lib/smarthome-sdk/dispatcher/request/handler/payloads/AcceptGrantRequestPayload'
import request from '../fixtures/acceptGrantRequest.json'

describe('accept grant request', function() {
  it('identifies the payload when header is correct', function() {
    const req = _.cloneDeep(request)

    expect(isAcceptGrant(req)).to.equal(true)
  })
  it('does not identify the payload when namespace is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    expect(isAcceptGrant(req)).to.equal(false)
  })
  it('does not identify the payload when name is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    expect(isAcceptGrant(req)).to.equal(false)
  })
  it('does not identify the payload when payloadVersion is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    expect(isAcceptGrant(req)).to.equal(false)
  })
})
