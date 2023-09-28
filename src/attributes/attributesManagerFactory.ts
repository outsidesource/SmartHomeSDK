import { type Context } from 'aws-lambda'
import { type Request } from '../dispatcher/request/handler/types'
import { type AttributesManager, type PersistenceAdapter } from './types'

interface Options {
  persistenceAdapter?: PersistenceAdapter
  request: Request<unknown>
  context: Context
}

export default function (options: Options): AttributesManager {
  let thisRequestAttributes: Record<string, unknown> = {}
  let thisPersistentAttributes: Record<string, unknown> = {}
  let thisHasPersistentCache = false

  return {
    getRequestAttributes (): Record<string, unknown> {
      return thisRequestAttributes
    },

    setRequestAttributes (requestAttributes: Record<string, unknown>): void {
      thisRequestAttributes = requestAttributes
    },

    async getPersistentAttributes (useCache = true, defaultAttributes?: Record<string, unknown>): Promise<Record<string, unknown>> {
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

    setPersistentAttributes (persistentAttributes: Record<string, unknown>): void {
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
