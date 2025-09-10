#!/bin/bash

# Fix zstyle command issue in .zshrc
# Comments out the problematic zstyle line that's causing the error

ZSHRC="$HOME/.zshrc"

echo "🔧 Fixing zstyle issue in .zshrc"
echo "================================"

# Check if the problematic line exists
if grep -q "^zstyle ':omz:update' mode auto" "$ZSHRC" 2>/dev/null; then
    echo "Found problematic zstyle line, commenting it out..."
    
    # Comment out the line using sed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/^zstyle.*:omz:update.*mode auto/# &/' "$ZSHRC"
    else
        # Linux
        sed -i 's/^zstyle.*:omz:update.*mode auto/# &/' "$ZSHRC"
    fi
    
    echo "✅ Fixed: commented out the zstyle line"
    echo "The line is now commented out and won't cause errors"
else
    echo "No problematic zstyle line found in $ZSHRC"
fi

echo ""
echo "You can now safely run: source ~/.zshrc"