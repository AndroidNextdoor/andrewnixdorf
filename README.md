
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
│   ├── resume.pdf             # Generated PDF resume
│   ├── resume.docx            # Generated DOCX resume
│   └── logo.svg               # Site branding
├── js/app.js               # Dynamic content loader
├── css/style.css           # Responsive styling
├── sw.js                   # Service worker (PWA)
└── _scripts/
    ├── serve.py            # Development server
    └── create_resume.py    # Resume generator
```

## ✨ Features

- **Data-Driven**: All content managed through JSON configuration
- **Multi-Format Resume**: Auto-generated PDF and DOCX from content
- **Progressive Web App**: Offline support via service worker
- **Responsive Design**: Mobile-first with CSS Grid/Flexbox
- **Accessibility**: WCAG2AA compliant with automated testing
- **Performance**: <100KB total assets, optimized for speed

## 🛠️ Development Scripts

```bash
# Generate both PDF and DOCX resumes
python3 _scripts/create_resume.py

# Validate JSON configuration
jq . assets/data/site.config.json

# Run accessibility tests (requires pa11y-ci)
pa11y-ci

# Check for broken links (requires lychee)
lychee --config lychee.toml .
```

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
