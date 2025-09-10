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
trap 'rm -f "$COOKIE_JAR" "$LOGIN_RESPONSE"' EXIT

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

echo "🏠 Step 3: Visiting LinkedIn home page to complete authentication..."

# Visit LinkedIn home page to ensure full authentication and cookie setting
HOME_STATUS=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -L \
    -w "%{http_code}" \
    -o /dev/null \
    "https://www.linkedin.com/feed/")

echo "Home page visit status: $HOME_STATUS"

# Try visiting the me endpoint which often requires a valid session
echo "👤 Step 3b: Trying /in/me endpoint..."
ME_STATUS=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -L \
    -w "%{http_code}" \
    -o /dev/null \
    "https://www.linkedin.com/in/me/")

echo "Me endpoint visit status: $ME_STATUS"

echo "🍪 Step 4: Extracting li_at cookie..."

# Extract li_at cookie from cookie jar (improved regex)
LI_AT_COOKIE=$(grep 'li_at' "$COOKIE_JAR" | awk '{print $NF}' | head -1)

if [ -z "$LI_AT_COOKIE" ]; then
    echo "❌ li_at cookie not found in automated login response"
    echo "Cookie jar contents:"
    cat "$COOKIE_JAR"
    echo ""
    echo "🤔 LinkedIn may be blocking automated login attempts."
    echo ""
    echo "Alternative approaches:"
    echo "1. Try using browser developer tools to manually extract the li_at cookie"
    echo "2. Use a browser extension to export cookies"
    echo "3. Check if the li_rm cookie can be used instead (some LinkedIn tools accept it)"
    echo ""
    
    # Check if we have li_rm cookie as fallback
    LI_RM_COOKIE=$(grep 'li_rm' "$COOKIE_JAR" | awk '{print $NF}' | head -1)
    if [ -n "$LI_RM_COOKIE" ]; then
        echo "✅ Found li_rm (remember me) cookie as potential alternative"
        echo "li_rm cookie: ${LI_RM_COOKIE:0:20}..."
        echo ""
        read -p "Would you like to try using the li_rm cookie instead? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            LI_AT_COOKIE="$LI_RM_COOKIE"
            echo "✅ Using li_rm cookie as LINKEDIN_COOKIE"
        else
            echo "❌ No valid LinkedIn cookie available"
            exit 1
        fi
    else
        echo "❌ No alternative cookies found either"
        exit 1
    fi
fi

echo "✅ Successfully extracted li_at cookie: ${LI_AT_COOKIE:0:20}..."

# Update .zshrc with the cookie
ZSHRC="$HOME/.zshrc"

echo "📝 Step 5: Updating .zshrc..."

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
    {
        echo ""
        echo "# LinkedIn MCP Server Cookie (auto-generated)"
        echo "export LINKEDIN_COOKIE=\"$LI_AT_COOKIE\""
    } >> "$ZSHRC"
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
    echo "🔄 Reloading shell environment..."
    # Use zsh to source the .zshrc file to avoid Oh My Zsh errors
    if command -v zsh >/dev/null 2>&1; then
        zsh -c "source '$ZSHRC' && echo '✅ Environment reloaded' && echo 'LINKEDIN_COOKIE is now set to: ${LINKEDIN_COOKIE:0:20}...'"
    else
        echo "⚠️  zsh not found. Please manually run: source ~/.zshrc"
    fi
fi