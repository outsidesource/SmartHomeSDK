import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isReportStateRequest } from '../../lib/smarthome-sdk/directives/reportState/ReportStateHandlerInputFactory'
import { Request, RequestPayload } from '../../lib/smarthome-sdk/dispatcher/request/handler/Request'

const request: Request<RequestPayload> = require('./fixtures/reportStateRequest.json')

describe('report state request', function() {
  it('identifies the payload when header is correct and endpoint is present', function() {
    const req = _.cloneDeep(request)

    expect(isReportStateRequest(req)).to.equal(true)
  })
  it('does not identify the payload when namespace is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    expect(isReportStateRequest(req)).to.equal(false)
  })
  it('does not identify the payload when name is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    expect(isReportStateRequest(req)).to.equal(false)
  })
  it('does not identify the payload when payloadVersion is incorrect', function() {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    expect(isReportStateRequest(req)).to.equal(false)
  })
  it('does not identify the payload if endpoint is not present', function() {
    const req = _.cloneDeep(request)
    if (req.directive?.endpoint?.endpointId) {
      delete req.directive.endpoint.endpointId
    }

    expect(isReportStateRequest(req)).to.equal(false)
  })
})
