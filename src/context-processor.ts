// Context processing for smart device control
import { Device } from './fibaro-client.js';
import { DeviceType, getDeviceTypeName } from './device-types.js';

export interface ContextualDeviceMatch {
  device: Device;
  confidence: number;
  matchedBy: string[];
  suggestedActions: string[];
}

export interface ProcessedContext {
  intent: DeviceIntent;
  deviceMatches: ContextualDeviceMatch[];
  parameters: Record<string, any>;
  confidence: number;
  suggestions?: string[];
}

export enum DeviceIntent {
  TURN_ON = 'turn_on',
  TURN_OFF = 'turn_off',
  SET_BRIGHTNESS = 'set_brightness',
  SET_COLOR = 'set_color',
  CONTROL_COVER = 'control_cover',
  SET_TEMPERATURE = 'set_temperature',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  GET_STATUS = 'get_status',
  GET_SENSOR_DATA = 'get_sensor_data',
  BATCH_CONTROL = 'batch_control',
  UNKNOWN = 'unknown'
}

export class ContextProcessor {
  private devices: Device[] = [];
  private rooms: Record<number, string> = {};

  constructor(devices: Device[] = [], rooms: Record<number, string> = {}) {
    this.devices = devices;
    this.rooms = rooms;
  }

  updateDevices(devices: Device[]): void {
    this.devices = devices;
  }

  updateRooms(rooms: Record<number, string>): void {
    this.rooms = rooms;
  }

  // Main context processing function
  processContext(userInput: string): ProcessedContext {
    const normalized = this.normalizeInput(userInput);
    const intent = this.detectIntent(normalized);
    const deviceMatches = this.findDeviceMatches(normalized);
    const parameters = this.extractParameters(normalized, intent);
    
    // Calculate overall confidence
    const confidence = this.calculateConfidence(intent, deviceMatches, parameters);
    
    // Generate suggestions if confidence is low
    const suggestions = confidence < 0.6 ? this.generateSuggestions(normalized) : undefined;

    return {
      intent,
      deviceMatches,
      parameters,
      confidence,
      suggestions
    };
  }

  private normalizeInput(input: string): string {
    return input.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private detectIntent(input: string): DeviceIntent {
    const patterns = {
      [DeviceIntent.TURN_ON]: [
        /\b(turn on|switch on|bật|mở)\b/,
        /\b(start|khởi động)\b.*\b(light|đèn|switch|công tắc)\b/
      ],
      [DeviceIntent.TURN_OFF]: [
        /\b(turn off|switch off|tắt|đóng)\b/,
        /\b(stop|dừng)\b.*\b(light|đèn|switch|công tắc)\b/
      ],
      [DeviceIntent.SET_BRIGHTNESS]: [
        /\b(brightness|độ sáng|dim|brighten)\b/,
        /\b(set|chỉnh|điều chỉnh)\b.*\b(\d+%|\d+ percent|level)\b/
      ],
      [DeviceIntent.SET_COLOR]: [
        /\b(color|màu|colour)\b/,
        /\b(red|green|blue|yellow|purple|pink|orange|đỏ|xanh|vàng|tím|hồng|cam)\b/
      ],
      [DeviceIntent.CONTROL_COVER]: [
        /\b(open|close|mở|đóng)\b.*\b(blind|curtain|shutter|rèm|cửa sổ)\b/,
        /\b(roller|venetian|garage)\b/
      ],
      [DeviceIntent.SET_TEMPERATURE]: [
        /\b(temperature|nhiệt độ|thermostat)\b/,
        /\b(heat|cool|warm|cold|nóng|lạnh)\b/
      ],
      [DeviceIntent.LOCK]: [
        /\b(lock|khóa|secure)\b/
      ],
      [DeviceIntent.UNLOCK]: [
        /\b(unlock|mở khóa|unsecure)\b/
      ],
      [DeviceIntent.GET_STATUS]: [
        /\b(status|trạng thái|state|check|kiểm tra)\b/,
        /\b(show|hiển thị|display|list)\b.*\b(all|tất cả)\b/
      ],
      [DeviceIntent.GET_SENSOR_DATA]: [
        /\b(sensor|cảm biến|reading|đọc)\b/,
        /\b(temperature|humidity|motion|nhiệt độ|độ ẩm|chuyển động)\b/
      ]
    };

    for (const [intent, regexList] of Object.entries(patterns)) {
      for (const regex of regexList) {
        if (regex.test(input)) {
          return intent as DeviceIntent;
        }
      }
    }

    return DeviceIntent.UNKNOWN;
  }

  private findDeviceMatches(input: string): ContextualDeviceMatch[] {
    const matches: ContextualDeviceMatch[] = [];

    for (const device of this.devices) {
      const match = this.matchDevice(device, input);
      if (match.confidence > 0.1) {
        matches.push(match);
      }
    }

    // Sort by confidence
    return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  private matchDevice(device: Device, input: string): ContextualDeviceMatch {
    const matchedBy: string[] = [];
    let confidence = 0;

    // Name matching
    const deviceName = device.name.toLowerCase();
    if (input.includes(deviceName)) {
      confidence += 0.8;
      matchedBy.push('exact_name');
    } else if (this.fuzzyMatch(deviceName, input)) {
      confidence += 0.6;
      matchedBy.push('fuzzy_name');
    }

    // ID matching
    const idMatch = input.match(/\b(?:number|số|id)\s*(\d+)\b/);
    if (idMatch && parseInt(idMatch[1]) === device.id) {
      confidence += 0.9;
      matchedBy.push('id');
    }

    // Type matching
    const deviceTypeName = getDeviceTypeName(device.deviceType!).toLowerCase();
    if (input.includes(deviceTypeName) || this.matchDeviceTypeKeywords(device.deviceType!, input)) {
      confidence += 0.4;
      matchedBy.push('type');
    }

    // Room matching
    const roomName = this.rooms[device.roomID]?.toLowerCase();
    if (roomName && input.includes(roomName)) {
      confidence += 0.5;
      matchedBy.push('room');
    }

    // Suggest actions based on device capabilities
    const suggestedActions = this.getSuggestedActions(device);

    return {
      device,
      confidence,
      matchedBy,
      suggestedActions
    };
  }

  private fuzzyMatch(target: string, input: string): boolean {
    const words = target.split(' ');
    return words.some(word => 
      word.length > 2 && input.includes(word)
    );
  }

  private matchDeviceTypeKeywords(deviceType: DeviceType, input: string): boolean {
    const keywords: Record<DeviceType, string[]> = {
      [DeviceType.LIGHT]: ['light', 'lamp', 'bulb', 'đèn'],
      [DeviceType.DIMMER]: ['dimmer', 'light', 'đèn điều chỉnh'],
      [DeviceType.RGB_LIGHT]: ['rgb', 'color light', 'đèn màu'],
      [DeviceType.LED_STRIP]: ['led strip', 'led', 'strip'],
      [DeviceType.WALL_PLUG]: ['plug', 'outlet', 'socket', 'ổ cắm'],
      [DeviceType.BINARY_SWITCH]: ['binary switch', 'switch', 'công tắc'],
      [DeviceType.RELAY_SWITCH]: ['relay', 'relay switch', 'công tắc relay'],
      [DeviceType.MOTION_SENSOR]: ['motion', 'chuyển động', 'cảm biến chuyển động'],
      [DeviceType.DOOR_WINDOW_SENSOR]: ['door', 'window', 'cửa', 'cửa sổ'],
      [DeviceType.TEMPERATURE_SENSOR]: ['temperature', 'nhiệt độ', 'cảm biến nhiệt độ'],
      [DeviceType.HUMIDITY_SENSOR]: ['humidity', 'độ ẩm'],
      [DeviceType.LIGHT_SENSOR]: ['light sensor', 'lux', 'brightness sensor'],
      [DeviceType.FLOOD_SENSOR]: ['flood', 'water', 'nước'],
      [DeviceType.SMOKE_SENSOR]: ['smoke', 'khói'],
      [DeviceType.CO_SENSOR]: ['carbon monoxide', 'co'],
      [DeviceType.THERMOSTAT]: ['thermostat', 'nhiệt độ'],
      [DeviceType.HVAC]: ['hvac', 'air conditioning', 'điều hòa'],
      [DeviceType.ROLLER_SHUTTER]: ['roller', 'shutter', 'rèm cuốn'],
      [DeviceType.VENETIAN_BLIND]: ['blind', 'venetian', 'rèm'],
      [DeviceType.GARAGE_DOOR]: ['garage', 'cửa garage'],
      [DeviceType.LOCK]: ['lock', 'khóa'],
      [DeviceType.SIREN]: ['siren', 'alarm', 'còi báo'],
      [DeviceType.UNKNOWN]: []
    };

    const deviceKeywords = keywords[deviceType] || [];
    return deviceKeywords.some(keyword => input.includes(keyword));
  }

  private extractParameters(input: string, intent: DeviceIntent): Record<string, any> {
    const params: Record<string, any> = {};

    // Extract numbers and percentages
    const numberMatch = input.match(/(\d+)%?/);
    if (numberMatch) {
      const value = parseInt(numberMatch[1]);
      
      switch (intent) {
        case DeviceIntent.SET_BRIGHTNESS:
          params.brightness = Math.min(100, Math.max(0, value));
          break;
        case DeviceIntent.SET_TEMPERATURE:
          params.temperature = value;
          break;
        case DeviceIntent.CONTROL_COVER:
          params.position = Math.min(100, Math.max(0, value));
          break;
      }
    }

    // Extract colors
    if (intent === DeviceIntent.SET_COLOR) {
      params.color = this.extractColor(input);
    }

    // Extract room information
    const roomMatch = this.extractRoom(input);
    if (roomMatch) {
      params.room = roomMatch;
    }

    // Extract action modifiers
    if (intent === DeviceIntent.CONTROL_COVER) {
      if (/\b(open|mở)\b/.test(input)) params.action = 'open';
      if (/\b(close|đóng)\b/.test(input)) params.action = 'close';
      if (/\b(stop|dừng)\b/.test(input)) params.action = 'stop';
    }

    return params;
  }

  private extractColor(input: string): string | null {
    const colorMap: Record<string, string> = {
      'red': 'red', 'đỏ': 'red',
      'green': 'green', 'xanh lá': 'green',
      'blue': 'blue', 'xanh dương': 'blue',
      'yellow': 'yellow', 'vàng': 'yellow',
      'purple': 'purple', 'tím': 'purple',
      'pink': 'pink', 'hồng': 'pink',
      'orange': 'orange', 'cam': 'orange',
      'white': 'white', 'trắng': 'white',
      'cyan': 'cyan',
      'magenta': 'magenta'
    };

    for (const [key, value] of Object.entries(colorMap)) {
      if (input.includes(key)) {
        return value;
      }
    }

    return null;
  }

  private extractRoom(input: string): string | null {
    for (const [roomId, roomName] of Object.entries(this.rooms)) {
      if (input.includes(roomName.toLowerCase())) {
        return roomName;
      }
    }

    // Common room keywords
    const roomKeywords = [
      'living room', 'bedroom', 'kitchen', 'bathroom',
      'phòng khách', 'phòng ngủ', 'nhà bếp', 'phòng tắm'
    ];

    for (const keyword of roomKeywords) {
      if (input.includes(keyword)) {
        return keyword;
      }
    }

    return null;
  }

  private getSuggestedActions(device: Device): string[] {
    const capabilities = device.capabilities;
    if (!capabilities) return [];

    const actions: string[] = [];
    
    if (capabilities.canTurnOn) actions.push('turn_on');
    if (capabilities.canTurnOff) actions.push('turn_off');
    if (capabilities.canSetBrightness) actions.push('set_brightness');
    if (capabilities.canSetColor) actions.push('set_color');
    if (capabilities.canSetPosition) actions.push('set_position');
    if (capabilities.canSetTemperature) actions.push('set_temperature');

    return actions;
  }

  private calculateConfidence(
    intent: DeviceIntent, 
    deviceMatches: ContextualDeviceMatch[], 
    parameters: Record<string, any>
  ): number {
    let confidence = 0;

    // Intent confidence
    if (intent !== DeviceIntent.UNKNOWN) {
      confidence += 0.3;
    }

    // Device match confidence
    if (deviceMatches.length > 0) {
      confidence += Math.min(0.5, deviceMatches[0].confidence);
    }

    // Parameters confidence
    if (Object.keys(parameters).length > 0) {
      confidence += 0.2;
    }

    return Math.min(1.0, confidence);
  }

  private generateSuggestions(input: string): string[] {
    const suggestions: string[] = [];

    // Suggest device searches if no clear matches
    if (!this.findDeviceMatches(input).length) {
      suggestions.push('Try using device ID like "turn on device 5"');
      suggestions.push('Specify room name like "living room lights"');
      suggestions.push('Use device type like "all sensors" or "bedroom lights"');
    }

    // Suggest valid actions
    suggestions.push('Available actions: turn on/off, set brightness, change color, open/close');
    
    return suggestions;
  }
}