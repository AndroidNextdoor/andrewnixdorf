# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a zero-build, static portfolio website optimized for GitHub Pages deployment with a custom domain (andrewnixdorf.com). The site uses a data-driven architecture with JSON configuration and vanilla web technologies.

## Development Commands

### Local Development
```bash
# Start local development server
python3 _scripts/serve.py
# Access at http://localhost:8000

# Alternative (manual method)
python3 -m http.server 8000
```

### Resume Generation
```bash
# Generate both PDF and DOCX resume formats
python3 _scripts/create_resume.py
```

### Quality Assurance
```bash
# Run all quality gates locally (recommended - mirrors CI/CD pipeline)
python3 _scripts/run_tests.py

# Individual test commands:
# Validate JSON configuration
jq . assets/data/site.config.json

# Check for broken links (requires lychee)
lychee --config test/lychee.toml .

# Run accessibility tests (requires pa11y-ci)  
pa11y-ci --config test/pa11yci.json

# Run Lighthouse CI tests (requires @lhci/cli)
lhci autorun --config test/lighthouserc.json
```

## Architecture & Structure

### Data-Driven Content System
All site content is managed through `assets/data/site.config.json`. This includes:
- Personal information and contact details
- Project portfolio with descriptions and links
- Professional experience and skills
- Site metadata and SEO settings

### Key Files
- `index.html` - Main HTML template with semantic structure
- `js/app.js` - Dynamic content loader that populates HTML from JSON config
- `css/style.css` - Responsive CSS with custom properties and mobile-first design
- `sw.js` - Service worker for PWA functionality and caching
- `assets/data/site.config.json` - Central content configuration file
- `_scripts/` - Development and build scripts
  - `serve.py` - Local development server
  - `create_resume.py` - Resume generation script

### Progressive Web App Features
- Service worker caches critical assets for offline functionality
- Responsive design with CSS Grid and Flexbox
- Semantic HTML structure for accessibility

## Content Management

### Making Content Changes
1. Edit `assets/data/site.config.json` for all text content, projects, and experience
2. Run `python3 _scripts/create_resume.py` to regenerate resume files after content changes
3. Update `assets/logo.svg` for branding changes
4. Modify `css/style.css` for styling updates

### Resume Management
The site supports both PDF and DOCX resume formats:
- Resumes are auto-generated from `assets/data/site.config.json`
- Users can select format via dropdown: PDF or DOCX
- To update resumes: modify the config file and run the resume generation script

### JSON Configuration Structure
The site config contains these main sections:
- `personal` - Name, title, bio, contact information
- `projects` - Portfolio items with descriptions and links
- `experience` - Work history and skills
- `meta` - SEO metadata and site settings

## Deployment

### GitHub Pages
- Deploys automatically on pushes to main branch
- Custom domain configured via CNAME file
- SSL/HTTPS automatically enforced

### Quality Gates
The site enforces quality standards through CI:
- **Performance**: 80% minimum Lighthouse score
- **Accessibility**: 90% minimum (WCAG2AA compliance)
- **SEO**: 90% minimum Lighthouse score
- **Link Validation**: All external links must be accessible

## Development Guidelines

### Performance Considerations
- Keep assets minimal (currently <100KB total)
- Service worker caches critical files
- CSS uses custom properties for efficient theming
- JavaScript is vanilla ES6+ for minimal overhead

### Accessibility Requirements
- Maintain semantic HTML structure
- Ensure color contrast meets WCAG2AA standards
- Include appropriate ARIA labels where needed
- Test with pa11y-ci before deployment

### Browser Support
- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- Service Worker support for PWA features

## Recent Updates & Important Notes

### SEO & Recruitment Optimization
- `robots.txt` - Optimized for recruiter discovery with targeted crawling instructions
- `sitemap.xml` - Enhanced for search engine indexing of key content
- Meta tags enhanced with recruitment-focused keywords and structured data
- LinkedIn, Twitter/X card optimization for professional sharing

### Performance Optimizations  
- Critical CSS inlined in HTML head for faster rendering
- Easter egg functionality moved to separate `js/ee.js` file loaded asynchronously
- Resource preloading for LCP image and critical assets
- Async font loading to prevent render blocking

### Testing Infrastructure
- **Centralized Testing**: Use `python3 _scripts/run_tests.py` for all quality gates
- **Test Reports**: Lychee reports saved to `.lycheeci/` directory
- **CI/CD Ready**: All test configs optimized for headless browser environments
- **Quality Thresholds**: Performance (50%), Accessibility (90%), SEO (90%)

### Security Configuration
- Claude Code permissions configured with allow/deny rules in `.claude/settings.json`
- Comprehensive security deny rules prevent dangerous operations
- Allow list includes only essential development operations

### File Organization
- All test configurations moved to `test/` directory
- Easter egg functionality separated for better maintainability
- Reports organized in dedicated directories (`.lycheeci/`, `.lighthouseci/`)