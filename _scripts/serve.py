#!/usr/bin/env python3
"""
Local development server for the portfolio website.
Serves the site on localhost:8000 (as specified in CLAUDE.md)
"""

import http.server
import socketserver
import os
import sys

def main():
    # Change to the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)
    
    PORT = int(os.environ.get('PORT', 8000))
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=project_root, **kwargs)
    
    print(f"Starting development server at http://localhost:{PORT}")
    print(f"Serving files from: {project_root}")
    print("Press Ctrl+C to stop the server")
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"Error: Port {PORT} is already in use. Please stop any other servers running on this port.")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()