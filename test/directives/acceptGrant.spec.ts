import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { AcceptGrantHandlerInputFactory, isAcceptGrantRequest } from '../../src/directives/acceptGrant/handlerInputFactory'
import { AcceptGrantResponseBuilder } from '../../src/directives/acceptGrant/responseBuilder'
import { AcceptGrantErrorTypes, AcceptGrantRequestPayload } from '../../src/directives/acceptGrant/types'
import { Request } from '../../src/dispatcher/request/handler/types'
import { EmptyResponsePayload, ErrorResponsePayload } from '../../src/response/payloads/types'
import { Response } from '../../src/response/types'
import { getLambdaContext, } from '../fixtures'
import { removeUndefinedProps } from '../helpers'

const request: Request<AcceptGrantRequestPayload> = require('../fixtures/acceptGrantRequest.json')
const context = getLambdaContext()
const succeedResponse: Response<EmptyResponsePayload> = require('../fixtures/acceptGrantResponse.json')
const failResponse: Response<ErrorResponsePayload> = require('../fixtures/acceptGrantError.json')

describe('accept grant', function () {
  describe('request type guard', function () {
    it('returns true when the header is correct', function () {
      const actual = isAcceptGrantRequest(request)

      expect(actual).to.be.true
    })

    it('returns false when the namespace is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.namespace = 'faux'

      const actual = isAcceptGrantRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the name is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.name = 'faux'

      const actual = isAcceptGrantRequest(req)

      expect(actual).to.be.false
    })

    it('returns false when the payloadVersion is incorrect', function () {
      const req = _.cloneDeep(request)
      req.directive.header.payloadVersion = '0'

      const actual = isAcceptGrantRequest(req)

      expect(actual).to.be.false
    })
  })



  describe('handler input factory', function () {
    const sut = AcceptGrantHandlerInputFactory

    describe('canCreate()', function () {
      it('returns true when the request can be handled', function () {
        const actual = sut.canCreate(request, context)

        expect(actual).to.be.true
      })

      it('returns false when the request cannot be handled', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'

        const actual = sut.canCreate(req, context)

        expect(actual).to.be.false
      })
    })



    describe('create()', function () {
      it('returns a handler input when the request can be handled', function () {
        const actual = sut.create(request, context)

        expect(actual?.request).to.equal(request)
        expect(actual?.context).to.equal(context)
        expect(actual?.responseBuilder).to.be.an.instanceOf(AcceptGrantResponseBuilder)
      })

      it('returns undefined when the request cannot be handled', function () {
        const req = _.cloneDeep(request)
        req.directive.header.namespace = 'faux'

        const actual = sut.create(req, context)

        expect(actual).to.be.undefined
      })
    })
  })



  describe('response builder', function () {
    it('returns a successful response for a successful request', function () {
      const sut = new AcceptGrantResponseBuilder(request)

      const actual = sut.getSucceedResponse()

      expect(removeUndefinedProps(actual)).to.deep.equal(succeedResponse)
    })

    it('returns an error response for a failed request', function () {
      const sut = new AcceptGrantResponseBuilder(request)

      const actual = sut.getFailResponse(AcceptGrantErrorTypes.AcceptGrantFailed, 'This is a test error')

      expect(removeUndefinedProps(actual)).to.deep.equal(failResponse)
    })
  })
})
