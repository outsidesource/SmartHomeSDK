import _ from 'lodash'
import { LambdaContext } from '../../src/dispatcher/request/handler/LambdaContext'
import { Response } from '../../src/response/Response'

export function getLambdaContext(): LambdaContext {
  return _.merge({ }, require('./lambdaContext.json'), { getRemainingTimeInMillis: (() => 0) })
}

export function getLambdaCallback(
  done: (error?: Error) => void, 
  test?: (err?: Error, result?: Response<unknown>) => void) {
  return (err?: Error, result?: Response<unknown>) => {
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
