import { expect } from 'chai'
import 'mocha'
import { convertPropStateToPropertyState, findDuplicates, findIntersection, getHistogram, getPropStateKey, isSamePropState } from '../../src/util/helpers'

describe('helpers', function () {
  describe('generic', function () {
    describe('getHistogram()', function () {
      it('returns a histogram with counts for each key', function () {
        const items = [
          { foobar: 'alpha', fubaz: undefined },
          { foobar: 'bravo', fubaz: 42 },
          { foobar: 'alpha', fubaz: 24 },
          { foobar: 'charlie', fubaz: null },
          { foobar: 'alpha', fubaz: 314 }
        ]
        const expected = {
          alpha: 3,
          bravo: 1,
          charlie: 1
        }

        const actual = getHistogram(items, getMyObjectKey)

        expect(actual).to.deep.equal(expected)
      })
    })



    describe('findDuplicates()', function () {
      it('returns a list of keys that appear more than once', function () {
        const items = [
          { foobar: 'alpha', fubaz: undefined },
          { foobar: 'bravo', fubaz: 42 },
          { foobar: 'alpha', fubaz: 24 },
          { foobar: 'charlie', fubaz: null },
          { foobar: 'alpha', fubaz: 314 }
        ]

        const actual = findDuplicates(items, getMyObjectKey)

        expect(actual).to.deep.equal(['alpha'])
      })

      it('returns an empty list when no duplicates are present', function () {
        const items = [
          { foobar: 'alpha', fubaz: undefined },
          { foobar: 'bravo', fubaz: 42 },
          { foobar: 'charlie', fubaz: null }
        ]

        const actual = findDuplicates(items, getMyObjectKey)

        expect(actual).to.deep.equal([])
      })
    })



    describe('findIntersection()', function () {
      it('returns any items from the first list that match an item from the second list', function () {
        const items1 = [
          { foobar: 'alpha', fubaz: 24 },
          { foobar: 'charlie', fubaz: null }
        ]
        const items2 = ['bravo', 'charlie']
        const comparator = (x: MyObject, y: string): boolean => x.foobar === y

        const actual = findIntersection(items1, items2, comparator)

        expect(actual).to.deep.equal([{ foobar: 'charlie', fubaz: null }])
      })
    })
  })



  describe('property states', function () {
    describe('getPropStateKey()', function () {
      it('returns a string with only key-related data', function () {
        const prop = {
          namespace: 'namespace',
          instance: 'instance',
          name: 'name',
          value: { value: 'value' },
          timeOfSample: new Date('2017-02-03T16:20:50Z'),
          uncertaintyInMilliseconds: 0,
        }

        const actual = getPropStateKey(prop)

        expect(actual).to.equal('{"namespace":"namespace","instance":"instance","name":"name"}')
      })

      it('returns a string without the instance when the instance is missing', function () {
        const prop = {
          namespace: 'namespace',
          instance: undefined,
          name: 'name',
          value: { value: 'value' },
          timeOfSample: new Date('2017-02-03T16:20:50Z'),
          uncertaintyInMilliseconds: 0,
        }

        const actual = getPropStateKey(prop)

        expect(actual).to.equal('{"namespace":"namespace","name":"name"}')
      })
    })



    describe('isSamePropState()', function () {
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



    describe('convertPropStateToPropertyState()', function () {
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

        const actual = convertPropStateToPropertyState(propState)

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

        const actual = convertPropStateToPropertyState(propState)

        expect(actual).to.deep.equal(expected)
      })
    })
  })
})



interface MyObject {
  foobar: string
  fubaz?: number | null
}

function getMyObjectKey(obj: MyObject): string {
  return obj.foobar
}
