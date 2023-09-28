import { type DiscoveryEndpointBuilder } from './endpointBuilder'
import { type EndpointCapability } from './payload'
import { PropertiesBuilder } from './propertiesBuilder'
import { type Locales, type ResourceLabel } from './resourceLabel'
import { SemanticActionBuilder } from './semanticActionBuilder'
import { SemanticStateBuilder } from './semanticStateBuilder'

/** Represents a builder for an {@link EndpointCapability}. */
export class CapabilityBuilder {
  private instance: string | undefined
  private propertiesBuilder: PropertiesBuilder | undefined
  private readonly resourceFriendlyNames: ResourceLabel[] = []
  private configuration: unknown | undefined
  private readonly semanticActionBuilders: SemanticActionBuilder[] = []
  private readonly semanticStateBuilders: SemanticStateBuilder[] = []
  private readonly verifications: string[] = []

  constructor (
    private readonly parent: DiscoveryEndpointBuilder,
    private readonly interfaceName: string,
    private readonly version: string
  ) {
  }

  /**
   * Gets the parent {@link DiscoveryEndpointBuilder}.
   * @returns The parent {@link DiscoveryEndpointBuilder}.
   */
  getEndpointBuilder (): DiscoveryEndpointBuilder {
    return this.parent
  }

  /**
   * Generates an {@link EndpointCapability} based on the current configuration.
   * @returns The {@link EndpointCapability}.
   */
  getCapability (): EndpointCapability {
    const properties = this.propertiesBuilder?.getProperties()

    const capabilityResources =
      this.resourceFriendlyNames.length === 0
        ? undefined
        : { friendlyNames: this.resourceFriendlyNames }

    const semantics =
      this.semanticActionBuilders.length === 0 &&
      this.semanticStateBuilders.length === 0
        ? undefined
        : {
            actionMappings: this.semanticActionBuilders.map(builder =>
              builder.getMapping()
            ),
            stateMappings: this.semanticStateBuilders.map(builder =>
              builder.getMapping()
            )
          }

    const verificationsRequired =
      this.verifications.length === 0
        ? undefined
        : this.verifications.map(directive => {
          return {
            directive,
            methods: [{ '@type': 'Confirmation' as const }]
          }
        })

    return {
      type: 'AlexaInterface' as const,
      interface: this.interfaceName,
      instance: this.instance,
      version: this.version,
      properties,
      capabilityResources,
      configuration: this.configuration,
      semantics,
      verificationsRequired
    }
  }

  /**
   * Sets the instance name for a generic controller interface since you can implement multiple instances of some interfaces.
   * @param instance The instance name.
   * @returns This builder.
   */
  withInstance (instance: string): this {
    this.instance = instance
    return this
  }

  /**
   * Adds a builder for setting properties for the interface.
   * @returns A builder for a {@link CapabilityProperties}.
   */
  addProperties (): PropertiesBuilder {
    if (this.propertiesBuilder === undefined) {
      this.propertiesBuilder = new PropertiesBuilder(this)
    }
    return this.propertiesBuilder
  }

  /**
   * Adds a predefined friendly name that users can use to more naturally interact with an interface.
   * @param assetId The ID of the predefined friendly name.
   * @returns This builder.
   */
  withAssetResource (assetId: string): this {
    this.resourceFriendlyNames.push({
      '@type': 'asset',
      value: {
        assetId
      }
    })
    return this
  }

  // TODO: Possibly add method for custom asset IDs when a catalog is available

  /**
   * Adds a custom friendly name that users can use to more naturally interact with an interface.
   * @param text The friendly name.
   * @param locale The locale that the friendly name is defined for.
   * @returns This builder.
   */
  withTextResource (text: string, locale: Locales): this {
    this.resourceFriendlyNames.push({
      '@type': 'text',
      value: {
        text,
        locale
      }
    })
    return this
  }

  /**
   * Sets an object that contains configuration data needed for the interface.
   * @param configuration An object that contains configuration data.
   * @returns This builder.
   */
  withConfiguration (configuration: unknown): this {
    this.configuration = configuration
    return this
  }

  /**
   * Adds a semantic mapping for invoking actions on an interface.
   * @returns A builder for a {@link SemanticActionMapping}.
   */
  addSemanticAction (directiveName: string): SemanticActionBuilder {
    const actionBuilder = new SemanticActionBuilder(this, directiveName)
    this.semanticActionBuilders.push(actionBuilder)
    return actionBuilder
  }

  /**
   * Adds a semantic mapping for inquiring about an interface's state.
   * @returns A builder for a {@link SemanticStateMapping}.
   */
  addSemanticState (): SemanticStateBuilder {
    const stateBuilder = new SemanticStateBuilder(this)
    this.semanticStateBuilders.push(stateBuilder)
    return stateBuilder
  }

  /**
   * Adds to the list of directives that the user is required to verify.
   * @param directive The name of the directive that requires verification.
   * @returns This builder.
   */
  withVerification (directive: string): this {
    this.verifications.push(directive)
    return this
  }
}
