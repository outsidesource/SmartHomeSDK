import { CapabilityBuilder } from './capabilityBuilder'
import { SemanticActionMapping, SemanticActionNames } from './payload'

/** Represents a builder for a {@link SemanticActionMapping}. */
export class SemanticActionBuilder {
  private actions: SemanticActionNames[] = []
  private payload: unknown | undefined

  constructor (
    private readonly parent: CapabilityBuilder,
    private readonly directiveName: string
  ) {
  }

  /**
   * Gets the parent {@link CapabilityBuilder}.
   * @returns The parent {@link CapabilityBuilder}.
   */
  getCapabilityBuilder (): CapabilityBuilder {
    return this.parent
  }

  /**
   * Generates a {@link SemanticActionMapping} based on the current configuration.
   * @returns The {@link SemanticActionMapping}.
   */
  getMapping (): SemanticActionMapping {
    if (this.actions.length === 0) {
      throw Error('At least one semantic action must be specified.')
    }

    const result = {
      '@type': 'ActionsToDirective' as const,
      actions: this.actions,
      directive: {
        name: this.directiveName,
        payload: this.payload
      }
    }

    return result
  }

  /**
   * Adds to the list of actions mapped to this interface directives.
   * @param actions The list of action names.
   * @returns This builder.
   */
  withActions (...actions: SemanticActionNames[]): this {
    this.actions = [...new Set([...this.actions, ...actions])]
    return this
  }

  /**
   * Sets the payload to send to the directive when one of the actions is invoked.
   * @param payload The payload to send to the directive.
   * @returns This builder.
   */
  withDirectivePayload (payload?: unknown): this {
    this.payload = payload
    return this
  }
}
