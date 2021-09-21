import { expect } from 'chai'
import 'mocha'
import { HandlerInputFactoryRepository } from '../src/dispatcher/request/handler/factory/HandlerInputFactoryRepository'
import { LambdaContext } from '../src/dispatcher/request/handler/LambdaContext'
import { Request } from '../src/dispatcher/request/handler/Request'
import { getLambdaContext } from './fixtures'
import request from './fixtures/acceptGrantRequest.json'

const factory = {
  canCreate: (request: Request<unknown>, context: LambdaContext) => true,
  create: (request: Request<unknown>, context: LambdaContext) => undefined,
}
const lambdaContext = getLambdaContext()

describe('handler input factory repository', function() {
  it('returns the factory when found', function() {
    const repo = new HandlerInputFactoryRepository(factory)

    const result = repo.getHandlerInputFactory(request, lambdaContext)

    expect(result).to.equal(factory)
  })
  it('returns undefined when the factory is not found', function() {
    const repo = new HandlerInputFactoryRepository()

    const result = repo.getHandlerInputFactory(request, lambdaContext)

    expect(result).to.be.undefined
  })
})
