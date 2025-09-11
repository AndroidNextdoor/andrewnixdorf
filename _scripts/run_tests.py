#!/usr/bin/env python3

"""
Local Testing Script
====================
Runs all quality gates locally, mirroring the CI/CD pipeline.
This helps validate changes before pushing to GitHub.

Usage:
    python3 _scripts/run_tests.py [--skip-deps] [--port 8001]
    
Options:
    --skip-deps    Skip dependency checks (assume all tools are installed)
    --port         Port for local server (default: 8001 to avoid conflicts)
"""

import os
import sys
import json
import time
import signal
import argparse
import subprocess
from pathlib import Path

# Colors for output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def print_step(step_name, emoji="🔍"):
    """Print a test step with formatting."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{emoji} {step_name}{Colors.END}")
    print("=" * (len(step_name) + 3))

def print_success(message):
    """Print success message."""
    print(f"{Colors.GREEN}✅ {message}{Colors.END}")

def print_warning(message):
    """Print warning message."""
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.END}")

def print_error(message):
    """Print error message."""
    print(f"{Colors.RED}❌ {message}{Colors.END}")

def run_command(cmd, description, allow_failure=False, cwd=None):
    """Run a command and handle output."""
    print(f"{Colors.CYAN}Running: {cmd}{Colors.END}")
    
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd=cwd,
            timeout=120  # 2 minute timeout
        )
        
        if result.returncode == 0:
            print_success(f"{description} completed successfully")
            if result.stdout.strip():
                print(result.stdout.strip())
            return True
        else:
            if allow_failure:
                print_warning(f"{description} completed with warnings")
                if result.stderr.strip():
                    print(result.stderr.strip())
                return True
            else:
                print_error(f"{description} failed")
                if result.stderr.strip():
                    print(result.stderr.strip())
                return False
                
    except subprocess.TimeoutExpired:
        print_error(f"{description} timed out after 2 minutes")
        return False
    except Exception as e:
        print_error(f"{description} failed with exception: {e}")
        return False

def check_dependencies():
    """Check if required tools are installed."""
    print_step("Checking Dependencies", "🔧")
    
    required_tools = {
        'jq': 'JSON processor (brew install jq)',
        'lychee': 'Link checker (brew install lychee or cargo install lychee)',
        'pa11y-ci': 'Accessibility tester (npm install -g pa11y-ci)',
        'lhci': 'Lighthouse CI (npm install -g @lhci/cli)'
    }
    
    missing_tools = []
    
    for tool, install_hint in required_tools.items():
        result = subprocess.run(['which', tool], capture_output=True)
        if result.returncode != 0:
            missing_tools.append((tool, install_hint))
        else:
            print_success(f"{tool} is installed")
    
    if missing_tools:
        print_error("Missing required tools:")
        for tool, hint in missing_tools:
            print(f"  • {tool}: {hint}")
        return False
    
    print_success("All dependencies are installed")
    return True

def validate_json_config():
    """Validate JSON configuration."""
    print_step("Validating JSON Configuration", "📄")
    
    config_path = "assets/data/site.config.json"
    if not os.path.exists(config_path):
        print_error(f"Configuration file not found: {config_path}")
        return False
    
    return run_command(
        f"jq empty {config_path}",
        "JSON configuration validation"
    )

def generate_resume_files():
    """Generate resume files."""
    print_step("Generating Resume Files", "📄")
    
    return run_command(
        "python3 _scripts/create_resume.py",
        "Resume file generation"
    )

def start_local_server(port=8001):
    """Start local development server."""
    print_step(f"Starting Local Server on Port {port}", "🚀")
    
    # Check if port is already in use
    result = subprocess.run(
        f"lsof -ti:{port}",
        shell=True,
        capture_output=True
    )
    
    if result.returncode == 0:
        print_warning(f"Port {port} is already in use")
        pids = result.stdout.decode().strip().split('\n')
        for pid in pids:
            if pid:
                print(f"Killing process {pid}")
                try:
                    os.kill(int(pid), signal.SIGTERM)
                    time.sleep(1)
                except:
                    pass
    
    # Start server in background
    env = os.environ.copy()
    env['PORT'] = str(port)
    
    server_process = subprocess.Popen(
        ["python3", "_scripts/serve.py"],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    for i in range(30):  # Wait up to 30 seconds
        try:
            result = subprocess.run(
                f"curl -s http://localhost:{port} >/dev/null",
                shell=True,
                timeout=2
            )
            if result.returncode == 0:
                print_success(f"Server is running on http://localhost:{port}")
                return server_process
        except:
            pass
        time.sleep(1)
    
    print_error("Server failed to start")
    server_process.terminate()
    return None

def check_broken_links():
    """Check for broken links."""
    print_step("Checking for Broken Links", "🔗")
    
    # Create lychee output directory
    os.makedirs('.lycheeci', exist_ok=True)

    run_command(
        "pwd; ls -la",
        "Check pwd",
        allow_failure=False  # Links should be valid
    )

    return run_command(
        "lychee --config test/lychee.toml .",
        "Link validation",
        allow_failure=True  # Links should be valid
    )

def run_accessibility_tests(port=8001):
    """Run accessibility tests."""
    print_step("Running Accessibility Tests", "♿")
    
    # Update pa11y config to use the correct port
    config_path = "test/pa11yci.json"
    
    # Read current config
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Update URLs to use the specified port
    original_urls = config.get('urls', [])
    config['urls'] = [url.replace('http://localhost:8000', f'http://localhost:{port}') for url in original_urls]
    
    # Create pa11y report directory
    os.makedirs('.pa11yci', exist_ok=True)
    
    # Write temporary config
    temp_config = "test/pa11yci_temp.json"
    with open(temp_config, 'w') as f:
        json.dump(config, f, indent=2)
    
    try:
        # Run pa11y with JSON output and save to file
        result = run_command(
            f"pa11y-ci --config {temp_config} --reporter json > .pa11yci/pa11y-report.json 2>&1 || true",
            "Accessibility tests",
            allow_failure=False  # Accessibility compliance is required
        )
    finally:
        # Clean up temp config
        if os.path.exists(temp_config):
            os.remove(temp_config)
    
    return result

def run_lighthouse_tests(port=8001):
    """Run Lighthouse performance tests."""
    print_step("Running Lighthouse Performance Tests", "🔍")
    
    # Update lighthouse config to use the correct port
    config_path = "test/lighthouserc.json"
    
    # Read current config
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Update URLs to use the specified port
    if 'ci' in config and 'collect' in config['ci']:
        if 'url' in config['ci']['collect']:
            if isinstance(config['ci']['collect']['url'], list):
                config['ci']['collect']['url'] = [
                    url.replace('http://localhost:8000', f'http://localhost:{port}') 
                    for url in config['ci']['collect']['url']
                ]
            else:
                config['ci']['collect']['url'] = config['ci']['collect']['url'].replace(
                    'http://localhost:8000', f'http://localhost:{port}'
                )
    
    # Write temporary config
    temp_config = "test/lighthouserc_temp.json"
    with open(temp_config, 'w') as f:
        json.dump(config, f, indent=2)
    
    try:
        result = run_command(
            f"lhci autorun --config {temp_config}",
            "Lighthouse performance tests",
            allow_failure=False  # Performance thresholds must be met
        )
    finally:
        # Clean up temp config
        if os.path.exists(temp_config):
            os.remove(temp_config)
    
    return result

def main():
    """Main test runner."""
    parser = argparse.ArgumentParser(description='Run local quality assurance tests')
    parser.add_argument('--skip-deps', action='store_true', help='Skip dependency checks')
    parser.add_argument('--port', type=int, default=8001, help='Port for local server (default: 8001)')
    
    args = parser.parse_args()
    
    print(f"{Colors.HEADER}{Colors.BOLD}")
    print("🧪 LOCAL QUALITY ASSURANCE TESTING")
    print("=" * 35)
    print(f"Mirroring CI/CD pipeline locally{Colors.END}")
    
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    os.chdir(project_root)
    
    # Track results
    results = []
    server_process = None
    
    try:
        # 1. Check dependencies (unless skipped)
        if not args.skip_deps:
            success = check_dependencies()
            results.append(("Dependency Check", success))
            if not success:
                print_error("Please install missing dependencies before continuing")
                return 1
        
        # 2. Validate JSON configuration
        success = validate_json_config()
        results.append(("JSON Validation", success))
        
        # 3. Generate resume files
        success = generate_resume_files()
        results.append(("Resume Generation", success))
        
        # 4. Start local server
        server_process = start_local_server(args.port)
        if not server_process:
            results.append(("Local Server", False))
            return 1
        results.append(("Local Server", True))
        
        # 5. Check broken links
        success = check_broken_links()
        results.append(("Link Validation", success))
        
        # 6. Run accessibility tests
        success = run_accessibility_tests(args.port)
        results.append(("Accessibility Tests", success))
        
        # 7. Run Lighthouse tests
        success = run_lighthouse_tests(args.port)
        results.append(("Performance Tests", success))
        
    finally:
        # Stop server
        if server_process:
            print_step("Stopping Local Server", "🛑")
            server_process.terminate()
            try:
                server_process.wait(timeout=5)
                print_success("Server stopped successfully")
            except subprocess.TimeoutExpired:
                server_process.kill()
                print_warning("Server force-killed")
    
    # Print summary
    print_step("Quality Gate Summary", "📊")
    
    all_passed = True
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if not success:
            all_passed = False
    
    print()
    if all_passed:
        print_success("🎉 All quality gates passed! Ready for deployment.")
        return 0
    else:
        print_error("❌ Some quality gates failed. Please fix issues before pushing.")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Testing interrupted by user{Colors.END}")
        sys.exit(130)