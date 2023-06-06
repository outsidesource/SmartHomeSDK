import { expect } from 'chai'
import _ from 'lodash'
import 'mocha'
import sinon from 'sinon'
import { Request } from '../../src/dispatcher/request/handler/types'
import { ContextBuilder, EndpointBuilder, ResponseBuilder, findPropStateDuplicates, getPropertyState, isSamePropState } from '../../src/response/baseResponseBuilder'
import { ErrorResponsePayload } from '../../src/response/payloads/types'
import { Response } from '../../src/response/types'
import { TestRequestPayload, TestResponseBuilder, TestResponsePayload } from '../fixtures'
import { createSinonStubInstance } from '../helpers'

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



describe('base response builder', function () {
  afterEach(function () {
    sinon.restore()
  })



  describe('response builder', function () {
    it('returns a successful response for a successful request', function () {
      const sut = new TestResponseBuilder(request)

      const actual = sut
        .setValue(6.28)
        .getSucceedResponse()

      expect(actual).to.deep.equal(succeedResponse)
    })

    it('returns an error response for a failed request', function () {
      const sut = new TestResponseBuilder(request)

      const actual = sut
        .getFailResponse('TestError', 'This is a test error')

      expect(actual).to.deep.equal(failResponse)
    })

    it('ignores succeed model values for a failed request', function () {
      const sut = new TestResponseBuilder(request)

      const actual = sut
        .setValue(6.28)
        .getFailResponse('TestError', 'This is a test error')

      expect(actual).to.deep.equal(failResponse)
    })

    it('returns a successful response with an endpointId for a successful request', function () {
      const sut = new TestResponseBuilder(request)
      const expectedResponse = _.cloneDeep(succeedResponse)
      expectedResponse.event.endpoint = { endpointId: 'endpointId' }

      const actual = sut
        .setValue(6.28)
        .addEndpoint()
        .withEndpointId('endpointId')
        .getResponseBuilder()
        .getSucceedResponse()

      expect(actual).to.deep.equal(expectedResponse)
    })

    it('returns a successful response with a correlation token for a successful request', function () {
      const correlationTokenRequest = _.cloneDeep(request)
      correlationTokenRequest.directive.header.correlationToken = 'T3B0aW9uYWwgY29ycmVsYXRpb24gdG9rZW4='
      const sut = new TestResponseBuilder(correlationTokenRequest)
      const expectedResponse = _.cloneDeep(succeedResponse)
      expectedResponse.event.header.correlationToken = 'T3B0aW9uYWwgY29ycmVsYXRpb24gdG9rZW4='

      const actual = sut
        .setValue(6.28)
        .getSucceedResponse()

      expect(actual).to.deep.equal(expectedResponse)
    })

    it('returns a successful response with a cookie for a successful request', function () {
      const sut = new TestResponseBuilder(request)
      const expectedResponse = _.cloneDeep(succeedResponse)
      expectedResponse.event.endpoint = { cookie: { macAddress: '62:7B:51:61:D3:19', } }
      sut
        .setValue(6.28)
        .addEndpoint()
        .withCookie('macAddress', '62:7B:51:61:D3:19')

      const actual = sut.getSucceedResponse()

      expect(actual).to.deep.equal(expectedResponse)
    })

    it('returns an error response with an endpointId for a failed request', function () {
      const sut = new TestResponseBuilder(request)
      const expectedResponse = _.cloneDeep(failResponse)
      expectedResponse.event.endpoint = { endpointId: 'endpointId' }

      const actual = sut
        .addEndpoint()
        .withEndpointId('endpointId')
        .getResponseBuilder()
        .getFailResponse('TestError', 'This is a test error')

      expect(actual).to.deep.equal(expectedResponse)
    })

    it('returns a response with a simple Bearer token', function () {
      const sut = new TestResponseBuilder(request)

      const actual = sut
        .setValue(6.28)
        .addEndpoint()
        .withSimpleToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==')
        .getResponseBuilder()
        .getSucceedResponse()

      expect(actual).to.deep.equal(succeedSimpleTokenResponse)
    })

    it('returns a response with a partitioned Bearer token', function () {
      const sut = new TestResponseBuilder(request)
      const actual = sut
        .setValue(6.28)
        .addEndpoint()
        .withPartitionedToken('VGhpcyBpcyBhIEJlYXJlciB0b2tlbg==', 'Partition', 'UserId')
        .getResponseBuilder()
        .getSucceedResponse()

      expect(actual).to.deep.equal(succeedPartitionedTokenResponse)
    })

    it('returns the context when addContext() is invoked multiple times', function () {
      const sut = new TestResponseBuilder(request)

      const actual1 = sut.addContext()
      const actual2 = sut.addContext()

      expect(actual1).to.equal(actual2)
    })
  })



  describe('endpoint builder', function () {
    it('returns undefined when endpoint id is missing', function () {
      const parentBuilderStub = createSinonStubInstance(ResponseBuilder)
      const sut = new EndpointBuilder(parentBuilderStub)

      const actual = sut.getEndpoint()

      expect(actual).to.be.undefined
    })
  })



  describe('context builder', function () {
    it('throws an exception when duplicate changed properties are added', function () {
      const parentBuilderStub = createSinonStubInstance(ResponseBuilder)
      const sut = new ContextBuilder(parentBuilderStub)
      sut
        .withProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)
        .withProperty('Alexa.BrightnessController', undefined, 'brightness', 85, new Date('2017-02-03T16:20:50Z'), 0)

      expect(() => sut.getContext()).to.throw('The following unchanged properties are duplicated: {\"namespace\":\"Alexa.BrightnessController\",\"name\":\"brightness\"}')
    })

    it('returns undefined when no properties are added', function () {
      const parentBuilderStub = createSinonStubInstance(ResponseBuilder)
      const sut = new ContextBuilder(parentBuilderStub)

      const actual = sut.getContext()

      expect(actual).to.be.undefined
    })

    it('returns the parent builder when invoked', function () {
      const parentBuilderStub = createSinonStubInstance(ResponseBuilder)
      const sut = new ContextBuilder(parentBuilderStub)

      const actual = sut.getResponseBuilder()

      expect(actual).to.equal(parentBuilderStub)
    })
  })
})



describe('property states', function () {
  describe('when comparing prop states', function () {
    it('returns true when namespace, instance, and name are the same', function () {
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

      const actual = isSamePropState(x, y)

      expect(actual).to.be.true
    })

    it('returns false when namespace is different', function () {
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

      const actual = isSamePropState(x, y)

      expect(actual).to.be.false
    })

    it('returns false when instance is different', function () {
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

      const actual = isSamePropState(x, y)

      expect(actual).to.be.false
    })

    it('returns false when name is different', function () {
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

      const actual = isSamePropState(x, y)

      expect(actual).to.be.false
    })
  })



  describe('when getting duplicate prop states', function () {
    it('returns none when all are unique', function () {
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

      const actual = findPropStateDuplicates(props)

      expect(actual.length).to.equal(0)
    })

    it('returns duplicates when duplicates exist', function () {
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

      const actual = findPropStateDuplicates(props)

      expect(actual.length).to.equal(1)
    })

    it('returns duplicates when namespace, instance, and name are the same', function () {
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

      const actual = findPropStateDuplicates(props)

      expect(actual.length).to.equal(1)
    })
  })



  describe('when converting prop states to property states', function () {
    it('returns a property state with no instance', function () {
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

      const actual = getPropertyState(propState)

      expect(actual).to.deep.equal(expected)
    })

    it('returns a property state with an instance', function () {
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

      const actual = getPropertyState(propState)

      expect(actual).to.deep.equal(expected)
    })
  })
})
