#!/bin/bash

# ==============================================================================
# Fibaro HC3 MCP Server - Quick Installer
# ==============================================================================
# This script automatically downloads, installs, and configures the Fibaro HC3 
# MCP Server for Claude Desktop or Cursor.
#
# Usage: curl -sSL https://raw.githubusercontent.com/kaeljune/fibaro-mcp-server/main/quick-install.sh | bash
# ==============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/kaeljune/fibaro-mcp-server.git"
INSTALL_DIR="$HOME/fibaro-mcp-server"

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}  Fibaro HC3 MCP Server - Quick Installer${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  DEMO VERSION DISCLAIMER${NC}"
    echo -e "This is a demonstration/educational version."
    echo -e "NOT a commercial product. Use at your own risk."
    echo ""
}

print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check dependencies
check_dependencies() {
    print_step "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node.js")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo ""
        echo "Please install the missing dependencies:"
        echo "- macOS: brew install git node"
        echo "- Ubuntu/Debian: sudo apt install git nodejs npm"
        echo "- CentOS/RHEL: sudo yum install git nodejs npm"
        exit 1
    fi
    
    print_info "All dependencies found ✓"
}

# Choose AI client
choose_ai_client() {
    print_step "Choose your AI client..."
    echo ""
    echo "1) Claude Desktop"
    echo "2) Cursor"
    echo ""
    read -p "Enter your choice (1 or 2, default: 1): " CLIENT_CHOICE
    CLIENT_CHOICE=${CLIENT_CHOICE:-1}
    
    if [[ "$CLIENT_CHOICE" == "1" ]]; then
        AI_CLIENT="claude"
        print_info "Selected: Claude Desktop"
    elif [[ "$CLIENT_CHOICE" == "2" ]]; then
        AI_CLIENT="cursor" 
        print_info "Selected: Cursor"
    else
        print_error "Invalid choice. Using Claude Desktop as default."
        AI_CLIENT="claude"
    fi
}

# Set config paths based on OS and AI client
set_config_paths() {
    print_step "Detecting system configuration..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if [[ "$AI_CLIENT" == "claude" ]]; then
            CONFIG_DIR="$HOME/Library/Application Support/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        else
            CONFIG_DIR="$HOME/Library/Application Support/Cursor/User"
            CONFIG_FILE="$CONFIG_DIR/settings.json"
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if [[ "$AI_CLIENT" == "claude" ]]; then
            CONFIG_DIR="$HOME/.config/claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        else
            CONFIG_DIR="$HOME/.config/Cursor/User"
            CONFIG_FILE="$CONFIG_DIR/settings.json"
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows (Git Bash/Cygwin)
        if [[ "$AI_CLIENT" == "claude" ]]; then
            CONFIG_DIR="$APPDATA/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        else
            CONFIG_DIR="$APPDATA/Cursor/User"
            CONFIG_FILE="$CONFIG_DIR/settings.json"
        fi
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    
    print_info "OS: $OSTYPE"
    print_info "AI Client: $AI_CLIENT"
    print_info "Config Directory: $CONFIG_DIR"
}

# Collect Fibaro HC3 configuration
collect_fibaro_config() {
    print_step "Fibaro HC3 Configuration..."
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
}

# Test Fibaro HC3 connection
test_fibaro_connection() {
    print_step "Testing connection to Fibaro HC3..."
    
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

    if (protocol === 'https') {
      options.rejectUnauthorized = false;
    }

    const req = httpModule.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Connection test successful!');
        process.exit(0);
      } else {
        console.log('❌ Connection test failed: HTTP ' + res.statusCode);
        process.exit(1);
      }
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
    " || {
        print_error "Failed to connect to Fibaro HC3. Please check your settings."
        exit 1
    }
    
    print_success "Fibaro HC3 connection verified!"
}

# Clone repository
clone_repository() {
    print_step "Downloading Fibaro HC3 MCP Server..."
    
    if [ -d "$INSTALL_DIR" ]; then
        print_info "Directory exists. Updating..."
        cd "$INSTALL_DIR"
        git pull origin main
    else
        print_info "Cloning repository..."
        git clone "$REPO_URL" "$INSTALL_DIR"
        cd "$INSTALL_DIR"
    fi
    
    print_success "Repository downloaded to: $INSTALL_DIR"
}

# Install dependencies and build
install_and_build() {
    print_step "Installing dependencies and building..."
    
    cd "$INSTALL_DIR"
    
    print_info "Installing Node.js dependencies..."
    npm install
    
    print_info "Building TypeScript project..."
    npm run build
    
    if [ ! -f "dist/index.js" ]; then
        print_error "Build failed. dist/index.js not found."
        exit 1
    fi
    
    print_success "Build completed successfully!"
}

# Configure AI client
configure_ai_client() {
    print_step "Configuring $AI_CLIENT..."
    
    DIST_PATH="$INSTALL_DIR/dist/index.js"
    
    # Create config directory
    mkdir -p "$CONFIG_DIR"
    
    if [[ "$AI_CLIENT" == "claude" ]]; then
        configure_claude
    else
        configure_cursor
    fi
}

# Configure Claude Desktop
configure_claude() {
    # Backup existing config
    if [ -f "$CONFIG_FILE" ]; then
        cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        print_info "Backed up existing Claude configuration"
    fi
    
    # Create or update config
    if [ -f "$CONFIG_FILE" ]; then
        # Config exists, merge with jq if available
        if command -v jq &> /dev/null; then
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
            print_success "Updated Claude configuration with jq"
        else
            print_info "jq not available. Please manually add to $CONFIG_FILE:"
            show_manual_claude_config
        fi
    else
        # Create new config
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
        print_success "Created new Claude configuration"
    fi
}

# Configure Cursor
configure_cursor() {
    # For Cursor, we need to add MCP configuration to settings.json
    if [ -f "$CONFIG_FILE" ]; then
        cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        print_info "Backed up existing Cursor configuration"
        
        if command -v jq &> /dev/null; then
            jq --arg path "$DIST_PATH" --arg host "$FIBARO_HOST" --arg username "$FIBARO_USERNAME" --arg password "$FIBARO_PASSWORD" --arg port "$FIBARO_PORT" --arg protocol "$FIBARO_PROTOCOL" '.["mcp.servers"] = (.["mcp.servers"] // {}) | .["mcp.servers"]["fibaro-hc3"] = {
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
            print_success "Updated Cursor configuration with jq"
        else
            print_info "jq not available. Please manually add to $CONFIG_FILE:"
            show_manual_cursor_config
        fi
    else
        # Create new settings.json for Cursor
        cat > "$CONFIG_FILE" << EOF
{
  "mcp.servers": {
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
        print_success "Created new Cursor configuration"
    fi
}

# Show manual configuration for Claude
show_manual_claude_config() {
    echo ""
    echo "Add this to the 'mcpServers' object in $CONFIG_FILE:"
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
}

# Show manual configuration for Cursor
show_manual_cursor_config() {
    echo ""
    echo "Add this to $CONFIG_FILE:"
    echo ""
    echo "\"mcp.servers\": {"
    echo "  \"fibaro-hc3\": {"
    echo "    \"command\": \"node\","
    echo "    \"args\": [\"$DIST_PATH\"],"
    echo "    \"env\": {"
    echo "      \"FIBARO_HOST\": \"$FIBARO_HOST\","
    echo "      \"FIBARO_USERNAME\": \"$FIBARO_USERNAME\","
    echo "      \"FIBARO_PASSWORD\": \"$FIBARO_PASSWORD\","
    echo "      \"FIBARO_PORT\": \"$FIBARO_PORT\","
    echo "      \"FIBARO_PROTOCOL\": \"$FIBARO_PROTOCOL\""
    echo "    }"
    echo "  }"
    echo "}"
    echo ""
}

# Show completion message
show_completion() {
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  Installation Complete! 🎉${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "${BLUE}📍 Installation Details:${NC}"
    echo "   - Project location: $INSTALL_DIR"
    echo "   - Configuration file: $CONFIG_FILE"
    echo "   - AI Client: $AI_CLIENT"
    echo "   - Fibaro HC3: $FIBARO_PROTOCOL://$FIBARO_HOST:$FIBARO_PORT"
    echo ""
    echo -e "${YELLOW}🔄 Next Steps:${NC}"
    if [[ "$AI_CLIENT" == "claude" ]]; then
        echo "   1. Restart Claude Desktop"
        echo "   2. Test with: 'Show all devices from Fibaro HC3'"
    else
        echo "   1. Restart Cursor"
        echo "   2. Test with: 'Show all devices from Fibaro HC3'"
    fi
    echo ""
    echo -e "${BLUE}🧪 Example Commands:${NC}"
    echo "   - 'Turn off light number 3'"
    echo "   - 'Set living room light to 50% brightness'"
    echo "   - 'Change RGB light to red color'"
    echo "   - 'Run good night scene'"
    echo ""
    echo -e "${YELLOW}📚 Documentation: https://github.com/kaeljune/fibaro-mcp-server${NC}"
    echo ""
}

# Cleanup on interrupt
cleanup() {
    echo ""
    print_error "Installation interrupted by user"
    exit 1
}

# Main installation function
main() {
    trap cleanup INT
    
    print_header
    check_dependencies
    choose_ai_client
    set_config_paths
    collect_fibaro_config
    test_fibaro_connection
    clone_repository
    install_and_build
    configure_ai_client
    show_completion
}

# Run main function
main "$@"