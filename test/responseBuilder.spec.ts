import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import { Request, RequestPayload } from '../src/dispatcher/request/handler/Request'
import { ErrorResponsePayload } from '../src/response/payloads/ErrorResponsePayload'
import { findPropStateDuplicates, getPropertyState, isSamePropState, Response, ResponsePayload } from '../src/response/Response'
import { ResponseBuilder } from '../src/response/ResponseBuilder'

const request: Request<TestRequestPayload> = {
  directive: {
    header: {
      namespace: 'Testing',
      name: 'Test',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
    },
    payload: { customInput: 3.14, },
  }
}

const succeedResponse: Response<TestResponsePayload> = {
  event: {
    header: {
      namespace: 'Testing',
      name: 'Test.Response',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
    },
    payload: { customOutput: 6.28, },
  }
}

const succeedSimpleTokenResponse: Response<TestResponsePayload> = {
  event: {
    header: {
      namespace: 'Testing',
      name: 'Test.Response',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
    },
    endpoint: {
      scope: {
        type: 'BearerToken',
        token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
      },
    },
    payload: { customOutput: 6.28, },
  }
}

const succeedPartitionedTokenResponse: Response<TestResponsePayload> = {
  event: {
    header: {
      namespace: 'Testing',
      name: 'Test.Response',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
    },
    endpoint: {
      scope: {
        type: 'BearerTokenWithPartition',
        token: 'VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==',
        partition: 'Partition',
        userId: 'UserId',
      },
    },
    payload: { customOutput: 6.28, },
  }
}

const failResponse: Response<ErrorResponsePayload> = {
  event: {
    header: {
      namespace: 'Testing',
      name: 'ErrorResponse',
      payloadVersion: '3',
      messageId: '4b409868-dc4b-ce7f-5ec9-0d6410e74f20',
    },
    payload: { type: 'TestError', message: 'This is a test error', },
  }
}

describe('response builder', function() {
  it('creates a successful response for a successful request', function() {
    const builder = new TestResponseBuilder(request)
    const response = builder
      .setValue(6.28)
      .getSucceedResponse()

    expect(response).to.deep.equal(succeedResponse)
  })
  it('creates an error response for a failed request', function() {
    const builder = new TestResponseBuilder(request)
    const response = builder
      .getFailResponse('TestError', 'This is a test error')

    expect(response).to.deep.equal(failResponse)
  })
  it('ignores succeed model values for a failed request', function() {
    const builder = new TestResponseBuilder(request)
    const response = builder
      .setValue(6.28)
      .getFailResponse('TestError', 'This is a test error')

    expect(response).to.deep.equal(failResponse)
  })
  it('creates a successful response with an endpointId for a successful request', function() {
    const builder = new TestResponseBuilder(request)
    const expectedResponse = _.cloneDeep(succeedResponse)
    expectedResponse.event.endpoint = { endpointId: 'endpointId' }
    const response = builder
      .setValue(6.28)
      .addEndpoint()
      .withEndpointId('endpointId')
      .getResponseBuilder()
      .getSucceedResponse()

    expect(response).to.deep.equal(expectedResponse)
  })
  it('creates a successful response with a correlation token for a successful request', function() {
    const correlationTokenRequest = _.cloneDeep(request)
    correlationTokenRequest.directive.header.correlationToken = 'T3B0aW9uYWwgY29ycmVsYXRpb24gdG9rZW4='
    const builder = new TestResponseBuilder(correlationTokenRequest)
    const expectedResponse = _.cloneDeep(succeedResponse)
    expectedResponse.event.header.correlationToken = 'T3B0aW9uYWwgY29ycmVsYXRpb24gdG9rZW4='
    const response = builder
      .setValue(6.28)
      .getSucceedResponse()

    expect(response).to.deep.equal(expectedResponse)
  })
  it('creates a successful response with a cookie for a successful request', function() {
    const builder = new TestResponseBuilder(request)
    const expectedResponse = _.cloneDeep(succeedResponse)
    expectedResponse.event.endpoint = { cookie: { macAddress: '62:7B:51:61:D3:19', } }
    builder
      .setValue(6.28)
      .addEndpoint()
        .withCookie('macAddress', '62:7B:51:61:D3:19')
    const response = builder.getSucceedResponse()

    expect(response).to.deep.equal(expectedResponse)
  })
  it('creates an error response with an endpointId for a failed request', function() {
    const builder = new TestResponseBuilder(request)
    const expectedResponse = _.cloneDeep(failResponse)
    expectedResponse.event.endpoint = { endpointId: 'endpointId' }
    const response = builder
      .addEndpoint()
      .withEndpointId('endpointId')
      .getResponseBuilder()
      .getFailResponse('TestError', 'This is a test error')

    expect(response).to.deep.equal(expectedResponse)
  })
  it('creates a response with a simple Bearer token', function() {
    const builder = new TestResponseBuilder(request)
    const response = builder
      .setValue(6.28)
      .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .getResponseBuilder()
      .getSucceedResponse()

    expect(response).to.deep.equal(succeedSimpleTokenResponse)
  })
  it('creates a response with a partitioned Bearer token', function() {
    const builder = new TestResponseBuilder(request)
    const response = builder
      .setValue(6.28)
      .addEndpoint()
        .withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')
        .getResponseBuilder()
      .getSucceedResponse()

    expect(response).to.deep.equal(succeedPartitionedTokenResponse)
  })
})

describe('property states', function() {
  describe('when comparing prop states', function() {
    it('returns true when namespace, instance, and name are the same', function() {
      const x = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }
      const y = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }

      expect(isSamePropState(x, y)).to.be.true
    })
    it('returns false when namespace is different', function() {
      const x = {
        namespace: 'namespace1',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }
      const y = {
        namespace: 'namespace2',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }

      expect(isSamePropState(x, y)).to.be.false
    })
    it('returns false when instance is different', function() {
      const x = {
        namespace: 'namespace',
        instance: undefined,
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }
      const y = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }

      expect(isSamePropState(x, y)).to.be.false
    })
    it('returns false when name is different', function() {
      const x = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name1',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }
      const y = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name2',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }

      expect(isSamePropState(x, y)).to.be.false
    })
  })
  describe('when getting duplicate prop states', function() {
    it('returns none when all are unique', function() {
      const props = [
        {
          namespace: 'namespace1',
          instance: 'instance',
          name: 'name',
          value: { value: 'value', },
          timeOfSample: new Date('2017-02-03T16:20:50Z'),
          uncertaintyInMilliseconds: 0,
        },
        {
          namespace: 'namespace2',
          instance: 'instance',
          name: 'name',
          value: { value: 'value', },
          timeOfSample: new Date('2017-02-03T16:20:50Z'),
          uncertaintyInMilliseconds: 0,
        },
      ]

      expect(findPropStateDuplicates(props).length).to.equal(0)
    })
    it('returns duplicates when duplicates exist', function() {
      const props = [
        {
          namespace: 'namespace',
          instance: 'instance',
          name: 'name',
          value: { value: 'value', },
          timeOfSample: new Date('2017-02-03T16:20:50Z'),
          uncertaintyInMilliseconds: 0,
        },
        {
          namespace: 'namespace',
          instance: 'instance',
          name: 'name',
          value: { value: 'value', },
          timeOfSample: new Date('2017-02-03T16:20:50Z'),
          uncertaintyInMilliseconds: 0,
        },
      ]

      expect(findPropStateDuplicates(props).length).to.equal(1)
    })
    it('returns duplicates when namespace, instance, and name are the same', function() {
      const props = [
        {
          namespace: 'namespace',
          instance: 'instance',
          name: 'name',
          value: { value: 'value1', },
          timeOfSample: new Date('2017-02-03T16:20:51Z'),
          uncertaintyInMilliseconds: 1,
        },
        {
          namespace: 'namespace',
          instance: 'instance',
          name: 'name',
          value: { value: 'value2', },
          timeOfSample: new Date('2017-02-03T16:20:52Z'),
          uncertaintyInMilliseconds: 2,
        },
      ]

      expect(findPropStateDuplicates(props).length).to.equal(1)
    })
  })
  describe('when converting prop states to property states', function() {
    it('returns a property state with no instance', function() {
      const propState = {
        namespace: 'namespace',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }
      const expected = {
        namespace: 'namespace',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: '2017-02-03T16:20:50.000Z',
        uncertaintyInMilliseconds: 0,
      }
      
      expect(getPropertyState(propState)).to.deep.equal(expected)
    })
    it('returns a property state with an instance', function() {
      const propState = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: new Date('2017-02-03T16:20:50Z'),
        uncertaintyInMilliseconds: 0,
      }
      const expected = {
        namespace: 'namespace',
        instance: 'instance',
        name: 'name',
        value: { value: 'value', },
        timeOfSample: '2017-02-03T16:20:50.000Z',
        uncertaintyInMilliseconds: 0,
      }
      
      expect(getPropertyState(propState)).to.deep.equal(expected)
    })
  })
})

interface TestRequestPayload extends RequestPayload {
  customInput: number
}

interface TestResponsePayload extends ResponsePayload {
  customOutput: number
}

class TestResponseBuilder extends ResponseBuilder {
  private value = 0

  constructor(request: Request<TestRequestPayload>) {
    super(request)
  }

  setValue(value: number): this {
    this.value = value
    return this
  }

  getSucceedResponse(): Response<TestResponsePayload> {
    return this.getPayloadEnvelope('Testing', 'Test.Response', '3', { customOutput: this.value })
  }

  getFailResponse(type: string, message: string): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope('Testing', 'ErrorResponse', '3', { type, message, })
  }
}
