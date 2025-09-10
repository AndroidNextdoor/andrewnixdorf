
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
├── index.html              # Main template with optimized meta tags
├── robots.txt              # SEO crawler instructions for recruiters
├── sitemap.xml             # Search engine sitemap
├── assets/
│   ├── data/site.config.json  # Content configuration
│   ├── andrew-nixdorf-resume.pdf     # Generated PDF resume
│   ├── andrew-nixdorf-resume.docx    # Generated DOCX resume
│   └── images/             # Profile and project images
├── js/
│   ├── app.js              # Core application logic
│   ├── ee.js               # Easter egg functionality (async loaded)
│   └── sw.js               # Service worker (PWA)
├── css/style.css           # Responsive styling with critical CSS inlined
├── test/                   # Testing configurations
│   ├── lychee.toml         # Link checker config
│   ├── pa11yci.json        # Accessibility test config
│   └── lighthouserc.json   # Performance test config
├── _scripts/
│   ├── serve.py            # Development server
│   ├── create_resume.py    # Resume generator
│   └── run_tests.py        # Centralized testing script (mirrors CI/CD)
├── .lycheeci/              # Lychee test reports
├── .lighthouseci/          # Lighthouse test reports
└── .claude/                # Claude Code configuration with security rules
    └── settings.json       # Permissions and MCP server setup
```

## ✨ Features

- **Data-Driven**: All content managed through JSON configuration
- **Multi-Format Resume**: Auto-generated PDF and DOCX from content
- **Progressive Web App**: Offline support via service worker
- **Responsive Design**: Mobile-first with CSS Grid/Flexbox
- **Accessibility**: WCAG2AA compliant with automated testing
- **Performance**: <100KB total assets, optimized for speed
- **SEO Optimized**: Recruiter-focused optimization with robots.txt and structured data
- **Interactive Elements**: Easter eggs including Konami code and profile picture game
- **Security Configured**: Claude Code permissions with comprehensive allow/deny rules

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

To adapt this portfolio for your own use:

1. **Update Content**: Modify `assets/data/site.config.json` with your information
2. **Replace Images**: Add your photos to `assets/images/`
3. **Customize Styling**: Edit `css/style.css` for personal branding
4. **Domain Setup**: Update CNAME file, sitemap.xml, and robots.txt with your domain
5. **SEO Configuration**: Update meta tags and structured data for your information
6. **Resume Generation**: Run `python3 _scripts/create_resume.py` to generate new files
7. **Testing**: Use `python3 _scripts/run_tests.py` to validate all changes

## 🚢 Deployment

- **Auto-Deploy**: Pushes to `main` branch trigger GitHub Pages deployment
- **Quality Gates**: CI runs accessibility, performance, and link validation tests
- **Custom Domain**: Configured for andrewnixdorf.com with HTTPS
- **SEO Ready**: Optimized for search engines and recruiter discovery

## 🎯 Recent Updates

### Performance Optimizations
- **Critical CSS Inlined**: Faster initial page rendering
- **Async Loading**: Easter eggs and non-critical resources load after main content
- **Resource Preloading**: LCP image and critical assets prioritized
- **Font Optimization**: Async font loading prevents render blocking

### SEO & Recruitment Focus
- **robots.txt**: Optimized for recruiter and hiring manager discovery
- **sitemap.xml**: Enhanced search engine indexing
- **Structured Data**: JSON-LD markup for rich search results
- **Meta Tags**: Recruitment-focused keywords and social media optimization

### Testing Infrastructure
- **Centralized Testing**: Single `run_tests.py` script mirrors CI/CD pipeline
- **Quality Thresholds**: Performance (50%), Accessibility (90%), SEO (90%)
- **CI/CD Ready**: All test configs optimized for headless environments
- **Report Organization**: Dedicated directories for test artifacts

### Security & Configuration
- **Claude Code Integration**: Comprehensive permissions and security rules
- **MCP Servers**: GitHub and LinkedIn integrations configured
- **Easter Eggs**: Separated into async-loaded module for better performance

---
