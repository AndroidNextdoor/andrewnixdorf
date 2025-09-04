# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a zero-build, static portfolio website optimized for GitHub Pages deployment with a custom domain (andrewnixdorf.com). The site uses a data-driven architecture with JSON configuration and vanilla web technologies.

## Development Commands

### Local Development
```bash
# Start local development server
python3 -m http.server 8000
# Access at http://localhost:8000
```

### Quality Assurance
```bash
# Validate JSON configuration
jq . data/site.config.json

# Check for broken links (requires lychee)
lychee --config lychee.toml .

# Run accessibility tests (requires pa11y-ci)
pa11y-ci

# Run Lighthouse CI tests (requires @lhci/cli)
lhci autorun
```

## Architecture & Structure

### Data-Driven Content System
All site content is managed through `data/site.config.json`. This includes:
- Personal information and contact details
- Project portfolio with descriptions and links
- Professional experience and skills
- Site metadata and SEO settings

### Key Files
- `index.html` - Main HTML template with semantic structure
- `js/app.js` - Dynamic content loader that populates HTML from JSON config
- `css/style.css` - Responsive CSS with custom properties and mobile-first design
- `sw.js` - Service worker for PWA functionality and caching
- `data/site.config.json` - Central content configuration file

### Progressive Web App Features
- Service worker caches critical assets for offline functionality
- Responsive design with CSS Grid and Flexbox
- Semantic HTML structure for accessibility

## Content Management

### Making Content Changes
1. Edit `data/site.config.json` for all text content, projects, and experience
2. Replace `assets/resume.pdf` when updating resume
3. Update `assets/logo.svg` for branding changes
4. Modify `css/style.css` for styling updates

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