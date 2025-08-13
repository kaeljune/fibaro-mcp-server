import axios, { AxiosInstance } from 'axios';

export interface HiagiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface BackgroundJob {
  id: string;
  name: string;
  description: string;
  trigger: JobTrigger;
  actions: JobAction[];
  enabled: boolean;
  createdAt: string;
  lastRun?: string;
  nextRun?: string;
}

export interface JobTrigger {
  type: 'schedule' | 'device_state' | 'sensor_value' | 'scene_run' | 'time_based';
  config: {
    // For schedule trigger
    cron?: string;
    
    // For device state trigger
    deviceId?: number;
    property?: string;
    condition?: 'equals' | 'greater_than' | 'less_than' | 'changed';
    value?: any;
    
    // For time-based trigger
    time?: string;
    days?: string[]; // ['monday', 'tuesday', etc.]
    
    // For sensor value trigger
    sensorId?: number;
    threshold?: number;
    
    // For scene trigger
    sceneId?: number;
  };
}

export interface JobAction {
  type: 'fibaro_device_control' | 'fibaro_scene_run' | 'notification' | 'webhook' | 'delay';
  config: {
    // For Fibaro device control
    deviceId?: number;
    action?: string;
    value?: any;
    
    // For Fibaro scene
    sceneId?: number;
    
    // For notification
    message?: string;
    channels?: string[];
    
    // For webhook
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    
    // For delay
    duration?: number; // in seconds
  };
}

export class HiagiClient {
  private client: AxiosInstance;
  private config: HiagiConfig;

  constructor(config: HiagiConfig) {
    this.config = config;
    const baseURL = config.baseUrl || 'https://api.hiagi.ai';
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  // Background Jobs Management
  async createBackgroundJob(job: Omit<BackgroundJob, 'id' | 'createdAt'>): Promise<BackgroundJob> {
    try {
      const response = await this.client.post('/v1/background-jobs', job);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create background job: ${error}`);
    }
  }

  async getBackgroundJobs(): Promise<BackgroundJob[]> {
    try {
      const response = await this.client.get('/v1/background-jobs');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get background jobs: ${error}`);
    }
  }

  async getBackgroundJob(id: string): Promise<BackgroundJob> {
    try {
      const response = await this.client.get(`/v1/background-jobs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get background job ${id}: ${error}`);
    }
  }

  async updateBackgroundJob(id: string, updates: Partial<BackgroundJob>): Promise<BackgroundJob> {
    try {
      const response = await this.client.patch(`/v1/background-jobs/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update background job ${id}: ${error}`);
    }
  }

  async deleteBackgroundJob(id: string): Promise<void> {
    try {
      await this.client.delete(`/v1/background-jobs/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete background job ${id}: ${error}`);
    }
  }

  async enableBackgroundJob(id: string): Promise<BackgroundJob> {
    try {
      const response = await this.client.post(`/v1/background-jobs/${id}/enable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enable background job ${id}: ${error}`);
    }
  }

  async disableBackgroundJob(id: string): Promise<BackgroundJob> {
    try {
      const response = await this.client.post(`/v1/background-jobs/${id}/disable`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to disable background job ${id}: ${error}`);
    }
  }

  async runBackgroundJobNow(id: string): Promise<void> {
    try {
      await this.client.post(`/v1/background-jobs/${id}/run`);
    } catch (error) {
      throw new Error(`Failed to run background job ${id}: ${error}`);
    }
  }

  // AI-powered automation suggestions
  async getAutomationSuggestions(fibaroDevices: any[]): Promise<any[]> {
    try {
      const response = await this.client.post('/v1/automation-suggestions', {
        devices: fibaroDevices,
        platform: 'fibaro_hc3'
      });
      return response.data.suggestions || [];
    } catch (error) {
      console.warn(`Failed to get automation suggestions: ${error}`);
      return [];
    }
  }

  // Device pattern analysis
  async analyzeDeviceUsage(deviceId: number, usageData: any[]): Promise<any> {
    try {
      const response = await this.client.post('/v1/device-analysis', {
        deviceId,
        usageData,
        platform: 'fibaro_hc3'
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to analyze device usage: ${error}`);
      return null;
    }
  }

  // Natural language to automation conversion
  async parseNaturalLanguageAutomation(text: string, availableDevices: any[]): Promise<any> {
    try {
      const response = await this.client.post('/v1/nl-to-automation', {
        text,
        devices: availableDevices,
        platform: 'fibaro_hc3'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to parse natural language automation: ${error}`);
    }
  }

  // Health check
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/v1/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Helper functions for creating common job types
export const JobHelpers = {
  // Create a time-based automation
  createTimeBasedJob(
    name: string,
    time: string,
    days: string[],
    actions: JobAction[]
  ): Omit<BackgroundJob, 'id' | 'createdAt'> {
    return {
      name,
      description: `Time-based automation: ${name}`,
      trigger: {
        type: 'time_based',
        config: { time, days }
      },
      actions,
      enabled: true
    };
  },

  // Create a sensor-based automation
  createSensorBasedJob(
    name: string,
    sensorId: number,
    condition: 'greater_than' | 'less_than' | 'equals',
    threshold: number,
    actions: JobAction[]
  ): Omit<BackgroundJob, 'id' | 'createdAt'> {
    return {
      name,
      description: `Sensor-based automation: ${name}`,
      trigger: {
        type: 'sensor_value',
        config: { sensorId, condition, value: threshold }
      },
      actions,
      enabled: true
    };
  },

  // Create a device state automation
  createDeviceStateJob(
    name: string,
    deviceId: number,
    property: string,
    condition: 'equals' | 'changed',
    value: any,
    actions: JobAction[]
  ): Omit<BackgroundJob, 'id' | 'createdAt'> {
    return {
      name,
      description: `Device state automation: ${name}`,
      trigger: {
        type: 'device_state',
        config: { deviceId, property, condition, value }
      },
      actions,
      enabled: true
    };
  },

  // Create actions for common scenarios
  createDeviceControlAction(deviceId: number, action: string, value?: any): JobAction {
    return {
      type: 'fibaro_device_control',
      config: { deviceId, action, value }
    };
  },

  createSceneAction(sceneId: number): JobAction {
    return {
      type: 'fibaro_scene_run',
      config: { sceneId }
    };
  },

  createNotificationAction(message: string, channels: string[] = ['push']): JobAction {
    return {
      type: 'notification',
      config: { message, channels }
    };
  },

  createDelayAction(duration: number): JobAction {
    return {
      type: 'delay',
      config: { duration }
    };
  }
};