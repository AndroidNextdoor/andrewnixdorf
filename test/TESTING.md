
## 🧪 Testing Configurations

### Full Test Suite
- **Run All Tests** - Complete test suite with dependency checks (mirrors CI/CD)
- **Run Tests (Skip Dependencies)** - Fast testing assuming tools are installed  
- **Run Tests (Custom Port)** - Run tests on port 8002 to avoid conflicts
- **Build and Test** - Compound configuration: Generate resumes + Run tests

### Individual Test Commands
- **Validate JSON Config** - Quick JSON configuration validation
- **Check Links** - Link checker using lychee
- **Accessibility Tests** - pa11y-ci accessibility testing
- **Performance Tests** - Lighthouse performance testing

## 🚀 Development Configurations

### Server Management
- **Start Dev Server** - Launch local development server on port 8000
- **Stop Dev Server** - Stop the development server

### Build Tasks
- **Generate Resume Files** - Create PDF and DOCX resume files

## 📋 How to Use

1. **Run Configurations Dropdown**: Click the run configuration dropdown in the toolbar
2. **Select Configuration**: Choose the appropriate configuration for your task
3. **Run/Debug**: Click the run (▶️) or debug (🐛) button

## 🔧 Configuration Details

### Python Configurations
- Use project Python interpreter
- Run from project root directory
- Include terminal emulation for colored output
- Set `PYTHONUNBUFFERED=1` for immediate output

### Shell Configurations  
- Execute in terminal for interactive output
- Use bash interpreter
- Run from project root directory

## 💡 Recommended Workflow

1. **Development**: Use "Start Dev Server" to run locally
2. **Quick Check**: Use "Build and Test" for fast validation
3. **Full Testing**: Use "Run All Tests" before committing
4. **Targeted Testing**: Use individual test configurations for specific issues

## 🚨 Prerequisites

Some configurations require external tools:
```bash
# Install required dependencies
brew install jq lychee
npm install -g pa11y-ci @lhci/cli
```

The "Run All Tests" configuration will check for these dependencies automatically.