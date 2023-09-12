import { Context } from 'aws-lambda'
import { Request } from '../dispatcher/request/handler/types'
import { AttributesManager, PersistenceAdapter } from './types'

interface Options {
  persistenceAdapter?: PersistenceAdapter
  request: Request<unknown>
  context: Context
}

export default function (options: Options): AttributesManager {
  let thisRequestAttributes: { [key: string]: unknown } = {}
  let thisPersistentAttributes: { [key: string]: unknown } = {}
  let thisHasPersistentCache = false

  return {
    getRequestAttributes (): { [key: string]: unknown } {
      return thisRequestAttributes
    },

    setRequestAttributes (requestAttributes: { [key: string]: unknown }): void {
      thisRequestAttributes = requestAttributes
    },

    async getPersistentAttributes (useCache = true, defaultAttributes?: { [key: string]: unknown }): Promise<{ [key: string]: unknown }> {
      if (options.persistenceAdapter === undefined) {
        throw new Error('Persistence adapter not specified')
      }

      if (!thisHasPersistentCache || !useCache) {
        thisPersistentAttributes = await options.persistenceAdapter.getAttributes(options.request, options.context)
        thisHasPersistentCache = true
      }

      if (defaultAttributes !== undefined && Object.keys(thisPersistentAttributes).length === 0) {
        thisPersistentAttributes = defaultAttributes
      }

      return thisPersistentAttributes
    },

    setPersistentAttributes (persistentAttributes: { [key: string]: unknown }): void {
      if (options.persistenceAdapter === undefined) {
        throw new Error('Persistence adapter not specified')
      }

      thisPersistentAttributes = persistentAttributes
      thisHasPersistentCache = true
    },

    async savePersistentAttributes (): Promise<void> {
      if (options.persistenceAdapter === undefined) {
        throw new Error('Persistence adapter not specified')
      }

      if (thisHasPersistentCache) {
        await options.persistenceAdapter.saveAttributes(options.request, options.context, thisPersistentAttributes)
      }
    },

    async deletePersistentAttributes (): Promise<void> {
      if (options.persistenceAdapter === undefined) {
        throw new Error('Persistence adapter not specified')
      }

      if (thisHasPersistentCache && options.persistenceAdapter.deleteAttributes !== undefined) {
        await options.persistenceAdapter.deleteAttributes(options.request, options.context)
        thisHasPersistentCache = false
        thisPersistentAttributes = {}
      }
    }
  }
}
