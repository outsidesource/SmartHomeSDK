import _ from 'lodash'
import { LambdaContext } from '../../../lib/smarthome-sdk/dispatcher/request/handler/LambdaContext'
import { Response } from '../../../lib/smarthome-sdk/response/Response'

export function getLambdaContext(): LambdaContext {
  return _.merge({ }, require('./lambdaContext.json'), { getRemainingTimeInMillis: (() => 0) })
}

export function getLambdaCallback(
  done: (error?:Error) => void, 
  test?: (err?:Error, result?: Response) => void) {
  return (err?: Error, result?: Response) => {
    try {
      if (test) {
        test(err, result)
      }
    } catch (error) {
      done(error)
    }
    done()
  }
}
