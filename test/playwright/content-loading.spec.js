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
    expect(roleText).toContain('AI Quality Engineering');
    expect(roleText).toContain('SDET');
    expect(roleText).toContain('Edge AI');
  });

  test('should render summary from config', async () => {
    await expect(homePage.summary).toBeVisible();
    const summaryText = await homePage.summary.textContent();
    expect(summaryText).toContain('AI systems trustworthy');
    expect(summaryText).toContain('Lead SDET');
  });

  test('should render keyword tags from config', async () => {
    await expect(homePage.tags).toBeVisible();

    // Check for specific keywords
    const expectedKeywords = ['AI Testing', 'LLM Evaluation', 'Edge AI', 'NVIDIA Jetson', 'Playwright'];

    for (const keyword of expectedKeywords) {
      const tag = homePage.tags.locator(`text="${keyword}"`);
      await expect(tag).toBeVisible();
    }
  });

  test('should render projects section with all cards', async () => {
    await expect(homePage.projectsSection).toBeVisible();

    const cardCount = await homePage.projectCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Should have 4 projects based on config
    expect(cardCount).toBe(4);
  });

  test('should render project titles correctly', async () => {
    const expectedProjects = [
      'OpenClaw Jetson',
      'Jetson AI App',
      'Yahboom Orin Case',
      '/dev/reno'
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
    await expect(firstLink).toHaveAttribute('rel', /noopener noreferrer/);
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
