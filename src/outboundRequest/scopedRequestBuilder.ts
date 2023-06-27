import { Scope } from '../util/types'
import { SmartHomeSkillRequestBuilder } from './baseRequestBuilder'

/**
 * A base implementation for request builders that require a {@link Scope}.
 */
export abstract class ScopedSmartHomeSkillRequestBuilder<TPayload> extends SmartHomeSkillRequestBuilder<TPayload> {
  private token?: string
  private partition?: string
  private userId?: string

  /**
   * Generates a {@link Scope} based on the current configuration.
   * @returns The {@link Scope}.
   */
  protected getScope (): Scope {
    if (this.token !== undefined && this.token !== '') {
      if (this.partition !== undefined && this.partition !== '' && this.userId !== undefined && this.userId !== '') {
        return {
          type: 'BearerTokenWithPartition' as const,
          token: this.token,
          partition: this.partition,
          userId: this.userId
        }
      } else {
        return {
          type: 'BearerToken' as const,
          token: this.token
        }
      }
    }

    throw Error('A token is required.')
  }

  /**
   * Sets an OAuth 2 bearer token with no partition.
   * @param token The LWA token associated with the user.
   * @returns This builder.
   */
  withSimpleToken (token: string): this {
    this.token = token
    this.partition = undefined
    this.userId = undefined
    return this
  }

  /**
   * Sets an OAuth 2 bearer token with a partition.
   * @param token The LWA token associated with the user.
   * @param partition The location target for the request such as a room name or number.
   * @param userId A unique identifier for the user. Don't rely on {@link userId} to identify users, use {@link token} instead.
   * @returns This builder.
   */
  withPartitionedToken (token: string, partition: string, userId: string): this {
    this.token = token
    this.partition = partition
    this.userId = userId
    return this
  }
}
