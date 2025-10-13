const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('Core Content Loading & Rendering', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should load site.config.json successfully', async ({ page }) => {
    // Navigate to page with network monitoring
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('site.config.json') && response.status() === 200
    );

    await page.goto('/');
    const configResponse = await responsePromise;

    expect(configResponse.status()).toBe(200);
    expect(configResponse.url()).toContain('site.config.json');

    // Verify we can parse the JSON
    const json = await configResponse.json();
    expect(json.name).toBe('Andrew Nixdorf');
  });

  test('should render name from config', async () => {
    await expect(homePage.name).toBeVisible();
    await expect(homePage.name).toHaveText('Andrew Nixdorf');
  });

  test('should render role from config', async () => {
    await expect(homePage.role).toBeVisible();
    const roleText = await homePage.role.textContent();
    expect(roleText).toContain('Lead SDET');
    expect(roleText).toContain('QA Automation');
    expect(roleText).toContain('AI + AWS');
  });

  test('should render summary from config', async () => {
    await expect(homePage.summary).toBeVisible();
    const summaryText = await homePage.summary.textContent();
    expect(summaryText).toContain('Problem-solver');
    expect(summaryText).toContain('test crafter');
  });

  test('should render keyword tags from config', async () => {
    await expect(homePage.tags).toBeVisible();

    // Check for specific keywords
    const expectedKeywords = ['SDET', 'Katalon Studio', 'Playwright', 'Cypress', 'AWS Bedrock'];

    for (const keyword of expectedKeywords) {
      const tag = homePage.tags.locator(`text="${keyword}"`);
      await expect(tag).toBeVisible();
    }
  });

  test('should render projects section with all cards', async () => {
    await expect(homePage.projectsSection).toBeVisible();

    const cardCount = await homePage.projectCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Should have at least 3 projects based on config
    expect(cardCount).toBeGreaterThanOrEqual(3);
  });

  test('should render project titles correctly', async () => {
    const expectedProjects = [
      'AWS Core Modules (Terraform)',
      'AWS Kickstarter Pro',
      'Katalon AWS Workshop'
    ];

    for (const projectTitle of expectedProjects) {
      const projectCard = homePage.projects.locator(`text="${projectTitle}"`);
      await expect(projectCard).toBeVisible();
    }
  });

  test('should render project descriptions and stack badges', async () => {
    const firstProject = homePage.getProjectCard(0);
    await expect(firstProject).toBeVisible();

    // Check for description
    const description = firstProject.locator('p');
    await expect(description).toBeVisible();
    const descText = await description.textContent();
    expect(descText.length).toBeGreaterThan(20);

    // Check for stack badges
    const badges = firstProject.locator('.badge');
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('should render project repository links', async () => {
    const projectLinks = homePage.projects.locator('a[href*="github.com"]');
    const linkCount = await projectLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(3);

    // Verify first link has correct attributes
    const firstLink = projectLinks.first();
    await expect(firstLink).toHaveAttribute('target', '_blank');
    await expect(firstLink).toHaveAttribute('rel', /noopener/);
  });

  test('should render experience section with all cards', async ({ page }) => {
    const experienceSection = homePage.experienceSection;
    await expect(experienceSection).toBeVisible();

    const experienceCards = page.locator('#experience .card');
    const cardCount = await experienceCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
  });

  test('should render experience with company, title, and period', async ({ page }) => {
    const firstExperience = homePage.getExperienceCard(0);
    await expect(firstExperience).toBeVisible();

    // Check for Zywave experience
    await expect(firstExperience).toContainText('Zywave');
    await expect(firstExperience).toContainText('Lead SDET');
    await expect(firstExperience).toContainText('2023');
    await expect(firstExperience).toContainText('Present');
  });

  test('should render experience highlights as list items', async ({ page }) => {
    const firstExperience = homePage.getExperienceCard(0);
    const highlights = firstExperience.locator('ul li');
    const highlightCount = await highlights.count();

    expect(highlightCount).toBeGreaterThanOrEqual(3);

    // Check first highlight has meaningful content
    const firstHighlight = highlights.first();
    const highlightText = await firstHighlight.textContent();
    expect(highlightText.length).toBeGreaterThan(20);
  });

  test('should render certifications section', async ({ page }) => {
    const certificationsSection = homePage.certificationsSection;
    await expect(certificationsSection).toBeVisible();

    const certificationCards = page.locator('#certifications .card');
    const cardCount = await certificationCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(2);
  });

  test('should render certification details correctly', async ({ page }) => {
    const firstCert = homePage.getCertificationCard(0);
    await expect(firstCert).toBeVisible();

    // Check for AWS certification
    await expect(firstCert).toContainText('AWS Certified Cloud Practitioner');
    await expect(firstCert).toContainText('Amazon Web Services');
    await expect(firstCert).toContainText('April 2018');
  });

  test('should render contact section with links', async ({ page }) => {
    const contactSection = homePage.contactSection;
    await expect(contactSection).toBeVisible();

    const contactLinks = page.locator('#contact-links a');
    const linkCount = await contactLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(2);
  });

  test('should render LinkedIn and GitHub links in contact', async ({ page }) => {
    const linkedinLink = page.locator('#contact-links a[href*="linkedin.com"]');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('target', '_blank');

    const githubLink = page.locator('#contact-links a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('should render footer with current year', async ({ page }) => {
    const footer = page.locator('footer.footer');
    await expect(footer).toBeVisible();

    const currentYear = new Date().getFullYear().toString();
    await expect(footer).toContainText(currentYear);
    await expect(footer).toContainText('Andrew Nixdorf');
  });

  test('should have profile picture with correct attributes', async ({ page }) => {
    const profilePic = page.locator('img.profile-pic');
    await expect(profilePic).toBeVisible();
    await expect(profilePic).toHaveAttribute('alt', 'Andrew Nixdorf Profile');
    await expect(profilePic).toHaveAttribute('src', /ProfilePic\.jpeg/);
  });

});
