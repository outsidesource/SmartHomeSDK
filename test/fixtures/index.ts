import { Context } from 'aws-lambda'
import _ from 'lodash'
import { Response } from '../../src/response/Response'

export function getLambdaContext(): Context {
  return _.merge({}, require('./lambdaContext.json'), { getRemainingTimeInMillis: (() => 0) })
}

export function getLambdaCallback(
  done: (error?: Error | string | null) => void,
  test?: (err?: Error | string | null, result?: Response<unknown>) => void) {
  return (err?: Error | string | null, result?: Response<unknown>) => {
    try {
      if (test) {
        test(err, result)
      }
    } catch (error: unknown) {
      done(error as Error)
    }
    done()
  }
}

/**
 * The main purpose of this function is to unset or delete
 * `undefined` properties. During type-checking and at runtime, 
 * undefined values will behave as expected. However, since
 * most of the tests compare the result to a JSON fixture, 
 * and `undefined` cannot be used in JSON, the deep equal checks
 * correctly identify that a property is unset in JSON.
 */
export function removeUndefinedProps<T>(obj: T | undefined | null): T | undefined | null {
  return obj === undefined || obj === null
    ? obj
    : JSON.parse(JSON.stringify(obj))
}
