import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PimPage extends BasePage {
  private readonly addEmployeeLink: Locator;
  private readonly addEmployeeHeading: Locator;
  private readonly employeeListTab: Locator;
  private readonly employeeIdSearchInput: Locator;
  private readonly searchButton: Locator;
  private readonly spinner: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeLink = page.getByRole('link', { name: 'Add Employee' });
    this.addEmployeeHeading = page.getByRole('heading', {
      name: 'Add Employee',
    });
    this.employeeListTab = page
      .getByRole('listitem')
      .filter({ hasText: 'Employee List' });
    // 3rd textbox on the Employee List page (after sidebar search and employee name)
    this.employeeIdSearchInput = page.getByRole('textbox').nth(2);
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.spinner = page.locator('.oxd-loading-spinner');
  }

  /** Click the "Add Employee" tab and wait for the form to load. */
  async clickAddEmployee(): Promise<void> {
    await this.safeClick(this.addEmployeeLink);
    await this.waitForElement(this.addEmployeeHeading);
  }

  /** Click the "Employee List" tab in the PIM top-nav. */
  async navigateToEmployeeList(): Promise<void> {
    await this.safeClick(this.employeeListTab);
  }

  /** Search the employee list by Employee ID. */
  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.safeFill(this.employeeIdSearchInput, employeeId);
    await this.safeClick(this.searchButton);
    await this.waitForSearchResults();
  }

  /** Search the employee list by Employee Name (autocomplete field — 2nd textbox). */
  async searchByEmployeeName(name: string): Promise<void> {
    const employeeNameInput = this.page.getByRole('textbox').nth(1);
    await this.safeFill(employeeNameInput, name);
    await this.safeClick(this.searchButton);
    await this.waitForSearchResults();
  }

  /** Return a row locator filtered by the given text (e.g. employee name / ID). */
  getEmployeeRow(text: string): Locator {
    return this.page.getByRole('row').filter({ hasText: text });
  }

  /** Click an entire table row that matches the given text — navigates to Personal Details. */
  async clickEmployeeRow(text: string): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: text });
    await this.safeClick(row);
    // Wait for SPA navigation to Personal Details to complete
    await this.page.waitForURL('**/viewPersonalDetails/**', {
      timeout: 15_000,
    });
  }

  /** Click the edit (pencil-icon) button on the first row that contains `text`. */
  async clickEditOnRow(text: string): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: text });
    const editButton = row.locator('i.bi-pencil-fill');
    await this.safeClick(editButton);
    // Wait for SPA navigation to Personal Details to complete
    await this.page.waitForURL('**/viewPersonalDetails/**', {
      timeout: 15_000,
    });
  }

  /** Click on a specific table row by index and open its edit page (backward compat). */
  async clickOnEmployeeRow(rowIndex = 0): Promise<void> {
    const rows = this.page.locator('.oxd-table-body .oxd-table-row');
    const row = rows.nth(rowIndex);
    const editIcon = row.locator('.oxd-icon.bi-pencil-fill');
    await this.safeClick(editIcon);
  }

  /** Return the number of data rows currently displayed in the table. */
  async getEmployeeTableRowCount(): Promise<number> {
    const rows = this.page.locator('.oxd-table-body .oxd-table-row');
    return rows.count();
  }

  private async waitForSearchResults(): Promise<void> {
    try {
      await this.spinner.waitFor({ state: 'visible', timeout: 3_000 });
      await this.spinner.waitFor({ state: 'hidden', timeout: 15_000 });
    } catch {
      // spinner may not appear for fast responses
    }
    await this.page.waitForTimeout(500);
  }
}
