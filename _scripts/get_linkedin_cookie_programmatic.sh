#!/bin/bash

# Programmatic LinkedIn Cookie Extraction Script
# Uses curl to login and extract the li_at cookie

set -e

echo "🔗 Programmatic LinkedIn Cookie Extraction"
echo "=========================================="

# Check if environment variables are set
if [ -z "$LINKEDIN_EMAIL" ] || [ -z "$LINKEDIN_PASSWORD" ]; then
    echo "❌ LINKEDIN_EMAIL and LINKEDIN_PASSWORD environment variables must be set"
    echo "Current values:"
    echo "LINKEDIN_EMAIL: ${LINKEDIN_EMAIL:-'(not set)'}"
    echo "LINKEDIN_PASSWORD: ${LINKEDIN_PASSWORD:+***hidden***}"
    exit 1
fi

# Create temporary files for cookies and responses
COOKIE_JAR=$(mktemp)
LOGIN_RESPONSE=$(mktemp)
trap "rm -f $COOKIE_JAR $LOGIN_RESPONSE" EXIT

echo "📡 Step 1: Getting login page to extract CSRF token..."

# Get the login page and extract CSRF token
curl -s -c "$COOKIE_JAR" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    "https://www.linkedin.com/login" > "$LOGIN_RESPONSE"

# Extract CSRF token from the login page
CSRF_TOKEN=$(grep -o 'name="loginCsrfParam" value="[^"]*"' "$LOGIN_RESPONSE" | sed 's/.*value="\([^"]*\)".*/\1/')

if [ -z "$CSRF_TOKEN" ]; then
    echo "❌ Failed to extract CSRF token from login page"
    exit 1
fi

echo "✅ CSRF token extracted: ${CSRF_TOKEN:0:20}..."

echo "🔐 Step 2: Performing login..."

# Perform login
LOGIN_STATUS=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -H "Referer: https://www.linkedin.com/login" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "loginCsrfParam=$CSRF_TOKEN" \
    -d "session_key=$LINKEDIN_EMAIL" \
    -d "session_password=$LINKEDIN_PASSWORD" \
    -d "isJsEnabled=false" \
    -d "goback=" \
    -w "%{http_code}" \
    -o /dev/null \
    "https://www.linkedin.com/checkpoint/lg/login-submit")

echo "Login response status: $LOGIN_STATUS"

# Check if login was successful (200, 302, or 303 redirect)
if [[ "$LOGIN_STATUS" != "200" && "$LOGIN_STATUS" != "302" && "$LOGIN_STATUS" != "303" ]]; then
    echo "❌ Login failed with status: $LOGIN_STATUS"
    echo "This could be due to:"
    echo "- Invalid credentials"
    echo "- LinkedIn requiring additional verification"
    echo "- Rate limiting or anti-bot protection"
    exit 1
fi

echo "✅ Login appears successful"

echo "🍪 Step 3: Extracting li_at cookie..."

# Extract li_at cookie from cookie jar
LI_AT_COOKIE=$(grep -o 'li_at\s*[^\s]*' "$COOKIE_JAR" | awk '{print $2}' | head -1)

if [ -z "$LI_AT_COOKIE" ]; then
    echo "❌ li_at cookie not found in response"
    echo "Cookie jar contents:"
    cat "$COOKIE_JAR"
    echo ""
    echo "This could mean:"
    echo "- LinkedIn requires additional verification (2FA, captcha, etc.)"
    echo "- The login process has changed"
    echo "- Anti-bot protection is active"
    exit 1
fi

echo "✅ Successfully extracted li_at cookie: ${LI_AT_COOKIE:0:20}..."

# Update .zshrc with the cookie
ZSHRC="$HOME/.zshrc"

echo "📝 Step 4: Updating .zshrc..."

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

# Offer to source .zshrc immediately
read -p "Would you like to source ~/.zshrc now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    source "$ZSHRC"
    echo "✅ Environment reloaded"
    echo "LINKEDIN_COOKIE is now set to: ${LINKEDIN_COOKIE:0:20}..."
fi