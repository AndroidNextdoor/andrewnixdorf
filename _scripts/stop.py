#!/usr/bin/env python3
"""
Stop the local development server.
Finds and kills any Python HTTP servers running on port 8000.
"""

import subprocess
import sys
import os

def find_and_kill_server():
    """Find and kill any Python HTTP server running on port 8000."""
    try:
        # Find processes using port 8000
        result = subprocess.run(['lsof', '-ti:8000'], capture_output=True, text=True)
        
        if result.returncode == 0 and result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            
            print(f"🔍 Found {len(pids)} process(es) using port 8000:")
            
            for pid in pids:
                try:
                    # Get process info
                    ps_result = subprocess.run(['ps', '-p', pid, '-o', 'pid,ppid,comm'], 
                                             capture_output=True, text=True)
                    if ps_result.returncode == 0:
                        print(f"  PID {pid}: {ps_result.stdout.split()[3] if len(ps_result.stdout.split()) > 3 else 'unknown'}")
                    
                    # Kill the process
                    os.kill(int(pid), 15)  # SIGTERM
                    print(f"✅ Terminated process {pid}")
                    
                except (ProcessLookupError, ValueError):
                    print(f"⚠️  Process {pid} already terminated or invalid")
                except PermissionError:
                    print(f"❌ Permission denied to kill process {pid}")
                    
            print("🛑 Server stopped successfully")
            return True
            
        else:
            print("ℹ️  No server found running on port 8000")
            return False
            
    except FileNotFoundError:
        print("❌ lsof command not found. Trying alternative method...")
        return try_alternative_method()
    except Exception as e:
        print(f"❌ Error finding server processes: {e}")
        return False

def try_alternative_method():
    """Alternative method using netstat and pkill."""
    try:
        # Try using netstat to find the process
        result = subprocess.run(['netstat', '-tlnp'], capture_output=True, text=True)
        
        if result.returncode == 0:
            lines = result.stdout.split('\n')
            for line in lines:
                if ':8000 ' in line and 'LISTEN' in line:
                    print("🔍 Found server process using netstat")
                    # Try to kill Python processes that might be our server
                    subprocess.run(['pkill', '-f', 'python.*http.server.*8000'], 
                                 capture_output=True)
                    subprocess.run(['pkill', '-f', 'python.*serve.py'], 
                                 capture_output=True)
                    print("✅ Attempted to stop Python HTTP servers")
                    return True
        
        print("ℹ️  No server found running on port 8000")
        return False
        
    except FileNotFoundError:
        print("❌ netstat command not found")
        print("💡 Try manually stopping the server with Ctrl+C")
        return False
    except Exception as e:
        print(f"❌ Error in alternative method: {e}")
        return False

def main():
    print("🛑 Stopping development server...")
    
    success = find_and_kill_server()
    
    if success:
        print("\n🎉 Development server stopped successfully!")
        print("💡 You can restart it with: python3 _scripts/serve.py")
    else:
        print("\n💡 If a server is still running, you can stop it manually:")
        print("   - Press Ctrl+C in the terminal where it's running")
        print("   - Or find the process: lsof -ti:8000 | xargs kill")
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()