// @ts-check

/**
 * Helper function to wait for easter egg script to load
 * @param {import('@playwright/test').Page} page
 */
async function waitForEasterEggScript(page) {
  await page.waitForFunction(() => {
    return typeof window.initializeEasterEggs !== 'undefined' ||
           document.querySelector('.brand img')?.onclick !== null;
  }, { timeout: 10000 });
}

/**
 * Helper function to wait for content to load from site.config.json
 * @param {import('@playwright/test').Page} page
 */
async function waitForContentLoad(page) {
  await page.waitForFunction(() => {
    return document.querySelector('#name')?.textContent !== 'Andrew Nixdorf' ||
           document.querySelector('#summary')?.textContent?.length > 0;
  }, { timeout: 10000 });
}

/**
 * Set up console listener to capture console.log messages
 * @param {import('@playwright/test').Page} page
 * @returns {Array<string>} Array that will be populated with console messages
 */
function setupConsoleListener(page) {
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'log') {
      consoleLogs.push(msg.text());
    }
  });
  return consoleLogs;
}

/**
 * Enter the Konami code sequence
 * @param {import('@playwright/test').Page} page
 */
async function enterKonamiCode(page) {
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  for (const key of konamiCode) {
    await page.keyboard.press(key);
  }
}

/**
 * Common locator selectors used across tests
 */
const Selectors = {
  // Navigation
  brandLogo: '.brand img',
  navMenu: 'header.nav nav',
  navProjects: 'nav a[href="#projects"]',
  navExperience: 'nav a[href="#experience"]',
  navCertifications: 'nav a[href="#certifications"]',
  navContact: 'nav a[href="#contact"]',

  // Hero Section
  heroLayout: '.hero-layout',
  name: '#name',
  role: '#role',
  summary: '#summary',
  tags: '#tags',
  heroLinks: '#hero-links',
  profilePic: '.profile-pic',

  // Content Sections
  projectsSection: '#projects-section',
  projects: '#projects',
  projectCards: '#projects .card',
  experienceSection: '#experience-section',
  experience: '#experience',
  experienceCards: '#experience .card',
  certificationsSection: '#certifications-section',
  certifications: '#certifications',
  certificationCards: '#certifications .card',
  contactSection: '#contact',
  contactLinks: '#contact-links',

  // Easter Eggs
  clickEgg: '#click-egg',
  konamiEgg: '#konami-egg',
  secretCommands: '#secret-commands',
  imageSlider: '#image-slider',
  sliderImages: '.slider-image',
  sliderBtnNext: '.slider-btn.next',
  sliderBtnPrev: '.slider-btn.prev',
  sliderDots: '.dot',

  // External Links
  resumeBtn: '.resume-btn',
  resumeDropdown: '#resume-dropdown',
  linkedinLink: '#contact-links a[href*="linkedin.com"]',
  githubLink: '#contact-links a[href*="github.com"]',
  externalLinks: 'a[target="_blank"]',
  githubIcon: '.github-icon',
  keywordTags: '#tags a',

  // Footer
  footer: 'footer.footer'
};

module.exports = {
  waitForEasterEggScript,
  waitForContentLoad,
  setupConsoleListener,
  enterKonamiCode,
  Selectors
};
