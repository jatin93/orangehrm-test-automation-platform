import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class EmployeePage extends BasePage {
  /* ── Name fields (shared between Add Employee & Personal Details) ── */
  private readonly firstNameInput: Locator;
  private readonly middleNameInput: Locator;
  private readonly lastNameInput: Locator;

  /* ── Employee ID ───────────────────────────────────────────────────── */
  private readonly employeeIdInput: Locator;

  /* ── Buttons / toasts ──────────────────────────────────────────────── */
  private readonly saveButton: Locator;
  private readonly successToast: Locator;

  /* ── Job Tab ───────────────────────────────────────────────────────── */
  private readonly jobTabLink: Locator;
  private readonly jobTitleDropdownArrow: Locator;

  constructor(page: Page) {
    super(page);

    // Name inputs — exact accessible names from the recorded script
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });

    // Employee Id input — located via parent group text
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');

    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.successToast = page.locator('.oxd-toast--success');

    // Job tab
    this.jobTabLink = page.getByRole('link', { name: 'Job' });
    this.jobTitleDropdownArrow = page
      .locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow')
      .first();
  }

  /* ================================================================
   *  Locator getters — for direct expect() assertions in tests
   * ================================================================ */

  get firstNameLocator(): Locator {
    return this.firstNameInput;
  }

  get lastNameLocator(): Locator {
    return this.lastNameInput;
  }

  /* ================================================================
   *  Add Employee
   * ================================================================ */

  async fillAddEmployeeForm(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    employeeId?: string;
  }): Promise<string> {
    await this.safeFill(this.firstNameInput, data.firstName);
    if (data.middleName) {
      await this.safeFill(this.middleNameInput, data.middleName);
    }
    await this.safeFill(this.lastNameInput, data.lastName);

    if (data.employeeId) {
      await this.clearAndSetEmployeeId(data.employeeId);
    }

    // Capture the (auto-generated) Employee ID
    return this.getEmployeeId();
  }

  async getEmployeeId(): Promise<string> {
    return this.safeGetInputValue(this.employeeIdInput);
  }

  async clearAndSetEmployeeId(employeeId: string): Promise<void> {
    await this.safeFill(this.employeeIdInput, employeeId);
  }

  async clickSave(): Promise<void> {
    await this.safeClick(this.saveButton);
  }

  async saveAndWait(): Promise<void> {
    await this.clickSave();
    await this.waitForSuccessToast();
  }

  /* ================================================================
   *  Personal Details (Edit)
   * ================================================================ */

  async getEditFirstName(): Promise<string> {
    return this.safeGetInputValue(this.firstNameInput);
  }

  async getEditMiddleName(): Promise<string> {
    return this.safeGetInputValue(this.middleNameInput);
  }

  async getEditLastName(): Promise<string> {
    return this.safeGetInputValue(this.lastNameInput);
  }

  async updateFirstName(firstName: string): Promise<void> {
    await this.safeFill(this.firstNameInput, firstName);
  }

  async updateMiddleName(middleName: string): Promise<void> {
    await this.safeFill(this.middleNameInput, middleName);
  }

  async updateLastName(lastName: string): Promise<void> {
    await this.safeFill(this.lastNameInput, lastName);
  }

  async clickPersonalDetailsSave(): Promise<void> {
    await this.safeClick(this.saveButton);
    await this.waitForSuccessToast();
  }

  /* ================================================================
   *  Job Tab
   * ================================================================ */

  /** Click the "Job" tab link on the employee detail page. */
  async navigateToJobTab(): Promise<void> {
    await this.safeClick(this.jobTabLink);
  }

  /** Open the Job Title dropdown via its arrow icon and select the given title. */
  async selectJobTitle(title: string): Promise<void> {
    await this.safeClick(this.jobTitleDropdownArrow);
    const option = this.page.getByText(title, { exact: true });
    await this.safeClick(option);
  }

  /** Click Save on the Job Details form and wait for success toast. */
  async clickJobSave(): Promise<void> {
    await this.safeClick(this.saveButton);
    await this.waitForSuccessToast();
  }

  /* ================================================================
   *  Helpers
   * ================================================================ */

  async isSuccessToastVisible(): Promise<boolean> {
    return this.isVisible(this.successToast, 10_000);
  }

  private async waitForSuccessToast(): Promise<void> {
    await this.successToast.waitFor({ state: 'visible', timeout: 15_000 });
    await this.successToast.waitFor({ state: 'hidden', timeout: 15_000 });
  }
}
