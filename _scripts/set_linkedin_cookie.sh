#!/bin/bash

# LinkedIn Cookie Setup Script
# This script helps you set up the LINKEDIN_COOKIE environment variable in .zshrc

echo "🔗 LinkedIn MCP Server Cookie Setup"
echo "===================================="
echo
echo "To get your LinkedIn cookie:"
echo "1. Open LinkedIn in Chrome/Firefox"
echo "2. Press F12 to open DevTools"

echo "3. Go to Application/Storage tab > Cookies > linkedin.com"
echo "4. Find 'li_at' cookie and copy its value"
echo "5. The cookie should start with 'AQ' and be quite long"
echo
echo "Alternatively, you can use the MCP server to get it:"
echo "uvx --from git+https://github.com/stickerdaniel/linkedin-mcp-server linkedin-mcp-server --get-cookie"
echo

read -p "Enter your LinkedIn cookie (li_at value): " cookie

if [ -z "$cookie" ]; then
    echo "❌ No cookie provided. Exiting."
    exit 1
fi

# Check if cookie looks valid (LinkedIn cookies typically start with AQ)
if [[ ! "$cookie" =~ ^AQ ]]; then
    echo "⚠️  Warning: LinkedIn cookies typically start with 'AQ'"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update .zshrc
ZSHRC="$HOME/.zshrc"

# Check if LINKEDIN_COOKIE already exists in .zshrc
if grep -q "^export LINKEDIN_COOKIE=" "$ZSHRC" 2>/dev/null; then
    # Update existing line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/^export LINKEDIN_COOKIE=.*/export LINKEDIN_COOKIE=\"$cookie\"/" "$ZSHRC"
    else
        # Linux
        sed -i "s/^export LINKEDIN_COOKIE=.*/export LINKEDIN_COOKIE=\"$cookie\"/" "$ZSHRC"
    fi
    echo "✅ Updated existing LINKEDIN_COOKIE in $ZSHRC"
else
    # Add new export line
    echo "" >> "$ZSHRC"
    echo "# LinkedIn MCP Server Cookie" >> "$ZSHRC"
    echo "export LINKEDIN_COOKIE=\"$cookie\"" >> "$ZSHRC"
    echo "✅ Added LINKEDIN_COOKIE to $ZSHRC"
fi

echo
echo "🎉 Setup complete!"
echo "Next steps:"
echo "1. Run 'source ~/.zshrc' to reload your shell environment"
echo "2. Restart Claude Code to load the new MCP server"
echo "3. The LinkedIn MCP server should now be available"

# Offer to source .zshrc immediately
read -p "Would you like to source ~/.zshrc now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    source "$ZSHRC"
    echo "✅ Environment reloaded"
fi