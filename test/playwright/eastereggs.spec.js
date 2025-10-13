// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');
const { waitForEasterEggScript, setupConsoleListener, enterKonamiCode } = require('./fixtures');

test.describe('Easter Eggs - Logo Click Easter Egg', () => {
  test('should trigger easter egg after 10 logo clicks', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Click the logo 10 times
    for (let i = 0; i < 10; i++) {
      await homePage.brandLogo.click();
    }

    // Wait a moment for the easter egg to trigger
    await page.waitForTimeout(500);

    // Verify console logs show counting and easter egg activation
    expect(consoleLogs.some(log => log.includes('Logo clicks: 10'))).toBeTruthy();
    expect(consoleLogs.some(log => log.includes('Easter egg activated: click-egg'))).toBeTruthy();

    // Verify the easter egg element becomes visible
    await expect(homePage.clickEgg).toBeVisible();

    // Wait for it to auto-hide after 4 seconds
    await page.waitForTimeout(4500);
    await expect(homePage.clickEgg).toBeHidden();
  });

  test('should reset counter after triggering easter egg', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Click 10 times to trigger
    for (let i = 0; i < 10; i++) {
      await homePage.brandLogo.click();
    }

    await page.waitForTimeout(500);

    // Clear logs and click once more
    consoleLogs.length = 0;
    await homePage.brandLogo.click();

    // Should show "Logo clicks: 1" not 11
    expect(consoleLogs.some(log => log.includes('Logo clicks: 1'))).toBeTruthy();
  });
});

test.describe('Easter Eggs - Konami Code', () => {
  test('should trigger easter egg when Konami code is entered', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Enter Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
    await enterKonamiCode(page);
    await page.waitForTimeout(500);

    // Verify easter egg triggered
    expect(consoleLogs.some(log => log.includes('Easter egg activated: konami-egg'))).toBeTruthy();
    expect(consoleLogs.some(log => log.includes('Gamer mode unlocked'))).toBeTruthy();

    await expect(homePage.konamiEgg).toBeVisible();
  });

  test('should not trigger if wrong sequence is entered', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Wrong sequence
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');

    await page.waitForTimeout(500);

    // Should not trigger
    expect(consoleLogs.some(log => log.includes('Easter egg activated: konami-egg'))).toBeFalsy();
  });
});

test.describe('Easter Eggs - Typing Commands', () => {
  test('should trigger easter egg when "debug" is typed', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    await page.keyboard.type('debug');
    await page.waitForTimeout(500);

    expect(consoleLogs.some(log => log.includes('Easter egg activated: secret-commands'))).toBeTruthy();
    await expect(homePage.secretCommands).toBeVisible();
  });

  test('should trigger easter egg when "selenium" is typed', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    await page.keyboard.type('selenium');
    await page.waitForTimeout(500);

    expect(consoleLogs.some(log => log.includes('Easter egg activated: secret-commands'))).toBeTruthy();
    await expect(homePage.secretCommands).toBeVisible();
  });

  test('should trigger easter egg when "cypress" is typed', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    await page.keyboard.type('cypress');
    await page.waitForTimeout(500);

    expect(consoleLogs.some(log => log.includes('Easter egg activated: secret-commands'))).toBeTruthy();
    await expect(homePage.secretCommands).toBeVisible();
  });

  test('should trigger easter egg when "playwright" is typed', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    await page.keyboard.type('playwright');
    await page.waitForTimeout(500);

    expect(consoleLogs.some(log => log.includes('Easter egg activated: secret-commands'))).toBeTruthy();
    await expect(homePage.secretCommands).toBeVisible();
  });

  test('should work with mixed text before trigger word', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Type random text followed by trigger word
    await page.keyboard.type('hello world playwright');
    await page.waitForTimeout(500);

    expect(consoleLogs.some(log => log.includes('Easter egg activated: secret-commands'))).toBeTruthy();
  });
});

test.describe('Easter Eggs - Profile Picture Resize Game', () => {
  test('should open image slider when profile pic is clicked normally', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    // Image slider should be visible
    await expect(homePage.imageSlider).toBeVisible();

    // Close the slider
    await page.keyboard.press('Escape');
    await expect(homePage.imageSlider).toBeHidden();
  });

  test('should play resize game after Konami code is activated', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Enter Konami code to unlock gamer mode
    await enterKonamiCode(page);
    await page.waitForTimeout(500);

    // Clear logs
    consoleLogs.length = 0;

    // Click profile picture
    await homePage.profilePic.click();
    await page.waitForTimeout(500);

    // Should show shrinking message
    expect(consoleLogs.some(log => log.includes('Shrinking'))).toBeTruthy();

    // Image slider should NOT be visible (game mode active)
    await expect(homePage.imageSlider).toBeHidden();
  });

  test.skip('should shrink and grow profile picture through game sequence', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Enter Konami code
    await enterKonamiCode(page);
    await page.waitForTimeout(500);
    consoleLogs.length = 0;

    // Use force click to bypass any overlapping elements
    // Click multiple times to shrink
    for (let i = 0; i < 25; i++) {
      await homePage.profilePic.click({ force: true });
      await page.waitForTimeout(100);
    }

    // Should have shrinking messages
    expect(consoleLogs.some(log => log.includes('Shrinking'))).toBeTruthy();

    // Eventually should switch to growing
    expect(consoleLogs.some(log => log.includes('Now growing phase'))).toBeTruthy();
    expect(consoleLogs.some(log => log.includes('Growing'))).toBeTruthy();
  });

  test.skip('should trigger explosion effect at maximum size', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    const consoleLogs = setupConsoleListener(page);

    // Enter Konami code
    await enterKonamiCode(page);
    await page.waitForTimeout(500);
    consoleLogs.length = 0;

    // Use force click to bypass any overlapping elements
    // Click many times to trigger full cycle
    for (let i = 0; i < 50; i++) {
      await homePage.profilePic.click({ force: true });
      await page.waitForTimeout(50);
    }

    // Should see explosion
    expect(consoleLogs.some(log => log.includes('EXPLOSION'))).toBeTruthy();

    // Should reset
    await page.waitForTimeout(2000);
    expect(consoleLogs.some(log => log.includes('Profile resize game reset'))).toBeTruthy();
  });
});

test.describe('Easter Eggs - Image Slider', () => {
  test('should open image slider when clicking profile picture', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    await expect(homePage.imageSlider).toBeVisible();
  });

  test('should close slider with Escape key', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    await expect(homePage.imageSlider).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(homePage.imageSlider).toBeHidden();
  });

  test('should close slider when clicking outside', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    await expect(homePage.imageSlider).toBeVisible();

    // Click on the modal backdrop
    await homePage.imageSlider.click({ position: { x: 10, y: 10 } });
    await expect(homePage.imageSlider).toBeHidden();
  });

  test('should navigate through slides with next button', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    await expect(homePage.imageSlider).toBeVisible();

    // Find and click next button
    await homePage.sliderBtnNext.click();

    // Verify second slide is active
    await expect(homePage.sliderImages.nth(1)).toHaveClass(/active/);
  });

  test('should navigate through slides with prev button', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    await expect(homePage.imageSlider).toBeVisible();

    // Click prev to go to last slide (loops around)
    await homePage.sliderBtnPrev.click();

    // Should loop to the last slide
    const count = await homePage.sliderImages.count();
    const lastSlide = homePage.sliderImages.nth(count - 1);
    await expect(lastSlide).toHaveClass(/active/);
  });

  test('should navigate using dot indicators', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoWithEasterEggs();

    await homePage.profilePic.click();

    await expect(homePage.imageSlider).toBeVisible();

    // Click second dot (there are only 2 slides)
    await homePage.sliderDots.nth(1).click();

    // Second slide should be active
    await expect(homePage.sliderImages.nth(1)).toHaveClass(/active/);
  });
});