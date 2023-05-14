import { expect } from 'chai'
import 'mocha'
import { AcceptGrantErrorTypes } from '../src/directives/acceptGrant/AcceptGrantErrorTypes'
import { AcceptGrantRequestPayload } from '../src/directives/acceptGrant/AcceptGrantRequestPayload'
import { AcceptGrantResponseBuilder } from '../src/directives/acceptGrant/AcceptGrantResponseBuilder'
import { Request } from '../src/dispatcher/request/handler/Request'
import { Response } from '../src/response/Response'
import { EmptyResponsePayload } from '../src/response/payloads/EmptyResponsePayload'
import { ErrorResponsePayload } from '../src/response/payloads/ErrorResponsePayload'

const request: Request<AcceptGrantRequestPayload> = require('./fixtures/acceptGrantRequest.json')
const failResponse: Response<ErrorResponsePayload> = require('./fixtures/acceptGrantError.json')
const succeedResponse: Response<EmptyResponsePayload> = require('./fixtures/acceptGrantResponse.json')

describe('accept grant response builder', function () {
  it('creates a successful response for a successful request', function () {
    const sut = new AcceptGrantResponseBuilder(request)

    const actual = sut.getSucceedResponse()

    expect(actual).to.deep.equal(succeedResponse)
  })

  it('creates an error response for a failed request', function () {
    const sut = new AcceptGrantResponseBuilder(request)

    const actual = sut.getFailResponse(AcceptGrantErrorTypes.AcceptGrantFailed, 'This is a test error')

    expect(actual).to.deep.equal(failResponse)
  })
})
