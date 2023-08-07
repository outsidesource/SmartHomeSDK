import { Context } from 'aws-lambda'
import { Request } from '../dispatcher/request/handler/types'

/**
 * An interface for storing and retrieving persistent attributes from persistence tier given request envelope.
 */
export interface PersistenceAdapter {
  getAttributes: (request: Request<unknown>, context: Context) => Promise<{ [key: string]: unknown }>
  saveAttributes: (request: Request<unknown>, context: Context, attributes: { [key: string]: unknown }) => Promise<void>
  deleteAttributes?: (request: Request<unknown>, context: Context) => Promise<void>
}

/**
 * An interface handling two levels of attributes: request and persistence.
 */
export interface AttributesManager {
  /**
   * Provides request attributes for the request life cycle.
   * @returns {Object.<string, unknown>}
   */
  getRequestAttributes: () => { [key: string]: unknown }

  /**
   * Overwrites the request attributes value.
   * @param {Object.<string, unknown>} requestAttributes
   * @returns {void}
   */
  setRequestAttributes: (requestAttributes: { [key: string]: unknown }) => void

  /**
   * Provides persistent attributes retrieved and cached from a persistence adapter if one is provided. Provide `false` to `useCache` to ignore values cached from previous invocations.
   * @param {boolean} [useCache=true]
   * @param {Object.<string, unknown>} [defaultAttributes]
   * @returns {Promise<Object.<string, unknown>>}
   */
  getPersistentAttributes: (useCache?: boolean, defaultAttributes?: { [key: string]: unknown }) => Promise<{ [key: string]: unknown }>

  /**
   * Overwrites and caches the persistent attributes value. Note: no persistence layer calls are being made in this function.
   * @param {Object.<string, unknown>} persistentAttributes
   * @returns {void}
   */
  setPersistentAttributes: (persistentAttributes: { [key: string]: unknown }) => void

  /**
   * Save persistent attributes to the persistence layer if a persistence adapter is provided.
   * @return {Promise<void>}
   */
  savePersistentAttributes: () => Promise<void>

  /**
   * Delete persistent attributes from the persistent layer if a persistence adapter is provided.
   * @return {Promise<void>}
   */
  deletePersistentAttributes: () => Promise<void>
}
