#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FibaroClient, FibaroConfig } from './fibaro-client.js';

// Helper function to convert color names to RGB values
function getColorRGB(colorName: string): { r: number; g: number; b: number } {
  const colors: { [key: string]: { r: number; g: number; b: number } } = {
    'red': { r: 255, g: 0, b: 0 },
    'green': { r: 0, g: 255, b: 0 },
    'blue': { r: 0, g: 0, b: 255 },
    'yellow': { r: 255, g: 255, b: 0 },
    'purple': { r: 128, g: 0, b: 128 },
    'pink': { r: 255, g: 192, b: 203 },
    'orange': { r: 255, g: 165, b: 0 },
    'cyan': { r: 0, g: 255, b: 255 },
    'magenta': { r: 255, g: 0, b: 255 },
    'white': { r: 255, g: 255, b: 255 },
    'black': { r: 0, g: 0, b: 0 },
    'lime': { r: 50, g: 205, b: 50 },
    'violet': { r: 238, g: 130, b: 238 },
    // Vietnamese color names
    'đỏ': { r: 255, g: 0, b: 0 },
    'xanh lá': { r: 0, g: 255, b: 0 },
    'xanh dương': { r: 0, g: 0, b: 255 },
    'vàng': { r: 255, g: 255, b: 0 },
    'tím': { r: 128, g: 0, b: 128 },
    'hồng': { r: 255, g: 192, b: 203 },
    'cam': { r: 255, g: 165, b: 0 },
    'trắng': { r: 255, g: 255, b: 255 },
    'đen': { r: 0, g: 0, b: 0 }
  };
  
  const normalizedName = colorName.toLowerCase().trim();
  return colors[normalizedName] || { r: 255, g: 255, b: 255 }; // default to white
}

class FibaroMCPServer {
  private server: Server;
  private fibaroClient: FibaroClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'fibaro-hc3-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
    this.initializeFibaroClient();
  }

  private async initializeFibaroClient(): Promise<void> {
    const host = process.env.FIBARO_HOST;
    const username = process.env.FIBARO_USERNAME;
    const password = process.env.FIBARO_PASSWORD;
    const protocol = (process.env.FIBARO_PROTOCOL as 'http' | 'https') || 'https';
    const port = process.env.FIBARO_PORT ? parseInt(process.env.FIBARO_PORT) : (protocol === 'https' ? 443 : 80);

    if (host && username && password) {
      const config: FibaroConfig = {
        host,
        username,
        password,
        port,
        protocol,
      };

      this.fibaroClient = new FibaroClient(config);
      
      try {
        const isConnected = await this.fibaroClient.testConnection();
        if (isConnected) {
          console.error(`✅ Connected to Fibaro HC3 at ${protocol}://${host}:${port}`);
        } else {
          console.error(`❌ Failed to connect to Fibaro HC3 at ${protocol}://${host}:${port}`);
          this.fibaroClient = null;
        }
      } catch (error) {
        console.error(`❌ Error connecting to Fibaro HC3: ${error}`);
        this.fibaroClient = null;
      }
    } else {
      console.error('❌ Fibaro HC3 configuration not found in environment variables');
    }
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'fibaro_get_devices',
            description: 'Get all devices from Fibaro HC3',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'fibaro_get_device',
            description: 'Get specific device by ID from Fibaro HC3',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'fibaro_get_scenes',
            description: 'Get all scenes from Fibaro HC3',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'fibaro_get_scene',
            description: 'Get specific scene by ID from Fibaro HC3',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Scene ID',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'fibaro_get_rooms',
            description: 'Get all rooms from Fibaro HC3',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'fibaro_turn_on_device',
            description: 'Turn on a device (like lights, switches)',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID to turn on',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'fibaro_turn_off_device',
            description: 'Turn off a device (like lights, switches)',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID to turn off',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'fibaro_set_device_value',
            description: 'Set a specific property value for a device. Use this ONLY for advanced properties like temperature setpoints, modes, or custom device properties. Do NOT use for brightness (use fibaro_set_brightness) or colors (use fibaro_set_color).',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID',
                },
                property: {
                  type: 'string',
                  description: 'Property name to set (e.g., "targetTemperature", "mode", "state")',
                },
                value: {
                  type: ['string', 'number', 'boolean'],
                  description: 'Value to set',
                },
              },
              required: ['id', 'property', 'value'],
            },
          },
          {
            name: 'fibaro_set_brightness',
            description: 'Set brightness or dimmer level for lights and dimmable devices. Use this when user mentions brightness, dimming, intensity, or percentage levels (0-100%). Keywords: bright, dim, brightness, level, percent, %.',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID',
                },
                brightness: {
                  type: 'number',
                  description: 'Brightness level (0-100)',
                  minimum: 0,
                  maximum: 100,
                },
              },
              required: ['id', 'brightness'],
            },
          },
          {
            name: 'fibaro_set_color',
            description: 'Set RGB color for RGB lights and color-changing devices. Use this when user mentions colors, color names, or wants to change light color. Keywords: color, red, green, blue, yellow, purple, pink, orange, cyan, magenta, white, RGB, màu.',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID',
                },
                red: {
                  type: 'number',
                  description: 'Red color value (0-255)',
                  minimum: 0,
                  maximum: 255,
                },
                green: {
                  type: 'number',
                  description: 'Green color value (0-255)',
                  minimum: 0,
                  maximum: 255,
                },
                blue: {
                  type: 'number',
                  description: 'Blue color value (0-255)',
                  minimum: 0,
                  maximum: 255,
                },
                white: {
                  type: 'number',
                  description: 'White color value (0-255), optional',
                  minimum: 0,
                  maximum: 255,
                },
              },
              required: ['id', 'red', 'green', 'blue'],
            },
          },
          {
            name: 'fibaro_control_rgb_light',
            description: 'Complete control for RGB lights: turn on/off, set color, and brightness in one command. Use this when user wants to control multiple aspects of an RGB light at once (e.g., "turn on light 5 red color at 50% brightness").',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Device ID',
                },
                action: {
                  type: 'string',
                  enum: ['on', 'off'],
                  description: 'Turn light on or off',
                },
                color_name: {
                  type: 'string',
                  description: 'Color name (e.g., "red", "green", "blue", "xanh lá", "tím")',
                },
                brightness: {
                  type: 'number',
                  description: 'Brightness level (0-100), optional',
                  minimum: 0,
                  maximum: 100,
                },
              },
              required: ['id', 'action'],
            },
          },
          {
            name: 'fibaro_run_scene',
            description: 'Run/start a scene',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Scene ID to run',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'fibaro_stop_scene',
            description: 'Stop a running scene',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Scene ID to stop',
                },
              },
              required: ['id'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'fibaro_get_devices': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const devices = await this.fibaroClient.getDevices();
            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${devices.length} devices:\n\n${devices
                    .map(d => `ID: ${d.id} - ${d.name} (${d.type}) - Room: ${d.roomID}`)
                    .join('\n')}`,
                },
              ],
            };
          }

          case 'fibaro_get_device': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const device = await this.fibaroClient.getDevice(args?.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: `Device ${device.id}:\nName: ${device.name}\nType: ${device.type}\nRoom ID: ${device.roomID}\nEnabled: ${device.enabled}\nVisible: ${device.visible}\nProperties: ${JSON.stringify(device.properties, null, 2)}`,
                },
              ],
            };
          }

          case 'fibaro_get_scenes': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const scenes = await this.fibaroClient.getScenes();
            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${scenes.length} scenes:\n\n${scenes
                    .map(s => `ID: ${s.id} - ${s.name} - Room: ${s.roomID}`)
                    .join('\n')}`,
                },
              ],
            };
          }

          case 'fibaro_get_scene': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const scene = await this.fibaroClient.getScene(args?.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: `Scene ${scene.id}:\nName: ${scene.name}\nRoom ID: ${scene.roomID}\nEnabled: ${scene.enabled}\nVisible: ${scene.visible}\nIs Lua: ${scene.isLua}`,
                },
              ],
            };
          }

          case 'fibaro_get_rooms': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const rooms = await this.fibaroClient.getRooms();
            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${rooms.length} rooms:\n\n${rooms
                    .map(r => `ID: ${r.id} - ${r.name} - Section: ${r.sectionID}`)
                    .join('\n')}`,
                },
              ],
            };
          }

          case 'fibaro_turn_on_device': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const deviceId = args?.id as number;
            await this.fibaroClient.turnOnDevice(deviceId);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully turned on device ${deviceId}`,
                },
              ],
            };
          }

          case 'fibaro_turn_off_device': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const deviceId = args?.id as number;
            await this.fibaroClient.turnOffDevice(deviceId);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully turned off device ${deviceId}`,
                },
              ],
            };
          }

          case 'fibaro_set_device_value': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const deviceId = args?.id as number;
            const property = args?.property as string;
            const value = args?.value;
            await this.fibaroClient.setDeviceValue(deviceId, property, value);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully set device ${deviceId} property '${property}' to '${value}'`,
                },
              ],
            };
          }

          case 'fibaro_set_brightness': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const deviceId = args?.id as number;
            const brightness = args?.brightness as number;
            await this.fibaroClient.setBrightness(deviceId, brightness);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully set brightness for device ${deviceId} to ${brightness}%`,
                },
              ],
            };
          }

          case 'fibaro_set_color': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const deviceId = args?.id as number;
            const red = args?.red as number;
            const green = args?.green as number;
            const blue = args?.blue as number;
            const white = args?.white as number || 0;
            await this.fibaroClient.setColor(deviceId, red, green, blue, white);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully set color for device ${deviceId} to RGB(${red},${green},${blue},${white})`,
                },
              ],
            };
          }

          case 'fibaro_control_rgb_light': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const deviceId = args?.id as number;
            const action = args?.action as string;
            const colorName = args?.color_name as string;
            const brightness = args?.brightness as number;

            const results = [];

            // First, turn on/off the light
            if (action === 'on') {
              await this.fibaroClient.turnOnDevice(deviceId);
              results.push(`Turned on device ${deviceId}`);
            } else if (action === 'off') {
              await this.fibaroClient.turnOffDevice(deviceId);
              results.push(`Turned off device ${deviceId}`);
            }

            // Set color if specified
            if (colorName && action === 'on') {
              const rgb = getColorRGB(colorName);
              await this.fibaroClient.setColor(deviceId, rgb.r, rgb.g, rgb.b, 0);
              results.push(`Set color to ${colorName} RGB(${rgb.r},${rgb.g},${rgb.b})`);
            }

            // Set brightness if specified
            if (brightness !== undefined && action === 'on') {
              await this.fibaroClient.setBrightness(deviceId, brightness);
              results.push(`Set brightness to ${brightness}%`);
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `Device ${deviceId}: ${results.join(', ')}`,
                },
              ],
            };
          }

          case 'fibaro_run_scene': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const sceneId = args?.id as number;
            await this.fibaroClient.runScene(sceneId);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully started scene ${sceneId}`,
                },
              ],
            };
          }

          case 'fibaro_stop_scene': {
            if (!this.fibaroClient) {
              throw new Error('Not connected to Fibaro HC3. Please check your configuration and restart the MCP server.');
            }
            const sceneId = args?.id as number;
            await this.fibaroClient.stopScene(sceneId);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully stopped scene ${sceneId}`,
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Fibaro HC3 MCP server running on stdio');
  }
}

const server = new FibaroMCPServer();
server.run().catch(console.error);