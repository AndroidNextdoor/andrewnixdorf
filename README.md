
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
- **End-to-End Testing**: Comprehensive Playwright test suite (59/61 tests passing - 97%)
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

# Run Playwright easter egg tests
npx playwright test

# Run Playwright tests with UI mode (interactive)
npx playwright test --ui

# View Playwright test report
npx playwright show-report

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

# Install Playwright (for easter egg tests)
npm install -D @playwright/test
npx playwright install chromium
```

### IntelliJ IDEA Integration
Pre-configured run configurations are available for easy development:
- **Run All Tests + Playwright** - Complete test suite including Playwright (recommended)
- **Run All Tests** - Quality gates (accessibility, performance, links)
- **Playwright Easter Egg Tests** - Run Playwright tests
- **Playwright UI Mode** - Interactive Playwright test runner
- **Playwright Show Report** - View last test report
- **Start Dev Server** - Local development server
- **Generate Resume Files** - Build resume files
- **Individual test commands** - Accessibility, performance, link checking

Access these via Run → Run... or the run configuration dropdown in IntelliJ IDEA.

## Testing

### Playwright Test Suite
The site includes comprehensive end-to-end tests covering both interactive features and core functionality:

**Overall Test Coverage: 59/61 passing (97%)**

#### Test Categories

**1. Easter Egg Tests** (`test/playwright/eastereggs.spec.js`) - 17/19 passing
- ✅ Logo click easter egg (10 clicks trigger)
- ✅ Konami code detection (↑↑↓↓←→←→BA)
- ✅ Typing commands (debug, selenium, cypress, playwright)
- ✅ Image slider navigation (keyboard, buttons, dots)
- ✅ Profile picture interactions
- ⚠️ Profile resize game sequences (complex timing - 2 failing)

**2. Content Loading Tests** (`test/playwright/content-loading.spec.js`) - 18/18 passing
- ✅ Site configuration JSON loading and parsing
- ✅ Dynamic content rendering (name, role, summary)
- ✅ Project cards with descriptions and stack badges
- ✅ Experience section with highlights
- ✅ Certifications rendering
- ✅ Contact section with social links
- ✅ Footer and profile picture validation

**3. Navigation Tests** (`test/playwright/navigation.spec.js`) - 9/9 passing
- ✅ Navigation menu visibility and links
- ✅ Anchor link scrolling to sections
- ✅ URL hash updates
- ✅ Direct navigation with hash
- ✅ Sequential section navigation
- ✅ Logo click to home

**4. External Links & CTA Tests** (`test/playwright/external-links.spec.js`) - 15/15 passing
- ✅ LinkedIn and GitHub links with security attributes
- ✅ Resume dropdown with PDF/DOCX options
- ✅ Project repository links
- ✅ Keyword tag links with correct URLs
- ✅ rel="noopener" on all external links
- ✅ HTTPS verification for social media links
- ✅ Accessible aria-labels for icon-only links

**Test Files & Configuration**
- Configuration: `playwright.config.js`
- Test suites: `test/playwright/*.spec.js`
- Reports: `playwright-report/` (after running tests)

**Running Tests**
```bash
# Command line
npx playwright test                    # Run all tests
npx playwright test --ui               # Interactive mode
npx playwright test --reporter=html    # Generate HTML report
npx playwright show-report             # View last report

# Run specific test suites
npx playwright test content-loading    # Content tests only
npx playwright test navigation          # Navigation tests only
npx playwright test external-links      # CTA/links tests only
npx playwright test eastereggs          # Easter egg tests only

# IntelliJ IDEA
# Use the pre-configured run configurations listed above
```

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
- **Quality Gates**: CI runs accessibility, performance, link validation, and Playwright tests
- **Test Artifacts**: Test reports and Playwright results available in GitHub Actions artifacts
- **Custom Domain**: Configured for andrewnixdorf.com with HTTPS
- **SEO Ready**: Optimized for search engines and recruiter discovery

---
