import { LogLevels } from './constants'

/**
 * Gets the current log level based on either the specified string or the LOG_LEVEL environment variable.
 * @param level A string override for the log level
 * @returns The LogLevel
 */
export function getLogLevel(level?: string): LogLevels {
  level = (level ?? process.env.LOG_LEVEL)?.toLowerCase()
  for (const key in LogLevels) {
    if (Object.prototype.hasOwnProperty.call(LogLevels, key)) {
      const element = LogLevels[key]
      if (typeof element === 'string' && element.toLowerCase() === level) {
        return LogLevels[element as keyof typeof LogLevels]
      }
    }
  }
  return LogLevels.error
}

/**
 * Logs the specified message at the specified message level if the environment log level is high enough.
 * @param messageLevel The log level of the message
 * @param message The message to log
 * @param optionalParams Additional parameters to pass to the logging function
 */
export function logMessage(
  messageLevel: LogLevels = LogLevels.info,
  message?: Error | string | undefined,
  ...optionalParams: Array<string | undefined>
): void {
  if (getLogLevel() >= messageLevel && process.env.NODE_ENV !== 'test') {
    switch (messageLevel) {
      case LogLevels.fatal:
        console.error(message, ...optionalParams)
        break

      case LogLevels.error:
        console.error(message, ...optionalParams)
        break

      case LogLevels.warn:
        console.warn(message, ...optionalParams)
        break

      case LogLevels.info:
        console.info(message, ...optionalParams)
        break

      case LogLevels.debug:
        console.debug(message, ...optionalParams)
        break

      case LogLevels.trace:
        console.trace(message, ...optionalParams)
        break

      case LogLevels.all:
        console.log(message, ...optionalParams)
        break

      default:
    }
  }
}
