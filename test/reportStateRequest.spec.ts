import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { isReportStateRequest } from '../src/directives/reportState/ReportStateHandlerInputFactory'
import { Request } from '../src/dispatcher/request/handler/Request'

const request: Request<unknown> = require('./fixtures/reportStateRequest.json')

describe('report state request', function () {
  it('identifies the payload when header is correct and endpoint is present', function () {
    const actual = isReportStateRequest(request)

    expect(actual).to.equal(true)
  })

  it('does not identify the payload when namespace is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.namespace = 'faux'

    const actual = isReportStateRequest(req)

    expect(actual).to.equal(false)
  })

  it('does not identify the payload when name is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.name = 'faux'

    const actual = isReportStateRequest(req)

    expect(actual).to.equal(false)
  })

  it('does not identify the payload when payloadVersion is incorrect', function () {
    const req = _.cloneDeep(request)
    req.directive.header.payloadVersion = '0'

    const actual = isReportStateRequest(req)

    expect(actual).to.equal(false)
  })

  it('does not identify the payload if endpoint is not present', function () {
    const req = _.cloneDeep(request)
    if (req.directive?.endpoint?.endpointId !== undefined) {
      delete req.directive.endpoint
    }

    const actual = isReportStateRequest(req)

    expect(actual).to.equal(false)
  })
})
