import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { Request } from '../../src/outboundRequest/types'
import { DeleteReportRequestBuilder } from '../../src/reports/delete/requestBuilder'
import { DeleteReportPayload } from '../../src/reports/delete/types'
import { removeUndefinedProps } from '../helpers'

const request: Request<DeleteReportPayload> = require('../fixtures/deleteReportRequest.json')

describe('delete report', function () {
  describe('request builder', function () {
    it('returns a request when given an endpoint id and simple token', function () {
      const sut = new DeleteReportRequestBuilder()
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.addEndpointId('WC:e889552c8a25')
      sut.addEndpointId('WC:e889552c8a25 Z:0')
      sut.addEndpointId('WC:e889552c8a25 Z:1')
      sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(request)
    })

    it('returns a request when given an partitioned token', function () {
      const req = _.cloneDeep(request)
      req.event.payload.scope = {
        type: 'BearerTokenWithPartition' as const,
        token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
        partition: 'Partition',
        userId: 'UserId'
      }
      const sut = new DeleteReportRequestBuilder()
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.addEndpointId('WC:e889552c8a25')
      sut.addEndpointId('WC:e889552c8a25 Z:0')
      sut.addEndpointId('WC:e889552c8a25 Z:1')
      sut.withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(req)
    })

    it('throws when no token is present', function () {
      const sut = new DeleteReportRequestBuilder()
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.addEndpointId('WC:e889552c8a25')

      expect(() => sut.getRequestBody()).to.throw('A token is required.')
    })

    it('throws when no endpoints have been added', function () {
      const sut = new DeleteReportRequestBuilder()

      expect(() => sut.getRequestBody()).to.throw('At least one endpoint is required.')
    })

    it('throws when duplicate endpoints have been added', function () {
      const sut = new DeleteReportRequestBuilder()
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
      sut.addEndpointId('WC:e889552c8a25')
      sut.addEndpointId('WC:e889552c8a25')
      sut.addEndpointId('WC:e889552c8a25 Z:0')

      expect(() => sut.getRequestBody()).to.throw('Duplicate endpoint ids found for the following: ["WC:e889552c8a25"]')
    })
  })
})
