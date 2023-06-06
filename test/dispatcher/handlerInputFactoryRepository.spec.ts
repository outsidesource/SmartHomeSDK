import { Context } from 'aws-lambda'
import { expect } from 'chai'
import 'mocha'
import { AcceptGrantRequestPayload } from '../../src/directives/acceptGrant/types'
import { HandlerInputFactoryRepository } from '../../src/dispatcher/request/handler/factory/repository'
import { Request } from '../../src/dispatcher/request/handler/types'
import { getLambdaContext } from '../fixtures'

const request: Request<AcceptGrantRequestPayload> = require('../fixtures/acceptGrantRequest.json')

const factory = {
  canCreate: (request: Request<unknown>, context: Context) => true,
  create: (request: Request<unknown>, context: Context) => undefined,
}
const lambdaContext = getLambdaContext()

describe('handler input factory repository', function () {
  it('returns the factory when found', function () {
    const sut = new HandlerInputFactoryRepository(factory)

    const actual = sut.getHandlerInputFactory(request, lambdaContext)

    expect(actual).to.equal(factory)
  })

  it('returns undefined when the factory is not found', function () {
    const sut = new HandlerInputFactoryRepository()

    const actual = sut.getHandlerInputFactory(request, lambdaContext)

    expect(actual).to.be.undefined
  })
})
