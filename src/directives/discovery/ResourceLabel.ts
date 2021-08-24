/** Represents either an {@link AssetResourceLabel} or a {@link TextResourceLabel}. */
export type ResourceLabel = AssetResourceLabel | TextResourceLabel

/** Represents a pre-defined resource label. */
export interface AssetResourceLabel {
  '@type': 'asset'
  value: {
    /** The asset ID. */
    assetId: string
  }
}

/** Represents a custom/in-line resource label. */
export interface TextResourceLabel {
  '@type': 'text'
  value: {
    /** The localized text. */
    text: string

    /** Which locale this resource label represents.  */
    locale: Locales
  }
}

/** The list of supported locales. */
export enum Locales {
  German_Germany = 'de-DE',
  English_Australia = 'en-AU',
  English_Canada = 'en-CA',
  English_UnitedKingdom = 'en-GB',
  English_India = 'en-IN',
  English_UnitedStates = 'en-US',
  Spanish_Spain = 'es-ES',
  Spanish_Mexico = 'es-MX',
  Spanish_UnitedStates = 'es-US',
  French_Canada = 'fr-CA',
  French_France = 'fr-FR',
  Hindi_India = 'hi-IN',
  Italian_Italy = 'it-IT',
  Japanese_Japan = 'ja-JP',
  Portuguese_Brazil = 'pt_BR'
}
