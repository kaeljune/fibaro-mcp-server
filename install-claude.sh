#!/bin/bash

# Script to install Fibaro HC3 MCP Server for Claude Desktop

# Get current directory
CURRENT_DIR="$(pwd)"
DIST_PATH="$CURRENT_DIR/dist/index.js"

# Check if dist/index.js exists
if [ ! -f "$DIST_PATH" ]; then
    echo "❌ Error: dist/index.js not found. Please run 'npm run build' first."
    exit 1
fi

# Collect Fibaro HC3 configuration
echo "🏠 Fibaro HC3 Configuration Setup"
echo "=================================="
echo ""

read -p "Fibaro HC3 IP address or hostname: " FIBARO_HOST

echo "Protocol (http/https):"
echo "1) HTTP (port 80)"
echo "2) HTTPS (port 443) - default"
read -p "Choose protocol (1 or 2, default: 2): " PROTOCOL_CHOICE

if [[ "$PROTOCOL_CHOICE" == "1" ]]; then
    FIBARO_PROTOCOL="http"
    DEFAULT_PORT=80
else
    FIBARO_PROTOCOL="https"
    DEFAULT_PORT=443
fi

read -p "Fibaro HC3 port (default: $DEFAULT_PORT): " FIBARO_PORT
FIBARO_PORT=${FIBARO_PORT:-$DEFAULT_PORT}

read -p "Fibaro HC3 username: " FIBARO_USERNAME
read -s -p "Fibaro HC3 password: " FIBARO_PASSWORD
echo ""

echo ""
echo "Testing connection to Fibaro HC3..."

# Test connection using Node.js
node -e "
const http = require('http');
const https = require('https');
const protocol = '$FIBARO_PROTOCOL';
const httpModule = protocol === 'https' ? https : http;

const auth = 'Basic ' + Buffer.from('$FIBARO_USERNAME:$FIBARO_PASSWORD').toString('base64');
const options = {
  hostname: '$FIBARO_HOST',
  port: $FIBARO_PORT,
  path: '/api/loginStatus',
  method: 'GET',
  headers: { 'Authorization': auth },
  timeout: 5000
};

// Only add HTTPS specific options if using HTTPS
if (protocol === 'https') {
  options.rejectUnauthorized = false;
}

const req = httpModule.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Connection test successful!');
      process.exit(0);
    } else {
      console.log('❌ Connection test failed: HTTP ' + res.statusCode);
      console.log('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Connection test failed: ' + err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Connection test failed: timeout');
  req.destroy();
  process.exit(1);
});

req.end();
"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to connect to Fibaro HC3. Please check your settings and try again."
    exit 1
fi

echo ""

# Detect OS and set config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CONFIG_DIR="$HOME/.config/claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash/Cygwin)
    CONFIG_DIR="$APPDATA/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Backup existing config if it exists
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "📋 Backed up existing config to $CONFIG_FILE.backup.*"
fi

# Create or update config
if [ -f "$CONFIG_FILE" ]; then
    # Config exists, need to merge
    echo "🔧 Updating existing Claude configuration..."
    
    # Use jq if available, otherwise show manual instructions
    if command -v jq &> /dev/null; then
        # Add the fibaro-hc3 server to mcpServers with environment variables
        jq --arg path "$DIST_PATH" --arg host "$FIBARO_HOST" --arg username "$FIBARO_USERNAME" --arg password "$FIBARO_PASSWORD" --arg port "$FIBARO_PORT" --arg protocol "$FIBARO_PROTOCOL" '.mcpServers["fibaro-hc3"] = {
            "command": "node",
            "args": [$path],
            "env": {
                "FIBARO_HOST": $host,
                "FIBARO_USERNAME": $username,
                "FIBARO_PASSWORD": $password,
                "FIBARO_PORT": $port,
                "FIBARO_PROTOCOL": $protocol
            }
        }' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
        echo "✅ Successfully updated Claude configuration with jq"
    else
        echo "📝 Please manually add this to your Claude configuration:"
        echo ""
        echo "Add this section to the 'mcpServers' object in $CONFIG_FILE:"
        echo ""
        echo "\"fibaro-hc3\": {"
        echo "  \"command\": \"node\","
        echo "  \"args\": [\"$DIST_PATH\"],"
        echo "  \"env\": {"
        echo "    \"FIBARO_HOST\": \"$FIBARO_HOST\","
        echo "    \"FIBARO_USERNAME\": \"$FIBARO_USERNAME\","
        echo "    \"FIBARO_PASSWORD\": \"$FIBARO_PASSWORD\","
        echo "    \"FIBARO_PORT\": \"$FIBARO_PORT\","
        echo "    \"FIBARO_PROTOCOL\": \"$FIBARO_PROTOCOL\""
        echo "  }"
        echo "}"
        echo ""
    fi
else
    # Create new config
    echo "🆕 Creating new Claude configuration..."
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "fibaro-hc3": {
      "command": "node",
      "args": ["$DIST_PATH"],
      "env": {
        "FIBARO_HOST": "$FIBARO_HOST",
        "FIBARO_USERNAME": "$FIBARO_USERNAME",
        "FIBARO_PASSWORD": "$FIBARO_PASSWORD",
        "FIBARO_PORT": "$FIBARO_PORT",
        "FIBARO_PROTOCOL": "$FIBARO_PROTOCOL"
      }
    }
  }
}
EOF
    echo "✅ Created new Claude configuration"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "📍 Configuration file: $CONFIG_FILE"
echo "📍 MCP Server path: $DIST_PATH"
echo ""
echo "🔄 Please restart Claude Desktop to load the new MCP server."
echo ""
echo "🧪 To test, try asking Claude:"
echo "   \"Hiển thị tất cả devices từ Fibaro HC3\""
echo "   \"Tắt đèn số 3\""
echo "   \"Bật tất cả đèn phòng khách\""
echo ""