#!/bin/bash

# LinkedIn Cookie Extraction using MCP Server's built-in functionality
# This uses the LinkedIn MCP server's --get-cookie feature

set -e

echo "🔗 LinkedIn Cookie Extraction via MCP Server"
echo "============================================="

# Check if environment variables are set
if [ -z "$LINKEDIN_EMAIL" ] || [ -z "$LINKEDIN_PASSWORD" ]; then
    echo "❌ LINKEDIN_EMAIL and LINKEDIN_PASSWORD environment variables must be set"
    echo "Current values:"
    echo "LINKEDIN_EMAIL: ${LINKEDIN_EMAIL:-'(not set)'}"
    echo "LINKEDIN_PASSWORD: ${LINKEDIN_PASSWORD:+***hidden***}"
    exit 1
fi

echo "📡 Using LinkedIn MCP server to extract cookie..."
echo "This may take a moment as it launches Chrome..."

# Create temporary file for the output
TEMP_OUTPUT=$(mktemp)
trap "rm -f $TEMP_OUTPUT" EXIT

# Use the MCP server's built-in cookie extraction
export LINKEDIN_EMAIL="$LINKEDIN_EMAIL"
export LINKEDIN_PASSWORD="$LINKEDIN_PASSWORD"

if uvx --from "git+https://github.com/stickerdaniel/linkedin-mcp-server" linkedin-mcp-server --get-cookie > "$TEMP_OUTPUT" 2>&1; then
    # Extract the cookie from the output
    LI_AT_COOKIE=$(grep -o 'AQ[A-Za-z0-9_-]*' "$TEMP_OUTPUT" | head -1)
    
    if [ -n "$LI_AT_COOKIE" ]; then
        echo "✅ Successfully extracted li_at cookie: ${LI_AT_COOKIE:0:20}..."
        
        # Update .zshrc with the cookie
        ZSHRC="$HOME/.zshrc"
        
        echo "📝 Updating .zshrc..."
        
        # Check if LINKEDIN_COOKIE already exists in .zshrc
        if grep -q "^export LINKEDIN_COOKIE=" "$ZSHRC" 2>/dev/null; then
            # Update existing line
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s/^export LINKEDIN_COOKIE=.*/export LINKEDIN_COOKIE=\"$LI_AT_COOKIE\"/" "$ZSHRC"
            else
                # Linux
                sed -i "s/^export LINKEDIN_COOKIE=.*/export LINKEDIN_COOKIE=\"$LI_AT_COOKIE\"/" "$ZSHRC"
            fi
            echo "✅ Updated existing LINKEDIN_COOKIE in $ZSHRC"
        else
            # Add new export line
            echo "" >> "$ZSHRC"
            echo "# LinkedIn MCP Server Cookie (auto-generated)" >> "$ZSHRC"
            echo "export LINKEDIN_COOKIE=\"$LI_AT_COOKIE\"" >> "$ZSHRC"
            echo "✅ Added LINKEDIN_COOKIE to $ZSHRC"
        fi
        
        echo ""
        echo "🎉 Cookie extraction and setup complete!"
        echo "Cookie value: $LI_AT_COOKIE"
        echo ""
        echo "Next steps:"
        echo "1. Run 'source ~/.zshrc' to reload your shell environment"
        echo "2. Restart Claude Code to load the new MCP server"
        echo "3. The LinkedIn MCP server should now be available"
        
        # Set the environment variable for immediate use
        export LINKEDIN_COOKIE="$LI_AT_COOKIE"
        echo "✅ LINKEDIN_COOKIE temporarily set in current session"
        
        # Offer to source .zshrc immediately
        read -p "Would you like to source ~/.zshrc now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Use zsh explicitly to source the file to avoid shell compatibility issues
            if /bin/zsh -c "source '$ZSHRC'" 2>/dev/null; then
                echo "✅ Environment reloaded with zsh"
            else
                echo "⚠️ Could not source .zshrc automatically (shell compatibility issue)"
                echo "Please run manually: source ~/.zshrc"
            fi
        fi
        
    else
        echo "❌ Could not extract cookie from MCP server output"
        echo "Output was:"
        cat "$TEMP_OUTPUT"
    fi
else
    echo "❌ MCP server failed to extract cookie"
    echo "Output was:"
    cat "$TEMP_OUTPUT"
    echo ""
    echo "This could be due to:"
    echo "- Invalid LinkedIn credentials"
    echo "- LinkedIn requiring 2FA verification"
    echo "- Chrome/ChromeDriver not available"
    echo "- LinkedIn's anti-bot protection"
fi