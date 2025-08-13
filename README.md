# Fibaro HC3 MCP Server

> **⚠️ DEMO VERSION DISCLAIMER**  
> This is a **demonstration/educational version** of the Fibaro HC3 MCP Server. It is **NOT a commercial product** and is provided as-is for learning and testing purposes only. Use at your own risk.

An MCP (Model Context Protocol) Server for controlling Fibaro Home Center 3 through Claude AI.

## Features

### 🏠 **Device Support**
- **Auto-connect** to Fibaro HC3 on startup (one-time configuration)
- **Smart device detection** with 20+ device types support
- **Lights & Dimmers**: Basic lights, RGB lights, LED strips, dimmable lights
- **Switches & Outlets**: Binary switches, relay switches, smart plugs
- **Sensors**: Motion, door/window, temperature, humidity, flood, smoke, CO, light sensors
- **Climate Control**: Thermostats, HVAC systems with temperature and mode control
- **Covers & Blinds**: Roller shutters, venetian blinds, garage doors with position control
- **Security**: Smart locks, sirens, and alarms

### 🧠 **AI-Powered Control**
- **Context-aware processing** - understands natural language commands
- **Smart device matching** - finds devices by name, room, type, or ID
- **Intent detection** - automatically determines what you want to do
- **Multi-language support** - English and Vietnamese commands
- **Fuzzy matching** - works even with partial device names

### 🤖 **Background Automation (Hiagi.ai Integration)**
- **AI-powered automation suggestions** based on usage patterns
- **Natural language automation creation** - describe automations in plain English
- **Smart triggers**: Time-based, sensor-based, device state changes
- **Flexible actions**: Device control, scene execution, notifications, webhooks
- **Background job management** - create, enable, disable, monitor automations

### 🔧 **Advanced Features**
- **Batch operations** - control multiple devices at once
- **Contextual suggestions** - get smart recommendations when commands are unclear
- **System diagnostics** - health monitoring and troubleshooting
- **Legacy compatibility** - works with existing simple commands
- HTTP/HTTPS protocol support with auto-detection

## Installation

### 🚀 Quick Installation (Recommended)

**One-command installation** - no need to clone the repository:

```bash
curl -sSL https://raw.githubusercontent.com/kaeljune/fibaro-mcp-server/main/quick-install.sh | bash
```

This script will:
- ✅ Check dependencies (git, node.js, npm)
- ✅ Choose your AI client (Claude Desktop or Cursor)
- ✅ Automatically clone the repository
- ✅ Ask for Fibaro HC3 connection details
- ✅ Test the connection
- ✅ Install dependencies and build the project
- ✅ Configure your AI client automatically
- ✅ Ready to use!

### 📋 Manual Installation

If you prefer to install manually:

1. Clone this repository:
```bash
git clone https://github.com/kaeljune/fibaro-mcp-server.git
cd fibaro-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the configuration script:
```bash
./install-claude.sh
```

## Usage

After installation, **no manual connection required**. The MCP server will automatically connect to Fibaro HC3 when your AI client (Claude Desktop or Cursor) starts.

### Supported AI Clients
- **Claude Desktop** - Full MCP support
- **Cursor** - MCP integration for AI-powered coding

### 🎯 **Smart Commands**

```
Turn on all bedroom lights
Close the living room blinds halfway  
Set the thermostat to 22 degrees
Show me all motion sensors
Turn off everything in the kitchen
Change the RGB strip to blue color
Lock the front door
```

### 🔧 **Device-Specific Commands**

**Lights & Dimmers:**
- "Turn on bedroom light at 75% brightness"
- "Change hallway RGB to warm white"
- "Dim all living room lights to 30%"

**Covers & Blinds:**
- "Open kitchen blinds to 80%"
- "Close all shutters"
- "Set office blind slats to 45 degrees"

**Climate Control:**
- "Set living room thermostat to heat mode at 21°C"
- "Turn off bedroom AC"

**Sensors & Monitoring:**
- "Check bathroom humidity sensor"
- "Show all door sensor statuses"
- "What's the temperature in bedroom?"

### 🤖 **Automation Examples**

```
Create automation: Turn on porch light at sunset
Set up: Close blinds when temperature exceeds 25 degrees  
Schedule: Turn off all lights at 11 PM on weekdays
```

## Enhanced Commands (v2.0)

### 🧠 **Smart Control**
- `smart_device_control`: Context-aware natural language device control
- `discover_devices`: Enhanced device discovery with type detection and filtering
- `smart_scene_control`: Intelligent scene management with fuzzy matching

### 🏠 **Device-Specific Control**
- `control_cover_device`: Advanced cover/blind control (position, slat angles)
- `control_climate_device`: Thermostat and HVAC control (temperature, modes)
- `control_lock_device`: Smart lock control (secure/unsecure)
- `read_sensor_data`: Comprehensive sensor reading with battery status

### 🚀 **Advanced Operations**
- `batch_device_control`: Control multiple devices simultaneously
- `system_diagnostics`: System health and device status monitoring

### 🤖 **AI Automation (Hiagi.ai)**
- `create_automation`: Create background automation jobs
- `manage_automations`: Manage existing automation jobs
- `natural_language_automation`: Create automations from descriptions
- `get_automation_suggestions`: AI-powered automation recommendations
- `analyze_device_usage`: Device usage pattern analysis

### 📱 **Legacy Support**
For backward compatibility, all original commands are still supported:
- `fibaro_get_devices`, `fibaro_turn_on_device`, `fibaro_set_brightness`, etc.

## Integration Examples

### 🎯 **Smart Home Control**
- "Turn off all lights in the house"
- "Close living room blinds halfway"  
- "Set bedroom thermostat to 20 degrees heat mode"
- "Lock all doors and turn on security lights"
- "Show me all sensor readings in the basement"

### 🤖 **AI Automation Setup**
- "Create automation to turn on porch light at sunset"
- "Set up automatic blind closing when temperature exceeds 25°C"
- "Schedule all lights to turn off at 11 PM on weekdays"
- "Get suggestions for energy-saving automations"

### 📊 **Smart Analytics**
- "Analyze usage patterns for bedroom lights"
- "Show system health and connectivity status"
- "What automations are currently running?"

Claude will automatically:
1. **Process context** - understand your intent and find relevant devices
2. **Execute actions** - perform the requested operations with validation
3. **Provide feedback** - report results and suggest improvements
4. **Learn patterns** - improve suggestions based on usage (with Hiagi.ai)

## Security

- This server only connects locally to Fibaro HC3
- Login credentials are stored securely in MCP configuration
- Supports both HTTP and HTTPS with self-signed certificate acceptance
- No sensitive information is stored in logs

## Troubleshooting

### Cannot connect to Fibaro HC3

- Re-run the installation script: `./install-claude.sh`
- Check IP address and port (default HTTP: 80, HTTPS: 443)
- Ensure username/password are correct
- Check firewall and network connectivity
- Try accessing HC3 web interface from browser

### MCP Server not working

- Check the path in Claude configuration
- Ensure project has been built (`npm run build`)
- Restart Claude Desktop after configuration changes
- Check Claude Desktop logs for detailed error messages

### Changing Fibaro HC3 connection information

To change IP, username, or password:
1. Re-run the installation script: `./install-claude.sh`
2. Enter new information
3. Restart Claude Desktop

## Configuration

### Environment Variables

**Required for Fibaro HC3:**
- `FIBARO_HOST` - Fibaro HC3 IP address
- `FIBARO_USERNAME` - Fibaro HC3 username  
- `FIBARO_PASSWORD` - Fibaro HC3 password
- `FIBARO_PORT` - Port (default: 80 for HTTP, 443 for HTTPS)
- `FIBARO_PROTOCOL` - Protocol (http/https)

**Optional for Hiagi.ai Background Jobs:**
- `HIAGI_API_KEY` - Your Hiagi.ai API key for background automation
- `HIAGI_BASE_URL` - Custom Hiagi.ai endpoint (default: https://api.hiagi.ai)

The installation script will configure these automatically.

## What's New in v2.0

🎉 **Major Enhancement Release**

### 🧠 **AI-Powered Smart Control**
- Context-aware natural language processing
- Intelligent device matching and intent detection
- Multi-language support (English/Vietnamese)
- Fuzzy matching for partial device names

### 🏠 **Extended Device Support**
- 20+ device types including sensors, covers, climate, security
- Smart device categorization and capability detection
- Advanced control for blinds, thermostats, locks

### 🤖 **Background Automation** 
- Integration with Hiagi.ai for intelligent automation
- Natural language automation creation
- AI-powered suggestions based on usage patterns
- Flexible triggers and actions

### 🚀 **Enhanced Operations**
- Batch device control for complex scenarios
- System diagnostics and health monitoring
- Improved error handling and user feedback

## License

This is a demo/educational project. Not for commercial use.