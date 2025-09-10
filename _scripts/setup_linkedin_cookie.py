#!/usr/bin/env python3
"""
Script to extract LinkedIn cookie and add it to .zshrc
Uses the LinkedIn MCP server to get the cookie value.
"""

import subprocess
import os
import sys
import tempfile
from pathlib import Path

def get_linkedin_cookie():
    """Extract LinkedIn cookie using the MCP server"""
    try:
        # Try to get cookie using the LinkedIn MCP server
        result = subprocess.run([
            'uvx', '--from', 'git+https://github.com/stickerdaniel/linkedin-mcp-server', 
            'linkedin-mcp-server', '--get-cookie'
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            cookie = result.stdout.strip()
            if cookie and cookie.startswith('AQ'):  # LinkedIn cookies typically start with AQ
                return cookie
        
        print("Failed to extract cookie automatically. Please get it manually:")
        print("1. Open LinkedIn in Chrome")
        print("2. Press F12 to open DevTools")
        print("3. Go to Application tab > Storage > Cookies > linkedin.com")
        print("4. Find 'li_at' cookie and copy its value")
        
        cookie = input("Enter your LinkedIn cookie (li_at value): ").strip()
        return cookie if cookie else None
        
    except subprocess.TimeoutExpired:
        print("Cookie extraction timed out. Please enter manually:")
        cookie = input("Enter your LinkedIn cookie (li_at value): ").strip()
        return cookie if cookie else None
    except Exception as e:
        print(f"Error getting cookie: {e}")
        cookie = input("Enter your LinkedIn cookie (li_at value): ").strip()
        return cookie if cookie else None

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
        content += f'\n# LinkedIn MCP Server Cookie\nexport LINKEDIN_COOKIE="{cookie}"\n'
        lines = content.split('\n')
    
    # Write updated content
    with open(zshrc_path, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Updated {zshrc_path} with LINKEDIN_COOKIE")
    print("Run 'source ~/.zshrc' or restart your terminal to apply changes")

def main():
    print("🔗 LinkedIn MCP Server Cookie Setup")
    print("=" * 40)
    
    cookie = get_linkedin_cookie()
    
    if not cookie:
        print("❌ No cookie provided. Exiting.")
        sys.exit(1)
    
    if not cookie.startswith('AQ'):
        print("⚠️  Warning: LinkedIn cookies typically start with 'AQ'")
        proceed = input("Continue anyway? (y/N): ").strip().lower()
        if proceed != 'y':
            sys.exit(1)
    
    update_zshrc(cookie)
    
    print("\n🎉 Setup complete!")
    print("Next steps:")
    print("1. Run 'source ~/.zshrc' to reload your shell")
    print("2. Restart Claude Code to load the new MCP server")

if __name__ == "__main__":
    main()