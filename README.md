
# Andrew Nixdorf — Portfolio

A zero-build, static portfolio website deployed on GitHub Pages with automated CI/CD. Content is data-driven through JSON configuration and supports multiple resume formats.

## 🚀 Quick Start

### Local Development
```bash
# Start development server
python3 _scripts/serve.py
# Access at http://localhost:8000
```

### Content Updates
1. Edit `assets/data/site.config.json` for all content, projects, and experience
2. Run `python3 _scripts/create_resume.py` to regenerate resume files
3. Test changes locally before pushing

## 📁 Project Structure

```
├── index.html              # Main template
├── assets/
│   ├── data/site.config.json  # Content configuration
│   ├── andrew-nixdorf-resume.pdf     # Generated PDF resume
│   ├── andrew-nixdorf-resume.docx    # Generated DOCX resume
│   └── logo.svg               # Site branding
├── js/app.js               # Dynamic content loader
├── css/style.css           # Responsive styling
├── sw.js                   # Service worker (PWA)
├── test/                   # Testing configurations
│   ├── lychee.toml         # Link checker config
│   ├── pa11yci.json        # Accessibility test config
│   └── lighthouserc.json   # Performance test config
└── _scripts/
    ├── serve.py            # Development server
    ├── create_resume.py    # Resume generator
    └── run_tests.py        # Local testing (mirrors CI/CD)
```

## ✨ Features

- **Data-Driven**: All content managed through JSON configuration
- **Multi-Format Resume**: Auto-generated PDF and DOCX from content
- **Progressive Web App**: Offline support via service worker
- **Responsive Design**: Mobile-first with CSS Grid/Flexbox
- **Accessibility**: WCAG2AA compliant with automated testing
- **Performance**: <100KB total assets, optimized for speed

## 🛠️ Development Scripts

### Full Test Suite (Recommended)
```bash
# Run all quality gates locally (mirrors CI/CD pipeline)
python3 _scripts/run_tests.py

# Skip dependency checks if tools are already installed
python3 _scripts/run_tests.py --skip-deps

# Use custom port for local server
python3 _scripts/run_tests.py --port 8002
```

### Individual Commands
```bash
# Generate both PDF and DOCX resumes
python3 _scripts/create_resume.py

# Validate JSON configuration
jq . assets/data/site.config.json

# Run accessibility tests (requires pa11y-ci)
pa11y-ci --config test/pa11yci.json

# Check for broken links (requires lychee)
lychee --config test/lychee.toml .

# Run Lighthouse performance tests (requires @lhci/cli)
lhci autorun --config test/lighthouserc.json
```

### Required Dependencies
```bash
# Install testing tools
brew install jq lychee
npm install -g pa11y-ci @lhci/cli
```

### IntelliJ IDEA Integration
Pre-configured run configurations are available for easy development:
- **Run All Tests** - Complete test suite (recommended)
- **Start Dev Server** - Local development server  
- **Generate Resume Files** - Build resume files
- **Individual test commands** - Accessibility, performance, link checking

See [.idea/IDEA_CONFIGURATIONS.md](test/TESTING.md) for complete details.

## 🔧 Customization

- **Content**: Edit `assets/data/site.config.json`
- **Styling**: Modify `css/style.css` (uses CSS custom properties)
- **Branding**: Replace `assets/images/stoked-logo.png`
- **Resume**: Content auto-generated from config, supports dropdown format selection

## 🚢 Deployment

- **Auto-Deploy**: Pushes to `main` branch trigger GitHub Pages deployment
- **Quality Gates**: CI runs accessibility, performance, and link validation tests
- **Custom Domain**: Configured for andrewnixdorf.com with HTTPS

---
