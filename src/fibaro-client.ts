import axios, { AxiosInstance } from 'axios';
import * as https from 'https';

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
  roomID: number;
  enabled: boolean;
  visible: boolean;
  properties: Record<string, any>;
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
      return response.data;
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