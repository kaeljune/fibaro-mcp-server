import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { DeviceType, detectDeviceType, getDeviceCapabilities, canDevicePerformAction } from './device-types.js';

export interface FibaroConfig {
  host: string;
  username: string;
  password: string;
  port?: number;
  protocol?: 'http' | 'https';
}

export interface Device {
  id: number;
  name: string;
  type: string;
  baseType?: string;
  roomID: number;
  enabled: boolean;
  visible: boolean;
  properties: Record<string, any>;
  interfaces?: string[];
  deviceType?: DeviceType;
  capabilities?: any;
}

export interface Scene {
  id: number;
  name: string;
  roomID: number;
  enabled: boolean;
  visible: boolean;
  isLua: boolean;
}

export interface Room {
  id: number;
  name: string;
  sectionID: number;
}

export class FibaroClient {
  private client: AxiosInstance;
  private config: FibaroConfig;

  constructor(config: FibaroConfig) {
    this.config = config;
    const protocol = config.protocol || 'https';
    const port = config.port || (protocol === 'https' ? 443 : 80);
    const baseURL = `${protocol}://${config.host}${port !== (protocol === 'https' ? 443 : 80) ? `:${port}` : ''}`;
    
    const clientConfig: any = {
      baseURL,
      auth: {
        username: config.username,
        password: config.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    // Only add https agent if using HTTPS
    if (protocol === 'https') {
      clientConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false, // For self-signed certificates
      });
    }
    
    this.client = axios.create(clientConfig);
  }

  async getDevices(): Promise<Device[]> {
    try {
      const response = await this.client.get('/api/devices');
      const devices = response.data;
      
      // Enhance devices with type detection and capabilities
      return devices.map((device: any) => {
        const deviceType = detectDeviceType(device);
        const capabilities = getDeviceCapabilities(deviceType);
        
        return {
          ...device,
          deviceType,
          capabilities
        };
      });
    } catch (error) {
      throw new Error(`Failed to get devices: ${error}`);
    }
  }

  async getDevice(id: number): Promise<Device> {
    try {
      const response = await this.client.get(`/api/devices/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get device ${id}: ${error}`);
    }
  }

  async getScenes(): Promise<Scene[]> {
    try {
      const response = await this.client.get('/api/scenes');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get scenes: ${error}`);
    }
  }

  async getScene(id: number): Promise<Scene> {
    try {
      const response = await this.client.get(`/api/scenes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get scene ${id}: ${error}`);
    }
  }

  async getRooms(): Promise<Room[]> {
    try {
      const response = await this.client.get('/api/rooms');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get rooms: ${error}`);
    }
  }

  async turnOnDevice(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/turnOn`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to turn on device ${id}: ${error}`);
    }
  }

  async turnOffDevice(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/turnOff`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to turn off device ${id}: ${error}`);
    }
  }

  async setDeviceValue(id: number, property: string, value: any): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setProperty`, {
        args: [property, value]
      });
    } catch (error) {
      throw new Error(`Failed to set device ${id} property ${property} to ${value}: ${error}`);
    }
  }

  async setBrightness(id: number, brightness: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setValue`, {
        args: [brightness]
      });
    } catch (error) {
      throw new Error(`Failed to set brightness for device ${id} to ${brightness}: ${error}`);
    }
  }

  async setColor(id: number, red: number, green: number, blue: number, white: number = 0): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setColor`, {
        args: [red, green, blue, white]
      });
    } catch (error) {
      throw new Error(`Failed to set color for device ${id} to RGB(${red},${green},${blue},${white}): ${error}`);
    }
  }

  // Roller Shutter / Blinds Control
  async openCover(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/open`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to open cover ${id}: ${error}`);
    }
  }

  async closeCover(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/close`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to close cover ${id}: ${error}`);
    }
  }

  async stopCover(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/stop`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to stop cover ${id}: ${error}`);
    }
  }

  async setCoverPosition(id: number, position: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setValue`, {
        args: [position]
      });
    } catch (error) {
      throw new Error(`Failed to set cover ${id} position to ${position}: ${error}`);
    }
  }

  async setSlatPosition(id: number, angle: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setSlat`, {
        args: [angle]
      });
    } catch (error) {
      throw new Error(`Failed to set slat angle for device ${id} to ${angle}: ${error}`);
    }
  }

  // Thermostat Control
  async setTargetTemperature(id: number, temperature: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setTargetLevel`, {
        args: [temperature]
      });
    } catch (error) {
      throw new Error(`Failed to set target temperature for device ${id} to ${temperature}: ${error}`);
    }
  }

  async setThermostatMode(id: number, mode: string): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/setMode`, {
        args: [mode]
      });
    } catch (error) {
      throw new Error(`Failed to set thermostat mode for device ${id} to ${mode}: ${error}`);
    }
  }

  // Lock Control
  async secureLock(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/secure`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to secure lock ${id}: ${error}`);
    }
  }

  async unsecureLock(id: number): Promise<void> {
    try {
      await this.client.post(`/api/devices/${id}/action/unsecure`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to unsecure lock ${id}: ${error}`);
    }
  }

  // Generic device control with validation
  async controlDevice(id: number, action: string, args: any[] = []): Promise<void> {
    try {
      // Get device info to validate action
      const device = await this.getDevice(id);
      const deviceType = device.deviceType || detectDeviceType(device);
      
      if (!canDevicePerformAction(deviceType, action)) {
        throw new Error(`Device ${id} (${deviceType}) does not support action: ${action}`);
      }

      await this.client.post(`/api/devices/${id}/action/${action}`, {
        args
      });
    } catch (error) {
      throw new Error(`Failed to control device ${id} with action ${action}: ${error}`);
    }
  }

  // Advanced device queries
  async getDevicesByType(deviceType: DeviceType): Promise<Device[]> {
    try {
      const allDevices = await this.getDevices();
      return allDevices.filter(device => device.deviceType === deviceType);
    } catch (error) {
      throw new Error(`Failed to get devices by type ${deviceType}: ${error}`);
    }
  }

  async getDevicesByRoom(roomId: number): Promise<Device[]> {
    try {
      const allDevices = await this.getDevices();
      return allDevices.filter(device => device.roomID === roomId);
    } catch (error) {
      throw new Error(`Failed to get devices by room ${roomId}: ${error}`);
    }
  }

  async getDevicesByCapability(capability: keyof import('./device-types.js').DeviceCapabilities): Promise<Device[]> {
    try {
      const allDevices = await this.getDevices();
      return allDevices.filter(device => {
        if (!device.capabilities) return false;
        return device.capabilities[capability] === true;
      });
    } catch (error) {
      throw new Error(`Failed to get devices by capability ${capability}: ${error}`);
    }
  }

  // Sensor data reading
  async getSensorValue(id: number, property: string = 'value'): Promise<any> {
    try {
      const device = await this.getDevice(id);
      return device.properties[property];
    } catch (error) {
      throw new Error(`Failed to get sensor value for device ${id}: ${error}`);
    }
  }

  // Batch operations
  async batchControl(operations: Array<{deviceId: number, action: string, args?: any[]}>): Promise<void> {
    try {
      const promises = operations.map(op => 
        this.controlDevice(op.deviceId, op.action, op.args || [])
      );
      await Promise.all(promises);
    } catch (error) {
      throw new Error(`Failed to execute batch operations: ${error}`);
    }
  }

  async runScene(id: number): Promise<void> {
    try {
      await this.client.post(`/api/scenes/${id}/action/start`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to run scene ${id}: ${error}`);
    }
  }

  async stopScene(id: number): Promise<void> {
    try {
      await this.client.post(`/api/scenes/${id}/action/stop`, {
        args: []
      });
    } catch (error) {
      throw new Error(`Failed to stop scene ${id}: ${error}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/api/loginStatus');
      return true;
    } catch (error) {
      return false;
    }
  }
}