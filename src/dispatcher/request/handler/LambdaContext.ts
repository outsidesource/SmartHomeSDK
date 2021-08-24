/** Context information in which the lambda is operating. */
export interface LambdaContext {
  /** The name of the Lambda function. */
  functionName: string

  /** The version of the function. */
  functionVersion: string

  /** The amount of memory that's allocated for the function. */
  memoryLimitInMB: string

  /** The log group for the function. */
  logGroupName: string

  /** The log stream for the function instance. */
  logStreamName: string

  /** (mobile apps) Client context that's provided to Lambda by the client application. */
  clientContext?: {
    client: {
      installation_id: string
      app_title: string
      app_version_name: string
      app_version_code: string
      app_package_name: string
    }
    env: {
      platform_version: string
      platform: string
      make: string
      model: string
      locale: string
    }

    /** Custom values that are set by the client application. */
    Custom?: unknown
  }

  /** (mobile apps) Information about the Amazon Cognito identity that authorized the request. */
  identity?: {
    /** The authenticated Amazon Cognito identity. */
    cognitoIdentityId: string

    /** The Amazon Cognito identity pool that authorized the invocation. */
    cognitoIdentityPoolId: string
  }

  /** The Amazon Resource Name (ARN) that's used to invoke the function. Indicates if the invoker specified a version number or alias. */
  invokedFunctionArn: string

  /** The identifier of the invocation request. */
  awsRequestId: string

  /** Returns the number of milliseconds left before the execution times out. */
  getRemainingTimeInMillis(): number

  /** Set to false to send the response right away when the callback runs, instead of waiting for the Node.js event loop to be empty. If this is false, any outstanding events continue to run during the next invocation. */
  callbackWaitsForEmptyEventLoop: boolean
}
