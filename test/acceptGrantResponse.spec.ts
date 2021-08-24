import { expect } from 'chai'
import 'mocha'
import { AcceptGrantErrorTypes } from '../src/directives/acceptGrant/AcceptGrantErrorTypes'
import { AcceptGrantResponseBuilder } from '../src/directives/acceptGrant/AcceptGrantResponseBuilder'
import failResponse from './fixtures/acceptGrantError.json'
import request from './fixtures/acceptGrantRequest.json'
import succeedResponse from './fixtures/acceptGrantResponse.json'

describe('accept grant response builder', function() {
  it('creates a successful response for a successful request', function() {
    const builder = new AcceptGrantResponseBuilder(request)
    const response = builder
      .getSucceedResponse()

    expect(response).to.deep.equal(succeedResponse)
  })
  it('creates an error response for a failed request', function() {
    const builder = new AcceptGrantResponseBuilder(request)
    const response = builder
      .getFailResponse(AcceptGrantErrorTypes.AcceptGrantFailed, 'This is a test error')

    expect(response).to.deep.equal(failResponse)
  })
})
