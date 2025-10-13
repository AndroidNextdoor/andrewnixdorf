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

  test('should have resume dropdown button', async ({ page }) => {
    const resumeButton = homePage.resumeBtn;
    await expect(resumeButton).toBeVisible();
    await expect(resumeButton).toContainText('Resume');
  });

  test('should have resume dropdown with PDF and DOCX options', async ({ page }) => {
    const resumeDropdown = homePage.resumeDropdown;

    // Dropdown should exist (may be hidden initially)
    const pdfLink = resumeDropdown.locator('a[href*=".pdf"]');
    const docxLink = resumeDropdown.locator('a[href*=".docx"]');

    await expect(pdfLink).toHaveAttribute('href', /andrew-nixdorf-resume\.pdf/);
    await expect(docxLink).toHaveAttribute('href', /andrew-nixdorf-resume\.docx/);
  });

  test('should have PDF resume link with correct attributes', async ({ page }) => {
    const pdfLink = page.locator('#resume-dropdown a[href*=".pdf"]');
    await expect(pdfLink).toContainText('PDF');
    await expect(pdfLink).toHaveAttribute('target', '_blank');
    await expect(pdfLink).toHaveAttribute('rel', /noopener/);

    const href = await pdfLink.getAttribute('href');
    expect(href).toContain('.pdf');
    expect(href).toContain('andrew-nixdorf-resume');
  });

  test('should have DOCX resume link with correct attributes', async ({ page }) => {
    const docxLink = page.locator('#resume-dropdown a[href*=".docx"]');
    await expect(docxLink).toContainText('DOCX');
    await expect(docxLink).toHaveAttribute('target', '_blank');
    await expect(docxLink).toHaveAttribute('rel', /noopener/);

    const href = await docxLink.getAttribute('href');
    expect(href).toContain('.docx');
    expect(href).toContain('andrew-nixdorf-resume');
  });

  test('should have project repository links that open in new tab', async ({ page }) => {
    const projectRepoLinks = page.locator('#projects a[href*="github.com"]');
    const linkCount = await projectRepoLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(3);

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
    const katalonLink = page.locator('#tags a[href*="katalon.com"]');
    await expect(katalonLink).toBeVisible();
    await expect(katalonLink).toHaveAttribute('target', '_blank');

    const playwrightLink = page.locator('#tags a[href*="playwright.dev"]');
    await expect(playwrightLink).toBeVisible();
    await expect(playwrightLink).toHaveAttribute('target', '_blank');
  });

  test('should verify all keyword links have correct URLs', async ({ page }) => {
    const expectedKeywordLinks = {
      'SDET': 'https://testguild.com/sdet/',
      'Katalon Studio': 'https://katalon.com/',
      'Playwright': 'https://playwright.dev/',
      'Cypress': 'https://www.cypress.io/',
      'AWS Bedrock': 'https://aws.amazon.com/bedrock/',
      '/dev/reno': 'https://devreno.us/'
    };

    for (const [keyword, expectedUrl] of Object.entries(expectedKeywordLinks)) {
      const link = page.locator(`#tags a:has-text("${keyword}")`);
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
      'https://github.com/AndroidNextdoor/aws-core-modules-tf',
      'https://github.com/AndroidNextdoor/aws-kickstarter',
      'https://github.com/AndroidNextdoor/katalon-aws-workshop'
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
