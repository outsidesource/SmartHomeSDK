/**
 * Common error types.
 */
export enum ErrorTypes {
  /**
   * The operation can't be performed because the endpoint is already in operation.
   */
  AlreadyInOperation = 'ALREADY_IN_OPERATION',

  /**
   * The bridge is unreachable or offline. For example, the bridge might be turned off, disconnected from the customer's local area network, or connectivity between the bridge and the device cloud might have been lost. When you respond to a ReportState directive, there may be times when you should return a StateReport instead of this error. For more information, see Alexa.EndpointHealth.
   */
  BridgeUnreachable = 'BRIDGE_UNREACHABLE',

  /**
   * The user can't control the device over the internet, and should control the device manually instead.
   */
  CloudControlDisabled = 'CLOUD_CONTROL_DISABLED',

  /**
   * The endpoint can't handle the directive because it is performing another action, which may or may not have originated from a request to Alexa.
   */
  EndpointBusy = 'ENDPOINT_BUSY',

  /**
   * The endpoint can't handle the directive because the battery power is too low. See an example here.
   */
  EndpointLowPower = 'ENDPOINT_LOW_POWER',

  /**
   * The endpoint is unreachable or offline. For example, the endpoint might be turned off, disconnected from the customer's local area network, or connectivity between the endpoint and bridge or the endpoint and the device cloud might have been lost. When you respond to a ReportState directive, there may be times when you should return a StateReport instead of this error. For more information, see Alexa.EndpointHealth.
   */
  EndpointUnreachable = 'ENDPOINT_UNREACHABLE',

  /**
   * The authorization credential provided by Alexa has expired. For example, the OAuth2 access token for the customer has expired.
   */
  ExpiredAuthorizationCredential = 'EXPIRED_AUTHORIZATION_CREDENTIAL',

  /**
   * The endpoint can't handle the directive because it's firmware is out of date.
   */
  FirmwareOutOfDate = 'FIRMWARE_OUT_OF_DATE',

  /**
   * The endpoint can't handle the directive because it has experienced a hardware malfunction.
   */
  HardwareMalfunction = 'HARDWARE_MALFUNCTION',

  /**
   * Alexa does not have permissions to perform the specified action on the endpoint.
   */
  InsufficientPermissions = 'INSUFFICIENT_PERMISSIONS',

  /**
   * An error occurred that can't be described by one of the other error types. For example, a runtime exception occurred. We recommend that you always send a more specific error type.
   */
  InternalError = 'INTERNAL_ERROR',

  /**
   * The authorization credential provided by Alexa is invalid. For example, the OAuth2 access token is not valid for the customer's device cloud account.
   */
  InvalidAuthorizationCredential = 'INVALID_AUTHORIZATION_CREDENTIAL',

  /**
   * The directive is not supported by the skill, or is malformed.
   */
  InvalidDirective = 'INVALID_DIRECTIVE',

  /**
   * The directive contains a value that is not valid for the target endpoint. For example, an invalid heating mode, channel, or program value.
   */
  InvalidValue = 'INVALID_VALUE',

  /**
   * The endpoint does not exist, or no longer exists.
   */
  NoSuchEndpoint = 'NO_SUCH_ENDPOINT',

  /**
   * The endpoint can't handle the directive because it is in a calibration phase, such as warming up, or a user configuration is not set up yet on the device.
   */
  NotCalibrated = 'NOT_CALIBRATED',

  /**
   * The endpoint can't be set to the specified value because of its current mode of operation. When you send this error response, include a field in the payload named currentDeviceMode that indicates why the device cannot be set to the new value. Valid values are COLOR, ASLEEP, NOT_PROVISIONED, OTHER. See an example here.
   */
  NotSupportedInCurrentMode = 'NOT_SUPPORTED_IN_CURRENT_MODE',

  /**
   * The endpoint is not in operation. For example, a smart home skill can return a NOT_IN_OPERATION error when it receives a RESUME directive but the endpoint is the OFF mode.
   */
  NotInOperation = 'NOT_IN_OPERATION',

  /**
   * The endpoint can't handle the directive because it doesn't support the requested power level.
   */
  PowerLevelNotSupported = 'POWER_LEVEL_NOT_SUPPORTED',

  /**
   * The maximum rate at which an endpoint or bridge can process directives has been exceeded.
   */
  RateLimitExceeded = 'RATE_LIMIT_EXCEEDED',

  /**
   * The endpoint can't be set to the specified value because it's outside the acceptable temperature range. When you send this error response, optionally include a validRange object in the payload that indicates the acceptable temperature range. See an example here.
   */
  TemperatureValueOutOfRange = 'TEMPERATURE_VALUE_OUT_OF_RANGE',

  /**
   * The number of allowed failed attempts, such as when entering a password, has been exceeded.
   */
  TooManyFailedAttempts = 'TOO_MANY_FAILED_ATTEMPTS',

  /**
   * The endpoint can't be set to the specified value because it's outside the acceptable range. For example, you can use this error when a customer requests a percentage value over 100. For temperature values, use TEMPERATURE_VALUE_OUT_OF_RANGE instead. When you send this error response, optionally include a validRange object in the payload that indicates the acceptable range. See an example here.
   */
  ValueOutOfRange = 'VALUE_OUT_OF_RANGE'
}
