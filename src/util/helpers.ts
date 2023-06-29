import { PropState, PropertyState } from './types'

interface Histogram {
  [key: string]: number
}

export function getHistogram<T> (items: T[], getKey: (item: T) => string): Histogram {
  return items.reduce((histo: Histogram, item: T) => {
    const key = getKey(item)
    return { ...histo, [key]: (histo[key] ?? 0) + 1 }
  }, {})
}

export function findDuplicates<T> (items: T[], getKey: (item: T) => string): string[] {
  const histo = getHistogram(items, getKey)
  return Object.keys(histo).filter(key => histo[key] > 1)
}

export function findIntersection<T, U = T> (items1: T[], items2: U[], comparator: (x: T, y: U) => boolean): T[] {
  return items1.filter(x => items2.find(y => comparator(x, y)))
}

export function getPropStateKey (prop: PropState): string {
  return JSON.stringify({ namespace: prop.namespace, instance: prop.instance, name: prop.name })
}

export function isSamePropState (x: PropState, y: PropState): boolean {
  return x.namespace === y.namespace &&
    x.instance === y.instance &&
    x.name === y.name
}

export function convertPropStateToPropertyState (prop: PropState): PropertyState {
  const result: PropertyState = {
    namespace: prop.namespace,
    name: prop.name,
    value: prop.value,
    timeOfSample: prop.timeOfSample.toISOString(),
    uncertaintyInMilliseconds: prop.uncertaintyInMilliseconds
  }

  if (prop.instance !== undefined && prop.instance !== '') {
    result.instance = prop.instance
  }

  return result
}
