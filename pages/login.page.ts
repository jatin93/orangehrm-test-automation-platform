import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'username' });
    this.passwordInput = page.getByRole('textbox', { name: 'password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async enterUsername(username: string): Promise<void> {
    await this.safeFill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.safeFill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.safeClick(this.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /** Return the Login button locator for direct assertions in tests. */
  get loginButtonLocator(): Locator {
    return this.loginButton;
  }

  async isLoginPageVisible(): Promise<boolean> {
    return this.isVisible(this.loginButton);
  }
}
