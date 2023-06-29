import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { DeferredFollowUpRequestBuilder } from '../../src/requests/deferredFollowUp/requestBuilder'
import { EmptyRequestPayload, Request } from '../../src/requests/types'
import { removeUndefinedProps } from '../helpers'

const request: Request<EmptyRequestPayload> = require('../fixtures/deferredFollowUpRequest.json')

describe('deferred follow up', function () {
  afterEach(function () {
    sinon.restore()
  })



  describe('request builder', function () {
    it('returns a request when messageId, endpointId, and correlation token are specified', function () {
      const sut = new DeferredFollowUpRequestBuilder('endpointId', 'VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
      sut.addContext()
        .withProperty('Alexa.LockController', undefined, 'lockState', 'LOCKED', new Date('2017-02-03T16:20:50Z'), 1000)

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(request)
    })

    it('returns a partitioned token request when messageId, endpointId, and correlation token are specified', function () {
      const sut = new DeferredFollowUpRequestBuilder('endpointId', 'VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')
      sut.addContext()
        .withProperty('Alexa.LockController', undefined, 'lockState', 'LOCKED', new Date('2017-02-03T16:20:50Z'), 1000)
      const expected = _.cloneDeep(request)
      expected.event.endpoint!.scope = {
        type: 'BearerTokenWithPartition',
        token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
        partition: 'Partition',
        userId: 'UserId',
      }

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(expected)
    })

    it('throws an exception when no properties are specified', function () {
      const sut = new DeferredFollowUpRequestBuilder('endpointId', 'VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')

      expect(() => sut.getRequestBody()).to.throw('At least one property must be reported.')
    })

    it('throws an exception when duplicate changed properties are added', function () {
      const sut = new DeferredFollowUpRequestBuilder('endpointId', 'VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
      sut.addContext()
        .withProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)

      expect(() => sut.getRequestBody()).to.throw('The following properties are duplicated: {\"namespace\":\"Alexa.BrightnessController\",\"name\":\"brightness\"}')
    })

    it('returns the context when addContext() is invoked multiple times', function () {
      const sut = new DeferredFollowUpRequestBuilder('endpointId', 'VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')

      const actual1 = sut.addContext()
      const actual2 = sut.addContext()

      expect(actual1).to.equal(actual2)
    })
  })
})
