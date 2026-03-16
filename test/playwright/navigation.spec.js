const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('Navigation & Anchor Links', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should have navigation menu visible', async ({ page }) => {
    const nav = page.locator('header.nav nav');
    await expect(nav).toBeVisible();

    // Check for all nav links
    await expect(nav.locator('a[href="#projects"]')).toBeVisible();
    await expect(nav.locator('a[href="#experience"]')).toBeVisible();
    await expect(nav.locator('a[href="#certifications"]')).toBeVisible();
    await expect(nav.locator('a[href="#contact"]')).toBeVisible();
  });

  test('should scroll to projects section when clicking Projects nav link', async ({ page }) => {
    const projectsLink = homePage.navProjects;
    await projectsLink.click();

    // Wait for scroll to complete
    await page.waitForTimeout(500);

    // Check URL hash
    expect(page.url()).toContain('#projects');

    // Verify projects section is visible in viewport
    const projectsSection = page.locator('#projects-section');
    await expect(projectsSection).toBeInViewport();
  });

  test('should scroll to experience section when clicking Experience nav link', async ({ page }) => {
    const experienceLink = homePage.navExperience;
    await experienceLink.click();

    await page.waitForTimeout(500);

    expect(page.url()).toContain('#experience');

    const experienceSection = page.locator('#experience-section');
    await expect(experienceSection).toBeInViewport();
  });

  test('should scroll to certifications section when clicking Certifications nav link', async ({ page }) => {
    const certificationsLink = homePage.navCertifications;
    await certificationsLink.click();

    await page.waitForTimeout(500);

    expect(page.url()).toContain('#certifications');

    const certificationsSection = page.locator('#certifications-section');
    await expect(certificationsSection).toBeInViewport();
  });

  test('should scroll to contact section when clicking Contact nav link', async ({ page }) => {
    const contactLink = homePage.navContact;
    await contactLink.click();

    await page.waitForTimeout(500);

    expect(page.url()).toContain('#contact');

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
  });

  test('should update URL hash when clicking navigation links', async ({ page }) => {
    const projectsLink = homePage.navProjects;
    await projectsLink.click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('#projects');

    const contactLink = homePage.navContact;
    await contactLink.click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('#contact');
  });

  test('should navigate through multiple sections in sequence', async ({ page }) => {
    // Navigate through all sections
    const sections = [
      { link: 'a[href="#projects"]', hash: '#projects', section: '#projects-section' },
      { link: 'a[href="#experience"]', hash: '#experience', section: '#experience-section' },
      { link: 'a[href="#certifications"]', hash: '#certifications', section: '#certifications-section' },
      { link: 'a[href="#contact"]', hash: '#contact', section: '#contact' }
    ];

    for (const { link, hash, section } of sections) {
      await page.locator(`nav ${link}`).click();
      await page.waitForTimeout(500);
      expect(page.url()).toContain(hash);
      await expect(page.locator(section)).toBeInViewport();
    }
  });

  test('should load page with hash and scroll to correct section', async ({ page }) => {
    // Load page directly with hash
    await page.goto('/#contact');
    await page.waitForTimeout(500);

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
    expect(page.url()).toContain('#contact');
  });

  test('should have logo/brand link to home', async ({ page }) => {
    // Navigate to a section first
    await homePage.navContact.click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#contact');

    // Click brand text
    const brandLogo = page.locator('.brand strong');
    await brandLogo.click();

    // Should scroll back to top (URL may or may not change depending on implementation)
    await page.waitForTimeout(500);

    // Verify we can see the hero section
    const heroSection = page.locator('.hero-layout');
    await expect(heroSection).toBeInViewport();
  });

});
