/** Represents a Bearer token. */
export type Scope = BearerTokenScope | BearerTokenWithPartitionScope

/** Represents a simple Bearer token. */
export interface BearerTokenScope {
  type: 'BearerToken'

  /** The token for identifying and accessing a linked user account. */
  token: string
}

/** Represents a partitioned Bearer token. */
export interface BearerTokenWithPartitionScope {
  type: 'BearerTokenWithPartition'

  /** The token for identifying and accessing a linked user account. */
  token: string

  /** The location target for the request such as a room name or number. */
  partition: string

  /** A unique identifier for the user who made the request. Don't rely on {@link userId} to identify users, use {@link token} instead. */
  userId: string
}

/** Represents addition information pertinent to the request. */
export interface Context {
  /** Contains information about an interface's property values. */
  properties?: PropertyState[]
}

/** Represents an interface's property values. */
export interface PropertyState {
  /**
   * The type of controller. This should match the
   * `capabilities[i].interface` value given at discovery.
   */
  namespace: string

  /**
   * The name of the instance. This should match the
   * `capabilities[i].instance` value given at discovery.
   */
  instance?: string

  /**
   * The name of the property. This should match the
   * `capabilities[i].properties.supported[j].name` value
   * given at discovery.
   */
  name: string

  /** The value of the property. */
  value: unknown

  /** The date/time when the property was sampled. This should be an ISO-8601 string of the date/time with zero offset. */
  timeOfSample: string

  /** The uncertainty of the value in milliseconds. */
  uncertaintyInMilliseconds: number
}

export interface PropState extends Omit<PropertyState, 'timeOfSample'> {
  /** The date/time when the property was sampled. */
  timeOfSample: Date
}
