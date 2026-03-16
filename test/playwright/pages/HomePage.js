// @ts-check
const { Selectors, waitForContentLoad, waitForEasterEggScript } = require('../fixtures');

class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Navigation
    this.brandLogo = page.locator(Selectors.brandLogo);
    this.navMenu = page.locator(Selectors.navMenu);
    this.navProjects = page.locator(Selectors.navProjects);
    this.navExperience = page.locator(Selectors.navExperience);
    this.navCertifications = page.locator(Selectors.navCertifications);
    this.navContact = page.locator(Selectors.navContact);

    // Hero Section
    this.heroLayout = page.locator(Selectors.heroLayout);
    this.name = page.locator(Selectors.name);
    this.role = page.locator(Selectors.role);
    this.summary = page.locator(Selectors.summary);
    this.tags = page.locator(Selectors.tags);
    this.profilePic = page.locator(Selectors.profilePic);

    // Content Sections
    this.projectsSection = page.locator(Selectors.projectsSection);
    this.projects = page.locator(Selectors.projects);
    this.projectCards = page.locator(Selectors.projectCards);
    this.experienceSection = page.locator(Selectors.experienceSection);
    this.experience = page.locator(Selectors.experience);
    this.experienceCards = page.locator(Selectors.experienceCards);
    this.certificationsSection = page.locator(Selectors.certificationsSection);
    this.certifications = page.locator(Selectors.certifications);
    this.certificationCards = page.locator(Selectors.certificationCards);
    this.contactSection = page.locator(Selectors.contactSection);
    this.contactLinks = page.locator(Selectors.contactLinks);

    // Easter Eggs
    this.clickEgg = page.locator(Selectors.clickEgg);
    this.konamiEgg = page.locator(Selectors.konamiEgg);
    this.secretCommands = page.locator(Selectors.secretCommands);
    this.imageSlider = page.locator(Selectors.imageSlider);
    this.sliderImages = page.locator(Selectors.sliderImages);
    this.sliderBtnNext = page.locator(Selectors.sliderBtnNext);
    this.sliderBtnPrev = page.locator(Selectors.sliderBtnPrev);
    this.sliderDots = page.locator(Selectors.sliderDots);

    // External Links
    this.linkedinLink = page.locator(Selectors.linkedinLink);
    this.githubLink = page.locator(Selectors.githubLink);
    this.externalLinks = page.locator(Selectors.externalLinks);
    this.keywordTags = page.locator(Selectors.keywordTags);

    // Footer
    this.footer = page.locator(Selectors.footer);
  }

  /**
   * Navigate to home page and wait for content to load
   */
  async goto() {
    await this.page.goto('/');
    await waitForContentLoad(this.page);
  }

  /**
   * Navigate to home page and wait for easter egg script
   */
  async gotoWithEasterEggs() {
    await this.page.goto('/');
    await waitForEasterEggScript(this.page);
  }

  /**
   * Navigate to a specific section by hash
   * @param {string} hash - Section hash (e.g., '#contact')
   */
  async gotoSection(hash) {
    await this.page.goto(`/${hash}`);
    await this.page.waitForTimeout(500);
  }

  /**
   * Click a navigation link
   * @param {'projects' | 'experience' | 'certifications' | 'contact'} section
   */
  async clickNavLink(section) {
    const linkMap = {
      projects: this.navProjects,
      experience: this.navExperience,
      certifications: this.navCertifications,
      contact: this.navContact
    };
    await linkMap[section].click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get a specific project card by index
   * @param {number} index
   */
  getProjectCard(index) {
    return this.projectCards.nth(index);
  }

  /**
   * Get a specific experience card by index
   * @param {number} index
   */
  getExperienceCard(index) {
    return this.experienceCards.nth(index);
  }

  /**
   * Get a specific certification card by index
   * @param {number} index
   */
  getCertificationCard(index) {
    return this.certificationCards.nth(index);
  }
}

module.exports = { HomePage };
