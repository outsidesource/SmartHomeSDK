import { Context } from 'aws-lambda'
import { expect } from 'chai'
import 'mocha'
import sinon from 'sinon'
import AttributesManagerFactory from '../../src/attributes/attributesManagerFactory'
import { AcceptGrantRequestPayload } from '../../src/directives/acceptGrant/types'
import { Request } from '../../src/dispatcher/request/handler/types'
import { getLambdaContext, getPersistenceAdapter } from '../fixtures'

const request: Request<AcceptGrantRequestPayload> = require('../fixtures/acceptGrantRequest.json')
const context: Context = getLambdaContext()

describe('attributes manager', function () {
  afterEach(function () {
    sinon.restore()
  })



  describe('getRequestAttributes()', function () {
    it('returns the previously set object', function () {
      const sut = AttributesManagerFactory({ request, context })
      const requestData = { foo: 'bar' }
      sut.setRequestAttributes(requestData)

      const actual = sut.getRequestAttributes()

      expect(actual).to.equal(requestData)
    })

    it('returns an empty object when an object has not been set', function () {
      const sut = AttributesManagerFactory({ request, context })

      const actual = sut.getRequestAttributes()

      expect(actual).to.deep.equal({})
    })
  })



  describe('setRequestAttributes()', function () {
    it('stores the object to be returned later', function () {
      const sut = AttributesManagerFactory({ request, context })
      const requestData = { foo: 'bar' }

      sut.setRequestAttributes(requestData)
      const actual = sut.getRequestAttributes()

      expect(actual).to.equal(requestData)
    })

    it('overwrites the previously stored object', function () {
      const sut = AttributesManagerFactory({ request, context })
      const requestData1 = { foo: 'bar' }
      const requestData2 = { fubaz: 'boobar' }

      sut.setRequestAttributes(requestData1)
      sut.setRequestAttributes(requestData2)
      const actual = sut.getRequestAttributes()

      expect(actual).to.equal(requestData2)
    })
  })



  describe('getPersistentAttributes()', function () {
    it('returns data from the persistence adapter when cached data is not present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const spy = sinon.spy(persistenceAdapter, 'getAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })

      await sut.getPersistentAttributes()

      expect(spy.callCount).to.equal(1)
    })

    it('returns cached data when present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      const actual = await sut.getPersistentAttributes()

      expect(actual).to.equal(persistentData)
    })

    it('returns data from the persistence adapter when cached data should be discarded', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const spy = sinon.spy(persistenceAdapter, 'getAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      const actual = await sut.getPersistentAttributes(false)

      expect(spy.callCount).to.equal(1)
      expect(actual).to.deep.equal({})
    })

    it('returns the default data when cached and persisted data are not present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const defaultData = { foo: 'bar' }

      const actual = await sut.getPersistentAttributes(true, defaultData)

      expect(actual).to.equal(defaultData)
    })

    it('does not return request data when persistence data is requested', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const requestData = { fubaz: 'boobar' }
      const persistentData = { foo: 'bar' }
      sut.setRequestAttributes(requestData)
      sut.setPersistentAttributes(persistentData)

      const actual = await sut.getPersistentAttributes()

      expect(actual).to.equal(persistentData)
    })

    it('throws when given no persistence adapter', function () {
      const sut = AttributesManagerFactory({ request, context })

      return Promise.resolve(sut.getPersistentAttributes()).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal('Persistence adapter not specified')
        }
      )
    })

    it('throws when an error in the persistence adapter occurs', function () {
      const persistenceAdapter = getPersistenceAdapter(true)
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })

      return Promise.resolve(sut.getPersistentAttributes()).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal('Intentionally rejecting')
        }
      )
    })
  })



  describe('setPersistentAttributes()', function () {
    it('caches the given data without persisting it', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const spy = sinon.spy(persistenceAdapter, 'saveAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }

      sut.setPersistentAttributes(persistentData)
      const actual = await sut.getPersistentAttributes()

      expect(spy.callCount).to.equal(0)
      expect(actual).to.equal(persistentData)
    })

    it('throws when given no persistence adapter', function () {
      const sut = AttributesManagerFactory({ request, context })

      expect(() => sut.setPersistentAttributes({})).to.throw('Persistence adapter not specified')
    })
  })



  describe('savePersistentAttributes()', function () {
    it('sends the persisted data to the persistence adapter when persisted data is present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const spy = sinon.spy(persistenceAdapter, 'saveAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      await sut.savePersistentAttributes()

      expect(spy.callCount).to.equal(1)
      expect(spy.firstCall.args[2]).to.equal(persistentData)
    })

    it('does not call the persistence adapter when persisted data is not present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const spy = sinon.spy(persistenceAdapter, 'saveAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })

      await sut.savePersistentAttributes()

      expect(spy.callCount).to.equal(0)
    })

    it('throws when given no persistence adapter', function () {
      const sut = AttributesManagerFactory({ request, context })

      return Promise.resolve(sut.savePersistentAttributes()).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal('Persistence adapter not specified')
        }
      )
    })

    it('throws when an error in the persistence adapter occurs', function () {
      const persistenceAdapter = getPersistenceAdapter(true)
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      return Promise.resolve(sut.savePersistentAttributes()).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal('Intentionally rejecting')
        }
      )
    })
  })



  describe('deletePersistentAttributes()', function () {
    it('calls the persistence adapter when persisted data is present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const deleteSpy = sinon.spy(persistenceAdapter, 'deleteAttributes')
      const getSpy = sinon.spy(persistenceAdapter, 'getAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      await sut.deletePersistentAttributes()
      const actual = await sut.getPersistentAttributes()

      expect(deleteSpy.callCount).to.equal(1)
      expect(getSpy.callCount).to.equal(1)
      expect(actual).to.deep.equal({})
    })

    it('does not call the persistence adapter when persisted data is not present', async function () {
      const persistenceAdapter = getPersistenceAdapter()
      const spy = sinon.spy(persistenceAdapter, 'deleteAttributes')
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })

      await sut.deletePersistentAttributes()

      expect(spy.callCount).to.equal(0)
    })

    it('does not call the persistence adapter when the persistence adapter does not support deletion', async function () {
      const persistenceAdapter = getPersistenceAdapter(false, false)
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      await sut.deletePersistentAttributes()

      //  Since persistenceAdapter.deleteAttributes() is undefined, there's nothing to spy on
    })

    it('throws when given no persistence adapter', function () {
      const sut = AttributesManagerFactory({ request, context })

      return Promise.resolve(sut.deletePersistentAttributes()).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal('Persistence adapter not specified')
        }
      )
    })

    it('throws when an error in the persistence adapter occurs', function () {
      const persistenceAdapter = getPersistenceAdapter(true)
      const sut = AttributesManagerFactory({ request, context, persistenceAdapter })
      const persistentData = { foo: 'bar' }
      sut.setPersistentAttributes(persistentData)

      return Promise.resolve(sut.deletePersistentAttributes()).then(
        value => Promise.reject(new Error('promise should not resolve')),
        (reason: Error) => {
          expect(reason.message).to.equal('Intentionally rejecting')
        }
      )
    })
  })
})

