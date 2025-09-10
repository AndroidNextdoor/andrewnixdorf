#!/usr/bin/env python3
"""
Programmatic LinkedIn Cookie Extraction
Uses requests to login and extract the li_at cookie
"""

import requests
import re
import os
import sys
from urllib.parse import urljoin
from pathlib import Path

def get_linkedin_cookie(email, password):
    """Login to LinkedIn and extract the li_at cookie"""
    session = requests.Session()
    
    # Set a realistic user agent
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    })
    
    print("📡 Step 1: Getting login page...")
    
    # Get the login page
    try:
        login_page = session.get('https://www.linkedin.com/login', timeout=10)
        login_page.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Failed to get login page: {e}")
        return None
    
    print("✅ Login page retrieved")
    
    # Extract CSRF token
    csrf_match = re.search(r'name="loginCsrfParam" value="([^"]*)"', login_page.text)
    if not csrf_match:
        print("❌ Failed to extract CSRF token from login page")
        return None
    
    csrf_token = csrf_match.group(1)
    print(f"✅ CSRF token extracted: {csrf_token[:20]}...")
    
    print("🔐 Step 2: Performing login...")
    
    # Prepare login data
    login_data = {
        'loginCsrfParam': csrf_token,
        'session_key': email,
        'session_password': password,
        'isJsEnabled': 'false',
        'goback': '',
    }
    
    # Set referer header
    session.headers.update({
        'Referer': 'https://www.linkedin.com/login',
        'Content-Type': 'application/x-www-form-urlencoded',
    })
    
    # Perform login
    try:
        login_response = session.post(
            'https://www.linkedin.com/checkpoint/lg/login-submit',
            data=login_data,
            timeout=10,
            allow_redirects=True
        )
    except requests.RequestException as e:
        print(f"❌ Login request failed: {e}")
        return None
    
    print(f"Login response status: {login_response.status_code}")
    
    # Check for common error indicators
    if 'challenge' in login_response.url.lower():
        print("❌ LinkedIn requires additional verification (2FA, captcha, etc.)")
        return None
    
    if login_response.status_code not in [200, 302]:
        print(f"❌ Login failed with status: {login_response.status_code}")
        return None
    
    print("✅ Login appears successful")
    
    print("🍪 Step 3: Extracting li_at cookie...")
    
    # Extract li_at cookie
    li_at_cookie = None
    for cookie in session.cookies:
        if cookie.name == 'li_at':
            li_at_cookie = cookie.value
            break
    
    if not li_at_cookie:
        print("❌ li_at cookie not found in response")
        print("Available cookies:")
        for cookie in session.cookies:
            print(f"  - {cookie.name}")
        
        # Check if we're on a challenge page
        if 'challenge' in login_response.text.lower():
            print("\nThis could mean LinkedIn requires additional verification.")
        
        return None
    
    print(f"✅ Successfully extracted li_at cookie: {li_at_cookie[:20]}...")
    return li_at_cookie

def update_zshrc(cookie):
    """Add or update LINKEDIN_COOKIE in .zshrc"""
    zshrc_path = Path.home() / '.zshrc'
    
    # Read current .zshrc content
    content = ""
    if zshrc_path.exists():
        with open(zshrc_path, 'r') as f:
            content = f.read()
    
    # Check if LINKEDIN_COOKIE already exists
    lines = content.split('\n')
    updated = False
    
    for i, line in enumerate(lines):
        if line.strip().startswith('export LINKEDIN_COOKIE='):
            lines[i] = f'export LINKEDIN_COOKIE="{cookie}"'
            updated = True
            break
    
    if not updated:
        # Add new export line
        if content and not content.endswith('\n'):
            content += '\n'
        content += f'\n# LinkedIn MCP Server Cookie (auto-generated)\nexport LINKEDIN_COOKIE="{cookie}"\n'
        lines = content.split('\n')
    
    # Write updated content
    with open(zshrc_path, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Updated {zshrc_path} with LINKEDIN_COOKIE")

def main():
    print("🔗 Programmatic LinkedIn Cookie Extraction")
    print("==========================================")
    
    # Get credentials from environment
    email = os.getenv('LINKEDIN_EMAIL')
    password = os.getenv('LINKEDIN_PASSWORD')
    
    if not email or not password:
        print("❌ LINKEDIN_EMAIL and LINKEDIN_PASSWORD environment variables must be set")
        print("Current values:")
        print(f"LINKEDIN_EMAIL: {email or '(not set)'}")
        print(f"LINKEDIN_PASSWORD: {'***hidden***' if password else '(not set)'}")
        sys.exit(1)
    
    # Extract cookie
    cookie = get_linkedin_cookie(email, password)
    
    if not cookie:
        print("\n❌ Failed to extract LinkedIn cookie")
        print("\nThis could be due to:")
        print("- Invalid credentials")
        print("- LinkedIn requiring additional verification (2FA, captcha)")
        print("- Rate limiting or anti-bot protection")
        print("- Changes to LinkedIn's login process")
        print("\nTry using the manual method or the MCP server's --get-cookie option")
        sys.exit(1)
    
    print("📝 Step 4: Updating .zshrc...")
    update_zshrc(cookie)
    
    print(f"\n🎉 Cookie extraction and setup complete!")
    print(f"Cookie value: {cookie}")
    print("\nNext steps:")
    print("1. Run 'source ~/.zshrc' to reload your shell environment")
    print("2. Restart Claude Code to load the new MCP server")
    print("3. The LinkedIn MCP server should now be available")
    
    # Set the environment variable for immediate use
    os.environ['LINKEDIN_COOKIE'] = cookie
    print(f"\n✅ LINKEDIN_COOKIE temporarily set in current session")

if __name__ == "__main__":
    main()