import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { ContextBuilder, EndpointBuilder, SmartHomeSkillRequestBuilder } from '../../src/requests/baseRequestBuilder'
import { EmptyRequestPayload, Request } from '../../src/requests/types'
import { removeUndefinedProps } from '../helpers'

const request: Request<{}> = {
  event: {
    header: {
      namespace: 'namespace',
      name: 'name',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20'
    },
    payload: {}
  }
}



describe('base request builders', function () {
  describe('request builder', function () {
    it('returns a request without a correlation token when not given a correlation token', function () {
      const sut = new GenericRequestBuilder()
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(request)
    })

    it('returns a request with a correlation token when given a correlation token', function () {
      const sut = new GenericRequestBuilder()
      sut.withMessageId('4b409868-dc4b-ce7f-5ec9-0d6410e74f20')
      sut.withCorrelationToken('VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu')
      const expected = _.cloneDeep(request)
      expected.event.header.correlationToken = 'VGhpcyBpcyBhIGNvcnJlbGF0aW9uIHRva2Vu'

      const actual = sut.getRequestBody()

      expect(removeUndefinedProps(actual)).to.deep.equal(expected)
    })
  })



  describe('endpoint builder', function () {
    it('returns undefined when given no endpoint id', function () {
      const parentBuilder = new GenericRequestBuilder()
      const sut = new EndpointBuilder<GenericRequestBuilder, EmptyRequestPayload>(parentBuilder)

      const actual = sut.getEndpoint()

      expect(actual).to.be.undefined
    })

    it('returns the parent builder when invoked', function () {
      const parentBuilder = new GenericRequestBuilder()
      const sut = new EndpointBuilder<GenericRequestBuilder, EmptyRequestPayload>(parentBuilder)

      const actual = sut.getRequestBuilder()

      expect(actual).to.equal(parentBuilder)
    })
  })



  describe('context builder', function () {
    it('returns the parent builder when invoked', function () {
      const parentBuilder = new GenericRequestBuilder()
      const sut = new ContextBuilder<GenericRequestBuilder, EmptyRequestPayload>(parentBuilder)

      const actual = sut.getRequestBuilder()

      expect(actual).to.equal(parentBuilder)
    })
  })
})

class GenericRequestBuilder extends SmartHomeSkillRequestBuilder<EmptyRequestPayload> {
  private correlationToken?: string

  getRequestBody(): Request<{}> {
    return this.getPayloadEnvelope('namespace', 'name', '3', this.correlationToken, {})
  }

  withCorrelationToken(correlationToken: string): this {
    this.correlationToken = correlationToken
    return this
  }
}
