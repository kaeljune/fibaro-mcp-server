// Enhanced MCP tools for Fibaro HC3 with advanced device support and context processing

export const ENHANCED_TOOLS = [
  // Smart Context-Aware Control
  {
    name: 'smart_device_control',
    description: 'Smart context-aware device control using natural language. Automatically detects devices and intent from user input. Supports all device types: lights, switches, sensors, covers, thermostats, locks, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Natural language command (e.g., "turn on bedroom lights", "close living room blinds", "set thermostat to 22 degrees")',
        },
        force_device_id: {
          type: 'number',
          description: 'Optional: Force specific device ID if context detection fails',
        },
      },
      required: ['command'],
    },
  },

  // Device Discovery and Information
  {
    name: 'discover_devices',
    description: 'Discover and categorize all devices with enhanced type detection and capabilities',
    inputSchema: {
      type: 'object',
      properties: {
        filter_type: {
          type: 'string',
          enum: ['all', 'lights', 'switches', 'sensors', 'covers', 'climate', 'security', 'unknown'],
          description: 'Filter devices by category',
        },
        room_id: {
          type: 'number',
          description: 'Optional: Filter by specific room ID',
        },
      },
    },
  },

  // Advanced Device Control
  {
    name: 'control_cover_device',
    description: 'Control covers, blinds, shutters, and garage doors with position and slat control',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'Device ID',
        },
        action: {
          type: 'string',
          enum: ['open', 'close', 'stop', 'set_position'],
          description: 'Cover action',
        },
        position: {
          type: 'number',
          description: 'Position percentage (0-100) for set_position action',
          minimum: 0,
          maximum: 100,
        },
        slat_angle: {
          type: 'number',
          description: 'Slat angle for venetian blinds (-90 to 90)',
          minimum: -90,
          maximum: 90,
        },
      },
      required: ['device_id', 'action'],
    },
  },

  {
    name: 'control_climate_device',
    description: 'Control thermostats and HVAC systems with temperature and mode settings',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'Device ID',
        },
        target_temperature: {
          type: 'number',
          description: 'Target temperature',
        },
        mode: {
          type: 'string',
          enum: ['heat', 'cool', 'auto', 'off'],
          description: 'Thermostat mode',
        },
      },
      required: ['device_id'],
    },
  },

  {
    name: 'control_lock_device',
    description: 'Control smart locks with secure/unsecure actions',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'Lock device ID',
        },
        action: {
          type: 'string',
          enum: ['lock', 'unlock'],
          description: 'Lock action',
        },
      },
      required: ['device_id', 'action'],
    },
  },

  // Sensor Data and Monitoring
  {
    name: 'read_sensor_data',
    description: 'Read comprehensive sensor data with historical context',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'Sensor device ID',
        },
        property: {
          type: 'string',
          description: 'Specific property to read (default: value)',
          default: 'value',
        },
        include_battery: {
          type: 'boolean',
          description: 'Include battery status for battery-powered sensors',
          default: true,
        },
      },
      required: ['device_id'],
    },
  },

  // Batch Operations
  {
    name: 'batch_device_control',
    description: 'Control multiple devices at once with different actions',
    inputSchema: {
      type: 'object',
      properties: {
        operations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              device_id: { type: 'number' },
              action: { type: 'string' },
              parameters: { type: 'object' },
            },
            required: ['device_id', 'action'],
          },
          description: 'Array of device operations',
        },
      },
      required: ['operations'],
    },
  },

  // Background Jobs (Hiagi.ai Integration)
  {
    name: 'create_automation',
    description: 'Create background automation jobs with triggers and actions (requires Hiagi.ai)',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Automation name',
        },
        description: {
          type: 'string',
          description: 'Automation description',
        },
        trigger_type: {
          type: 'string',
          enum: ['schedule', 'device_state', 'sensor_value', 'time_based'],
          description: 'Trigger type',
        },
        trigger_config: {
          type: 'object',
          description: 'Trigger configuration (varies by type)',
        },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              config: { type: 'object' },
            },
            required: ['type', 'config'],
          },
          description: 'Actions to execute',
        },
      },
      required: ['name', 'trigger_type', 'actions'],
    },
  },

  {
    name: 'manage_automations',
    description: 'Manage background automation jobs (list, enable, disable, delete)',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'enable', 'disable', 'delete', 'run_now'],
          description: 'Management action',
        },
        job_id: {
          type: 'string',
          description: 'Job ID (required for enable, disable, delete, run_now)',
        },
      },
      required: ['action'],
    },
  },

  {
    name: 'natural_language_automation',
    description: 'Create automations from natural language descriptions (requires Hiagi.ai)',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Natural language automation description (e.g., "Turn on lights at sunset", "Close blinds when temperature is above 25 degrees")',
        },
      },
      required: ['description'],
    },
  },

  // AI-Powered Features
  {
    name: 'get_automation_suggestions',
    description: 'Get AI-powered automation suggestions based on device usage patterns',
    inputSchema: {
      type: 'object',
      properties: {
        device_types: {
          type: 'array',
          items: { type: 'string' },
          description: 'Focus on specific device types',
        },
      },
    },
  },

  {
    name: 'analyze_device_usage',
    description: 'Analyze device usage patterns and get optimization suggestions',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'Device ID to analyze',
        },
        days: {
          type: 'number',
          description: 'Number of days to analyze (default: 7)',
          default: 7,
        },
      },
      required: ['device_id'],
    },
  },

  // Enhanced Scene Control
  {
    name: 'smart_scene_control',
    description: 'Enhanced scene control with context awareness and validation',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['run', 'stop', 'list', 'info'],
          description: 'Scene action',
        },
        scene_id: {
          type: 'number',
          description: 'Scene ID (required for run, stop, info)',
        },
        scene_name: {
          type: 'string',
          description: 'Scene name for fuzzy matching',
        },
      },
      required: ['action'],
    },
  },

  // System Health and Diagnostics
  {
    name: 'system_diagnostics',
    description: 'Get system health, connectivity status, and device diagnostics',
    inputSchema: {
      type: 'object',
      properties: {
        include_devices: {
          type: 'boolean',
          description: 'Include device health status',
          default: false,
        },
        include_network: {
          type: 'boolean',
          description: 'Include network diagnostics',
          default: true,
        },
      },
    },
  },
];

// Legacy tools for backward compatibility (simplified versions)
export const LEGACY_TOOLS = [
  {
    name: 'fibaro_get_devices',
    description: 'Get all devices (legacy - use discover_devices for enhanced features)',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'fibaro_turn_on_device',
    description: 'Turn on device (legacy - use smart_device_control for enhanced features)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Device ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fibaro_turn_off_device',
    description: 'Turn off device (legacy - use smart_device_control for enhanced features)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Device ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'fibaro_set_brightness',
    description: 'Set device brightness (legacy - use smart_device_control for enhanced features)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Device ID' },
        brightness: { type: 'number', description: 'Brightness (0-100)', minimum: 0, maximum: 100 },
      },
      required: ['id', 'brightness'],
    },
  },
  {
    name: 'fibaro_set_color',
    description: 'Set RGB color (legacy - use smart_device_control for enhanced features)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Device ID' },
        red: { type: 'number', minimum: 0, maximum: 255 },
        green: { type: 'number', minimum: 0, maximum: 255 },
        blue: { type: 'number', minimum: 0, maximum: 255 },
        white: { type: 'number', minimum: 0, maximum: 255 },
      },
      required: ['id', 'red', 'green', 'blue'],
    },
  },
  {
    name: 'fibaro_run_scene',
    description: 'Run scene (legacy - use smart_scene_control for enhanced features)',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Scene ID' },
      },
      required: ['id'],
    },
  },
];