import { ResponsePayload } from '../../response/Response'
import { ResourceLabel } from './ResourceLabel'

/** Represents the payload for a collection of endpoints associated with the skill. */
export interface DiscoveryResponsePayload extends ResponsePayload {
  endpoints: DiscoveryEndpoint[]
}

/**
 * Represents a connected device or component. This can be a physical device, 
 * a virtual device, a group or cluster of devices (such as in a scene), 
 * or a software component.
 * {@see https://developer.amazon.com/en-US/docs/alexa/device-apis/alexa-discovery-objects.html#endpoint-object}
 */
export interface DiscoveryEndpoint {
  /** 
   * The identifier for the endpoint. The identifier must be unique 
   * across all devices for the skill. The identifier must be consistent 
   * for all discovery requests for the same device. 
   */
  endpointId: string,

  /** The name of the manufacturer of the device. */
  manufacturerName: string,

  /** 
   * The description of the device. The description should contain 
   * the manufacturer name or how the device connects. 
   */
  description: string,

  /** 
   * The name used by the user to identify the device. You set 
   * an initial value, and later the user can change the friendly name 
   * by using the Alexa app. 
   */
  friendlyName: string,

  /** In the Alexa app, the category that your device is displayed in. */
  displayCategories: DisplayCategories[],

  /** Additional information to identify very similar devices. */
  additionalAttributes?: AdditionalAttributes,

  /** The capability interfaces that your skill supports for the endpoint. */
  capabilities: EndpointCapability[],

  /** 
   * Information about the methods that the device uses to connect 
   * to the internet and smart home hubs. 
   */
  connections?: DiscoveryConnection[],

  /** 
   * The endpoints that an endpoint is connected to. For example, 
   * a computer endpoint might be connected to a home network endpoint. 
   */
  relationships?: {
    [key: string]: {
      endpointId: string,
    },
  },

  /** Information about the device that your skill uses. */
  cookie?: {
    [key: string]: string
  },
}

/** Additional information to identify very similar devices. */
export interface AdditionalAttributes {
  /** The name of the manufacturer of the device. */
  manufacturer?: string,

  /** 
   * The name of the model of the device as advertised to customers. 
   * The model should uniquely identify the specific variant of a product. 
   */
  model?: string,

  /** The serial number of the device. */
  serialNumber?: string,

  /** The firmware version of the device. */
  firmwareVersion?: string,

  /** The software version of the device. */
  softwareVersion?: string,

  /** 
   * Your custom identifier for the device. This identifier should be 
   * globally unique across different user accounts. 
   */
  customIdentifier?: string,
}

/**
 * The categories in which a device will appear.
 */
export enum DisplayCategories {
  /**
   * A combination of devices set to a specific state. Use activity triggers for scenes when the state changes must occur in a specific order. For example, for a scene named "watch Netflix" you might power on the TV first, and then set the input to HDMI1.
   */
  ActivityTrigger = 'ACTIVITY_TRIGGER',

  /**
   * A device that emits pleasant odors and masks unpleasant odors in interior spaces.
   */
  AirFreshener = 'AIR_FRESHENER',

  /**
   * A device that improves the quality of air in interior spaces.
   */
  AirPurifier = 'AIR_PURIFIER',

  /**
   * A smart device in an automobile, such as a dash camera.
   */
  AutoAccessory = 'AUTO_ACCESSORY',

  /**
   * A security device with video or photo functionality.
   */
  Camera = 'CAMERA',

  /**
   * A religious holiday decoration that often contains lights.
   */
  ChristmasTree = 'CHRISTMAS_TREE',

  /**
   * A device that makes coffee.
   */
  CoffeeMaker = 'COFFEE_MAKER',

  /**
   * A non-mobile computer, such as a desktop computer.
   */
  Computer = 'COMPUTER',

  /**
   * An endpoint that detects and reports changes in contact between two surfaces.
   */
  ContactSensor = 'CONTACT_SENSOR',

  /**
   * A door.
   */
  Door = 'DOOR',

  /**
   * A doorbell.
   */
  Doorbell = 'DOORBELL',

  /**
   * A window covering, such as blinds or shades, on the outside of a structure.
   */
  ExteriorBlind = 'EXTERIOR_BLIND',

  /**
   * A fan.
   */
  Fan = 'FAN',

  /**
   * A game console, such as Microsoft Xbox or Nintendo Switch
   */
  GameConsole = 'GAME_CONSOLE',

  /**
   * A garage door. Garage doors must implement the ModeController interface to open and close the door.
   */
  GarageDoor = 'GARAGE_DOOR',

  /**
   * A wearable device that transmits audio directly into the ear.
   */
  Headphones = 'HEADPHONES',

  /**
   * A smart-home hub.
   */
  Hub = 'HUB',

  /**
   * A window covering, such as blinds or shades, on the inside of a structure.
   */
  InteriorBlind = 'INTERIOR_BLIND',

  /**
   * A laptop or other mobile computer.
   */
  Laptop = 'LAPTOP',

  /**
   * A light source or fixture.
   */
  Light = 'LIGHT',

  /**
   * A microwave oven.
   */
  Microwave = 'MICROWAVE',

  /**
   * A mobile phone.
   */
  MobilePhone = 'MOBILE_PHONE',

  /**
   * An endpoint that detects and reports movement in an area.
   */
  MotionSensor = 'MOTION_SENSOR',

  /**
   * A network-connected music system.
   */
  MusicSystem = 'MUSIC_SYSTEM',

  /**
   * A network router.
   */
  NetworkHardware = 'NETWORK_HARDWARE',

  /**
   * An endpoint that doesn't belong to one of the other categories.
   */
  Other = 'OTHER',

  /**
   * An oven cooking appliance.
   */
  Oven = 'OVEN',

  /**
   * A non-mobile phone, such as landline or an IP phone.
   */
  Phone = 'PHONE',

  /**
   * A device that prints.
   */
  Printer = 'PRINTER',

  /**
   * A network router.
   */
  Router = 'ROUTER',

  /**
   * A combination of devices set to a specific state. Use scene triggers for scenes when the order of the state change is not important. For example, for a scene named "bedtime" you might turn off the lights and lower the thermostat, in any order.
   */
  SceneTrigger = 'SCENE_TRIGGER',

  /**
   * A projector screen.
   */
  Screen = 'SCREEN',

  /**
   * A security panel.
   */
  SecurityPanel = 'SECURITY_PANEL',

  /**
   * A security system.
   */
  SecuritySystem = 'SECURITY_SYSTEM',

  /**
   * An electric cooking device that sits on a countertop, cooks at low temperatures, and is often shaped like a cooking pot.
   */
  SlowCooker = 'SLOW_COOKER',

  /**
   * An endpoint that locks.
   */
  Smartlock = 'SMARTLOCK',

  /**
   * A module that is plugged into an existing electrical outlet, and then has a device plugged into it. For example, a user can plug a smart plug into an outlet, and then plug a lamp into the smart plug. A smart plug can control a variety of devices.
   */
  Smartplug = 'SMARTPLUG',

  /**
   * A speaker or speaker system.
   */
  Speaker = 'SPEAKER',

  /**
   * A streaming device such as Apple TV, Chromecast, or Roku.
   */
  StreamingDevice = 'STREAMING_DEVICE',

  /**
   * A switch wired directly to the electrical system. A switch can control a variety of devices.
   */
  Switch = 'SWITCH',

  /**
   * A tablet computer.
   */
  Tablet = 'TABLET',

  /**
   * An endpoint that reports temperature, but does not control it. The temperature data of the endpoint doesn't appear in the Alexa app. If your endpoint also controls temperature, use THERMOSTAT instead.
   */
  TemperatureSensor = 'TEMPERATURE_SENSOR',

  /**
   * An endpoint that controls temperature, stand-alone air conditioners, or heaters with direct temperature control. If your endpoint senses temperature but does not control it, use TEMPERATURE_SENSOR instead.
   */
  Thermostat = 'THERMOSTAT',

  /**
   * A television.
   */
  TV = 'TV',

  /**
   * A vacuum cleaner.
   */
  VacuumCleaner = 'VACUUM_CLEANER',

  /**
   * A motor vehicle (automobile, car).
   */
  Vehicle = 'VEHICLE',

  /**
   * A device that heats water, often consisting of a large tank.
   */
  WaterHeater = 'WATER_HEATER',

  /**
   * A network-connected wearable device, such as an Apple Watch, Fitbit, or Samsung Gear.
   */
  Wearable = 'WEARABLE',
}

/** Represents an interface that the device/endpoint supports. */
export interface EndpointCapability {
  /** The type of capability. Currently, the only available type is AlexaInterface. */
  type: 'AlexaInterface',

  /** The name of the capability interface. */
  interface: string,

  /** 
   * You can implement multiple instances of some interfaces. In that case, 
   * you give each instance of the interface a unique name. 
   */
  instance?: string,

  /** 
   * The version of the interface. Different interfaces have different versions 
   * from each other. 
   */
  version: string,

  /** The properties of the interface that your skill supports. */
  properties?: CapabilityProperties,

  /** Friendly names that users can use to interact with some interfaces. */
  capabilityResources?: {
    friendlyNames: ResourceLabel[],
  },

  /** A configuration object that contains information about how you are using an interface. */
  configuration?: unknown,

  /** You can optionally map the words open, close, raise, and lower to existing directives, for some interfaces. */
  semantics?: {
    /** The mappings used when the user is changing what the interface represents. */
    actionMappings: SemanticActionMapping[],

    /** The mappings used when the user is inquiring the state of an interface. */
    stateMappings: SemanticStateMapping[],
  },

  /** You can optionally require the user to verify an action before Alexa performs it, for some interfaces and locales. */
  verificationsRequired?: Array<{
    /** 
     * The name of the directive to require verification for. The directive must 
     * be a directive of the interface in the capability object that the 
     * verificationsRequired object is included in.
     */
    directive: string,

    /** 
     * The methods for obtaining user verification. Currently the only 
     * supported verification method is Confirmation. 
     */
    methods: Array<{
      '@type': 'Confirmation',
    }>,
  }>,
}

/** The properties of the interface that the skill supports. */
export interface CapabilityProperties {
  /** The properties of the interface that the skill supports. */
  supported?: Array<{ name: string }>,

  /** True if the skill sends change reports when the properties change. The default is false. */
  proactivelyReported?: boolean,

  /** True if the skill responds to state report requests and reports the values of the properties. The default is false. */
  retrievable?: boolean,

  /** True if the interface's properties are readonly. The default is false. */
  nonControllable?: boolean,
}

/** Represents an action mapping. */
export interface SemanticActionMapping {
  '@type': 'ActionsToDirective',
  /** The actions that map to this semantic. */
  actions: SemanticActionNames[],
  directive: {
    /** 
     * The name of the directive. The directive must be a directive 
     * of the interface in the capability object that the semantics 
     * object is included in. 
     */
    name: string,

    /** The payload appropriate for the directive. */
    payload?: unknown,
  },
}

/** Predefined semantic names for action mappings. */
export enum SemanticActionNames {
  Open = 'Alexa.Actions.Open',
  Close = 'Alexa.Actions.Close',
  Raise = 'Alexa.Actions.Raise',
  Lower = 'Alexa.Actions.Lower',
  SetEcoOn = 'Alexa.Actions.SetEcoOn',
  SetEcoOff = 'Alexa.Actions.SetEcoOff',
  EcoOn = 'Alexa.Actions.EcoOn',
  EcoOff = 'Alexa.Actions.EcoOff',
}

/** Represents a state mapping. */
export type SemanticStateMapping = SemanticStateValueMapping | SemanticStateRangeMapping

/** Represents a state value mapping. */
export interface SemanticStateValueMapping {
  '@type': 'StatesToValue',

  /** The states that map to this semantic. */
  states: SemanticStateNames[],

  /** The value that maps to this semantic. */
  value: number | string,
}

/** Represents a state range mapping. */
export interface SemanticStateRangeMapping {
  '@type': 'StatesToRange',

  /** The states that map to this semantic. */
  states: SemanticStateNames[],

  /** The range of values that map to this semantic. */
  range: {
    minimumValue: number,
    maximumValue: number,
  },
}

/** Predefined semantic names for state mappings. */
export enum SemanticStateNames {
  Open = 'Alexa.States.Open',
  Closed = 'Alexa.States.Closed',
  EcoOn = 'Alexa.States.EcoOn',
  EcoOff = 'Alexa.States.EcoOff',
}

/** Represents a connection method for the device(s) represented. */
export type DiscoveryConnection = StandardDiscoveryConnection | ZWaveDiscoverConnection | UnknownDiscoveryConnection

/** Represents a standard NIC or Zigbee. */
export interface StandardDiscoveryConnection {
  type: 'TCP_IP' | 'ZIGBEE',
  macAddress?: string,
}

/** Represents a Z-Wave network. */
export interface ZWaveDiscoverConnection {
  type: 'ZWAVE',
  homeId?: string,
  nodeId?: string,
}

/** Represents an unknown or non-standard connection. */
export interface UnknownDiscoveryConnection {
  type: 'UNKNOWN',
  value: string,
}
