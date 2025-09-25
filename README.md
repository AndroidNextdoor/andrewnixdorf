
# Andrew Nixdorf — Personal Site

A zero-build, static portfolio website deployed on GitHub Pages with automated CI/CD. Content is data-driven through JSON configuration and supports multiple resume formats.

## Quick Start

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

## Features

- **Data-Driven**: All content managed through JSON configuration
- **Multi-Format Resume**: Auto-generated PDF and DOCX from content
- **Progressive Web App**: Offline support via service worker
- **Responsive Design**: Mobile-first with CSS Grid/Flexbox
- **Accessibility**: WCAG2AA compliant with automated testing
- **Performance**: <100KB total assets, optimized for speed
- **SEO Optimized**: Recruiter-focused optimization with robots.txt and structured data
- **Interactive Elements**: Easter eggs including Konami code and profile picture game
- **Security Configured**: Claude Code permissions with comprehensive allow/deny rules

## Development Scripts

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

## Customization

1. **Update Content**: Modify `assets/data/site.config.json` with your information
2. **Replace Images**: Add your photos to `assets/images/`
3. **Customize Styling**: Edit `css/style.css` for personal branding
4. **Domain Setup**: Update CNAME file, sitemap.xml, and robots.txt with your domain
5. **SEO Configuration**: Update meta tags and structured data for your information
6. **Resume Generation**: Run `python3 _scripts/create_resume.py` to generate new files
7. **Testing**: Use `python3 _scripts/run_tests.py` to validate all changes

## Deployment

- **Auto-Deploy**: Pushes to `main` branch trigger GitHub Pages deployment
- **Quality Gates**: CI runs accessibility, performance, and link validation tests
- **Custom Domain**: Configured for andrewnixdorf.com with HTTPS
- **SEO Ready**: Optimized for search engines and recruiter discovery

---
