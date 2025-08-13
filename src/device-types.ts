// Device types and capabilities for Fibaro HC3
export enum DeviceType {
  // Lighting
  LIGHT = 'com.fibaro.light',
  DIMMER = 'com.fibaro.multilevelSwitch', 
  RGB_LIGHT = 'com.fibaro.colorController',
  LED_STRIP = 'com.fibaro.ledStrip',
  
  // Switches and outlets
  WALL_PLUG = 'com.fibaro.wallPlug',
  RELAY_SWITCH = 'com.fibaro.relaySwitch',
  BINARY_SWITCH = 'com.fibaro.binarySwitch',
  
  // Sensors
  MOTION_SENSOR = 'com.fibaro.motionSensor',
  DOOR_WINDOW_SENSOR = 'com.fibaro.doorWindowSensor',
  TEMPERATURE_SENSOR = 'com.fibaro.temperatureSensor',
  HUMIDITY_SENSOR = 'com.fibaro.humiditySensor',
  LIGHT_SENSOR = 'com.fibaro.lightSensor',
  FLOOD_SENSOR = 'com.fibaro.floodSensor',
  SMOKE_SENSOR = 'com.fibaro.smokeSensor',
  CO_SENSOR = 'com.fibaro.coSensor',
  
  // Climate control
  THERMOSTAT = 'com.fibaro.thermostat',
  HVAC = 'com.fibaro.hvac',
  
  // Covers and blinds
  ROLLER_SHUTTER = 'com.fibaro.rollerShutter',
  VENETIAN_BLIND = 'com.fibaro.venetianBlind',
  GARAGE_DOOR = 'com.fibaro.garageDoor',
  
  // Security
  LOCK = 'com.fibaro.doorLock',
  SIREN = 'com.fibaro.siren',
  
  // Other
  UNKNOWN = 'unknown'
}

export interface DeviceCapabilities {
  canTurnOn: boolean;
  canTurnOff: boolean;
  canSetBrightness: boolean;
  canSetColor: boolean;
  canSetPosition: boolean;
  canSetTemperature: boolean;
  canReadValue: boolean;
  supportedProperties: string[];
  supportedActions: string[];
}

export const DEVICE_CAPABILITIES: Record<DeviceType, DeviceCapabilities> = {
  [DeviceType.LIGHT]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state'],
    supportedActions: ['turnOn', 'turnOff']
  },
  [DeviceType.DIMMER]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: true,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state', 'brightness'],
    supportedActions: ['turnOn', 'turnOff', 'setValue']
  },
  [DeviceType.RGB_LIGHT]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: true,
    canSetColor: true,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state', 'brightness', 'color'],
    supportedActions: ['turnOn', 'turnOff', 'setValue', 'setColor']
  },
  [DeviceType.LED_STRIP]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: true,
    canSetColor: true,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state', 'brightness', 'color'],
    supportedActions: ['turnOn', 'turnOff', 'setValue', 'setColor']
  },
  [DeviceType.WALL_PLUG]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state', 'power'],
    supportedActions: ['turnOn', 'turnOff']
  },
  [DeviceType.RELAY_SWITCH]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state'],
    supportedActions: ['turnOn', 'turnOff']
  },
  [DeviceType.BINARY_SWITCH]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state'],
    supportedActions: ['turnOn', 'turnOff']
  },
  [DeviceType.MOTION_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'motion', 'battery'],
    supportedActions: []
  },
  [DeviceType.DOOR_WINDOW_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state', 'battery'],
    supportedActions: []
  },
  [DeviceType.TEMPERATURE_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'temperature', 'battery'],
    supportedActions: []
  },
  [DeviceType.HUMIDITY_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'humidity', 'battery'],
    supportedActions: []
  },
  [DeviceType.LIGHT_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'lux', 'battery'],
    supportedActions: []
  },
  [DeviceType.FLOOD_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'flood', 'battery'],
    supportedActions: []
  },
  [DeviceType.SMOKE_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'smoke', 'battery'],
    supportedActions: []
  },
  [DeviceType.CO_SENSOR]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'co', 'battery'],
    supportedActions: []
  },
  [DeviceType.THERMOSTAT]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: true,
    canReadValue: true,
    supportedProperties: ['value', 'targetTemperature', 'currentTemperature', 'mode'],
    supportedActions: ['turnOn', 'turnOff', 'setTargetTemperature', 'setMode']
  },
  [DeviceType.HVAC]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: true,
    canReadValue: true,
    supportedProperties: ['value', 'targetTemperature', 'currentTemperature', 'mode'],
    supportedActions: ['turnOn', 'turnOff', 'setTargetTemperature', 'setMode']
  },
  [DeviceType.ROLLER_SHUTTER]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: true,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'position', 'state'],
    supportedActions: ['open', 'close', 'stop', 'setValue']
  },
  [DeviceType.VENETIAN_BLIND]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: true,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'position', 'slat', 'state'],
    supportedActions: ['open', 'close', 'stop', 'setValue', 'setSlat']
  },
  [DeviceType.GARAGE_DOOR]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state'],
    supportedActions: ['open', 'close', 'stop']
  },
  [DeviceType.LOCK]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state', 'battery'],
    supportedActions: ['secure', 'unsecure']
  },
  [DeviceType.SIREN]: {
    canTurnOn: true,
    canTurnOff: true,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value', 'state'],
    supportedActions: ['turnOn', 'turnOff']
  },
  [DeviceType.UNKNOWN]: {
    canTurnOn: false,
    canTurnOff: false,
    canSetBrightness: false,
    canSetColor: false,
    canSetPosition: false,
    canSetTemperature: false,
    canReadValue: true,
    supportedProperties: ['value'],
    supportedActions: []
  }
};

// Helper function to detect device type from device data
export function detectDeviceType(device: any): DeviceType {
  const type = device.type?.toLowerCase() || '';
  const baseType = device.baseType?.toLowerCase() || '';
  
  // Check exact type matches first
  for (const [key, value] of Object.entries(DeviceType)) {
    if (type === value.toLowerCase()) {
      return value as DeviceType;
    }
  }
  
  // Check partial matches and common patterns
  if (type.includes('light') || type.includes('bulb')) {
    if (type.includes('color') || type.includes('rgb')) {
      return DeviceType.RGB_LIGHT;
    } else if (type.includes('dimmer') || type.includes('multilevel')) {
      return DeviceType.DIMMER;
    } else {
      return DeviceType.LIGHT;
    }
  }
  
  if (type.includes('switch')) {
    if (type.includes('dimmer') || type.includes('multilevel')) {
      return DeviceType.DIMMER;
    } else {
      return DeviceType.BINARY_SWITCH;
    }
  }
  
  if (type.includes('sensor')) {
    if (type.includes('motion')) return DeviceType.MOTION_SENSOR;
    if (type.includes('door') || type.includes('window')) return DeviceType.DOOR_WINDOW_SENSOR;
    if (type.includes('temperature')) return DeviceType.TEMPERATURE_SENSOR;
    if (type.includes('humidity')) return DeviceType.HUMIDITY_SENSOR;
    if (type.includes('light') || type.includes('lux')) return DeviceType.LIGHT_SENSOR;
    if (type.includes('flood') || type.includes('water')) return DeviceType.FLOOD_SENSOR;
    if (type.includes('smoke')) return DeviceType.SMOKE_SENSOR;
    if (type.includes('co')) return DeviceType.CO_SENSOR;
  }
  
  if (type.includes('thermostat')) return DeviceType.THERMOSTAT;
  if (type.includes('hvac')) return DeviceType.HVAC;
  if (type.includes('roller') || type.includes('shutter')) return DeviceType.ROLLER_SHUTTER;
  if (type.includes('blind')) return DeviceType.VENETIAN_BLIND;
  if (type.includes('garage')) return DeviceType.GARAGE_DOOR;
  if (type.includes('lock')) return DeviceType.LOCK;
  if (type.includes('siren') || type.includes('alarm')) return DeviceType.SIREN;
  if (type.includes('plug') || type.includes('outlet')) return DeviceType.WALL_PLUG;
  
  return DeviceType.UNKNOWN;
}

// Get device capabilities
export function getDeviceCapabilities(deviceType: DeviceType): DeviceCapabilities {
  return DEVICE_CAPABILITIES[deviceType];
}

// Check if device supports specific action
export function canDevicePerformAction(deviceType: DeviceType, action: string): boolean {
  const capabilities = getDeviceCapabilities(deviceType);
  return capabilities.supportedActions.includes(action);
}

// Get human-readable device type name
export function getDeviceTypeName(deviceType: DeviceType): string {
  const names: Record<DeviceType, string> = {
    [DeviceType.LIGHT]: 'Light',
    [DeviceType.DIMMER]: 'Dimmer',
    [DeviceType.RGB_LIGHT]: 'RGB Light',
    [DeviceType.LED_STRIP]: 'LED Strip',
    [DeviceType.WALL_PLUG]: 'Wall Plug',
    [DeviceType.RELAY_SWITCH]: 'Relay Switch',
    [DeviceType.BINARY_SWITCH]: 'Switch',
    [DeviceType.MOTION_SENSOR]: 'Motion Sensor',
    [DeviceType.DOOR_WINDOW_SENSOR]: 'Door/Window Sensor',
    [DeviceType.TEMPERATURE_SENSOR]: 'Temperature Sensor',
    [DeviceType.HUMIDITY_SENSOR]: 'Humidity Sensor',
    [DeviceType.LIGHT_SENSOR]: 'Light Sensor',
    [DeviceType.FLOOD_SENSOR]: 'Flood Sensor',
    [DeviceType.SMOKE_SENSOR]: 'Smoke Sensor',
    [DeviceType.CO_SENSOR]: 'CO Sensor',
    [DeviceType.THERMOSTAT]: 'Thermostat',
    [DeviceType.HVAC]: 'HVAC',
    [DeviceType.ROLLER_SHUTTER]: 'Roller Shutter',
    [DeviceType.VENETIAN_BLIND]: 'Venetian Blind',
    [DeviceType.GARAGE_DOOR]: 'Garage Door',
    [DeviceType.LOCK]: 'Lock',
    [DeviceType.SIREN]: 'Siren',
    [DeviceType.UNKNOWN]: 'Unknown Device'
  };
  
  return names[deviceType] || 'Unknown Device';
}