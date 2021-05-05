import { expect } from 'chai'
import 'mocha'
import { Request, RequestPayload } from '../../lib/smarthome-sdk/dispatcher/request/handler/Request'
import { ErrorResponsePayload } from '../../lib/smarthome-sdk/response/payloads/ErrorResponsePayload'
import { Response, ResponsePayload } from '../../lib/smarthome-sdk/response/Response'
import { ResponseBuilder } from '../../lib/smarthome-sdk/response/ResponseBuilder'

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
})

interface TestRequestPayload extends RequestPayload {
  customInput: number
}

interface TestResponsePayload extends ResponsePayload {
  customOutput: number
}

class TestResponseBuilder extends ResponseBuilder {
  private request: Request<TestRequestPayload>
  private value: number = 0

  constructor(request: Request<TestRequestPayload>) {
    super()
    this.request = request
  }

  setValue(value: number): this {
    this.value = value
    return this
  }

  getSucceedResponse(): Response<TestResponsePayload> {
    return this.getPayloadEnvelope(this.request.directive.header.messageId, 'Testing', 'Test.Response', '3', { customOutput: this.value })
  }

  getFailResponse(type: string, message: string): Response<ErrorResponsePayload> {
    return this.getPayloadEnvelope(this.request.directive.header.messageId, 'Testing', 'ErrorResponse', '3', { type, message, })
  }
}
