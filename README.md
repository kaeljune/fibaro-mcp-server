# Fibaro HC3 MCP Server

> **⚠️ DEMO VERSION DISCLAIMER**  
> This is a **demonstration/educational version** of the Fibaro HC3 MCP Server. It is **NOT a commercial product** and is provided as-is for learning and testing purposes only. Use at your own risk.

An MCP (Model Context Protocol) Server for controlling Fibaro Home Center 3 through Claude AI.

## Features

- **Auto-connect** to Fibaro HC3 on startup (one-time configuration)
- Retrieve information about devices, scenes, and rooms
- Control devices (turn on/off, set values, brightness, colors)
- Run and stop scenes
- Full Claude AI integration for natural language control
- Support for RGB lights with color name mapping
- HTTP/HTTPS protocol support

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. **Run the automatic installation script:**

```bash
./install-claude.sh
```

The script will:
- Ask for Fibaro HC3 connection details (IP, username, password)
- Test the connection to ensure credentials are correct
- Automatically configure Claude Desktop
- Securely save login credentials in MCP configuration

## Usage

After installation, **no manual connection required**. The MCP server will automatically connect to Fibaro HC3 when Claude starts.

### 1. View Device List

```
Show all devices
```

### 2. Control Lights

```
Turn off light number 3
```

```
Turn on living room light
```

```
Set light number 5 brightness to 50%
```

### 3. Control RGB Lights

```
Change RGB light number 10 to red
```

```
Set RGB light number 10 to purple (255,0,255,0)
```

### 4. Run Scenes

```
Run scene "Good Night"
```

## Available Commands

### Information
- `fibaro_get_devices`: Get list of all devices
- `fibaro_get_device`: Get detailed device information by ID
- `fibaro_get_scenes`: Get list of all scenes
- `fibaro_get_scene`: Get detailed scene information by ID
- `fibaro_get_rooms`: Get list of all rooms

### Control
- `fibaro_turn_on_device`: Turn on device by ID
- `fibaro_turn_off_device`: Turn off device by ID
- `fibaro_set_device_value`: Set property value for device
- `fibaro_set_brightness`: Set brightness for lights/dimmers (0-100%)
- `fibaro_set_color`: Set RGB color for RGB lights (R,G,B,W: 0-255)
- `fibaro_control_rgb_light`: Complete RGB light control (on/off + color + brightness)
- `fibaro_run_scene`: Run scene by ID
- `fibaro_stop_scene`: Stop scene by ID

## Integration Examples

After configuration, you can talk to Claude like:

- "Turn off all lights in the house"
- "Turn on bedroom light"
- "Run good morning scene"
- "Show status of all sensors"
- "Set living room light brightness to 50%"
- "Change living room RGB light to green"
- "Set RGB light number 5 to light purple"

Claude will automatically:
1. Connect to Fibaro HC3 (if not already connected)
2. Find matching devices/scenes
3. Execute control commands
4. Report results

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

## License

This is a demo/educational project. Not for commercial use.