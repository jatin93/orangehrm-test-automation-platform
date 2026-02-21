import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  get currentUrl(): string {
    return this.page.url();
  }

  async safeClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async safeFill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    await locator.clear();
    await locator.fill(value);
  }

  async safeGetText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    return (await locator.textContent())?.trim() ?? '';
  }

  async safeGetInputValue(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    return locator.inputValue();
  }

  async isVisible(locator: Locator, timeout = 5_000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(locator: Locator, timeout = 15_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementToDisappear(locator: Locator, timeout = 15_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForUrl(pattern: string | RegExp, timeout = 15_000): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  async retry<T>(
    action: () => Promise<T>,
    { retries = 3, delayMs = 1_000, label = 'action' } = {},
  ): Promise<T> {
    let lastError!: Error;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await action();
      } catch (err) {
        lastError = err as Error;
        if (attempt < retries) await this.page.waitForTimeout(delayMs);
      }
    }
    throw new Error(`"${label}" failed after ${retries} attempts: ${lastError.message}`);
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
