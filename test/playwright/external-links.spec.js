const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('External Links & CTAs', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should have LinkedIn link in contact section', async ({ page }) => {
    const linkedinLink = homePage.linkedinLink;
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/andrewnixdorf/');
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  test('should have GitHub link in contact section', async ({ page }) => {
    const githubLink = homePage.githubLink;
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/AndroidNextdoor');
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('should have rel="noopener" on all external links', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const linkCount = await externalLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    // Check each external link has noopener
    for (let i = 0; i < linkCount; i++) {
      const link = externalLinks.nth(i);
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('should have project repository links that open in new tab', async ({ page }) => {
    const projectRepoLinks = page.locator('#projects a[href*="github.com"]');
    const linkCount = await projectRepoLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(4);

    // Check first project link
    const firstLink = projectRepoLinks.first();
    await expect(firstLink).toHaveAttribute('target', '_blank');
    await expect(firstLink).toHaveAttribute('rel', /noopener/);

    const href = await firstLink.getAttribute('href');
    expect(href).toContain('https://github.com/AndroidNextdoor/');
  });

  test('should have keyword tag links that open in new tab', async ({ page }) => {
    const keywordLinks = page.locator('#tags a');
    const linkCount = await keywordLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Check specific keyword links
    const jetsonLink = page.locator('#tags a[href*="nvidia.com"]').first();
    await expect(jetsonLink).toBeVisible();
    await expect(jetsonLink).toHaveAttribute('target', '_blank');

    const playwrightLink = page.locator('#tags a[href*="playwright.dev"]');
    await expect(playwrightLink).toBeVisible();
    await expect(playwrightLink).toHaveAttribute('target', '_blank');
  });

  test('should verify all keyword links have correct URLs', async ({ page }) => {
    const expectedKeywordLinks = {
      'SDET': 'https://testguild.com/sdet/',
      'Ollama': 'https://ollama.com/',
      'Playwright': 'https://playwright.dev/',
      'Docker': 'https://www.docker.com/',
      'AWS': 'https://aws.amazon.com/',
      '/dev/reno': 'https://devreno.us/'
    };

    for (const [keyword, expectedUrl] of Object.entries(expectedKeywordLinks)) {
      const link = page.locator(`#tags a:has-text("${keyword}")`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', expectedUrl);
    }
  });

  test('should have security attributes on all external CTAs', async ({ page }) => {
    // Check all CTA buttons/links that open externally
    const externalCTAs = page.locator('a[target="_blank"]');
    const ctaCount = await externalCTAs.count();

    for (let i = 0; i < ctaCount; i++) {
      const cta = externalCTAs.nth(i);
      const rel = await cta.getAttribute('rel');

      // Should have noopener and optionally noreferrer for security
      expect(rel).toContain('noopener');
    }
  });

  test('should have working project repository links for all projects', async ({ page }) => {
    const expectedRepoLinks = [
      'https://github.com/AndroidNextdoor/openclaw-jetson',
      'https://github.com/AndroidNextdoor/jetson-ai-app',
      'https://github.com/AndroidNextdoor/yahboom-orin-case',
      'https://github.com/AndroidNextdoor/devreno'
    ];

    for (const repoUrl of expectedRepoLinks) {
      const link = page.locator(`#projects a[href="${repoUrl}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('should verify social media links use HTTPS', async ({ page }) => {
    const linkedinLink = homePage.linkedinLink;
    const linkedinHref = await linkedinLink.getAttribute('href');
    expect(linkedinHref).toMatch(/^https:/);

    const githubLink = homePage.githubLink;
    const githubHref = await githubLink.getAttribute('href');
    expect(githubHref).toMatch(/^https:/);
  });

  test('should have accessible aria-label for icon-only links', async ({ page }) => {
    // GitHub icon links have aria-label instead of text
    const iconLinks = page.locator('#projects a.github-icon');
    const iconLinkCount = await iconLinks.count();

    for (let i = 0; i < iconLinkCount; i++) {
      const link = iconLinks.nth(i);
      const ariaLabel = await link.getAttribute('aria-label');

      // Icon links should have meaningful aria-label
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.length).toBeGreaterThan(0);
      expect(ariaLabel).toContain('View');
      expect(ariaLabel).toContain('source code');
    }
  });

  test('should have visible text for non-icon external links', async ({ page }) => {
    // Check text-based external links (exclude icon-only links)
    const textLinks = page.locator('a[target="_blank"]:not(.github-icon)');
    const linkCount = await textLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = textLinks.nth(i);
      const text = await link.textContent();

      // Link text should be meaningful (not empty)
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

});
