import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  private readonly sidePanel: Locator;
  private readonly pimLink: Locator;
  private readonly userDropdown: Locator;
  private readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.sidePanel = page.getByLabel('Sidepanel');
    this.pimLink = page.getByRole('link', { name: 'PIM' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  /** Expose the Sidepanel locator for direct assertions in tests. */
  get sidePanelLocator(): Locator {
    return this.sidePanel;
  }

  /** Check whether the left-side navigation panel is visible. */
  async isSidePanelVisible(): Promise<boolean> {
    return this.isVisible(this.sidePanel);
  }

  /** Return all visible side-nav menu item labels. */
  async getSideNavMenuItems(): Promise<string[]> {
    await this.waitForElement(this.sidePanel);
    const items = await this.sidePanel
      .locator('.oxd-main-menu-item span')
      .allTextContents();
    return items.map((t) => t.trim()).filter((t) => t.length > 0);
  }

  /** Navigate to any module by name (kept for backward compatibility / API tests). */
  async navigateToModule(moduleName: string): Promise<void> {
    const menuItem = this.page.locator('.oxd-main-menu-item span', {
      hasText: new RegExp(`^${moduleName}$`, 'i'),
    });
    await this.safeClick(menuItem);
  }

  /** Navigate specifically to the PIM module via sidebar link. */
  async navigateToPIM(): Promise<void> {
    await this.safeClick(this.pimLink);
  }

  /** Open user dropdown and click the Logout menu item. */
  async logout(): Promise<void> {
    await this.safeClick(this.userDropdown);
    await this.safeClick(this.logoutMenuItem);
  }
}
