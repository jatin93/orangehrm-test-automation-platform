import { test, expect } from '../../fixtures';
import { ENV } from '../../config/environment';

test.describe('OrangeHRM Employee Management — UI E2E', () => {
  test('Complete employee lifecycle: add, search, edit job title, logout', async ({
    page,
    app,
    testData,
  }) => {
    let employeeId: string;

    /* ──────────────────────────────────────────────────────────────
     * Step 1-2 · Navigate to OrangeHRM and login
     * ──────────────────────────────────────────────────────────── */
    await test.step('Navigate to OrangeHRM and login with admin credentials', async () => {
      await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
      );

      await app.login.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
      await page.waitForURL('**/dashboard/**', { timeout: 15_000 });

      await expect(
        page,
        'User should be redirected to the Dashboard after login',
      ).toHaveURL(/dashboard/);
    });

    /* ──────────────────────────────────────────────────────────────
     * Step 3 · Verify left-side navigation menu
     * ──────────────────────────────────────────────────────────── */
    await test.step('Verify the left-side navigation menu is displayed and functional', async () => {
      const sidePanel = app.dashboard.sidePanelLocator;

      await expect(
        sidePanel,
        'Left-side navigation panel should be visible after login',
      ).toBeVisible();

      const expectedModules = [
        'Admin',
        'PIM',
        'Leave',
        'Time',
        'Recruitment',
        'My Info',
        'Performance',
        'Dashboard',
        'Directory',
        'Maintenance',
        'Claim',
        'Buzz',
      ];

      for (const module of expectedModules) {
        await expect(
          sidePanel,
          `Side panel should contain the "${module}" module`,
        ).toContainText(module);
      }
    });

    /* ──────────────────────────────────────────────────────────────
     * Step 4-5 · Navigate to PIM and add a new employee
     * ──────────────────────────────────────────────────────────── */
    await test.step('Navigate to PIM, add a new employee, and capture the Employee ID', async () => {
      // Click "PIM" in the sidebar
      await app.dashboard.navigateToPIM();

      // Click "Add Employee" tab and wait for the form
      await app.pim.clickAddEmployee();

      // Fill name fields with generated test data
      employeeId = await app.employee.fillAddEmployeeForm({
        firstName: testData.firstName,
        middleName: testData.middleName,
        lastName: testData.lastName,
      });

      expect(
        employeeId,
        'Auto-generated Employee ID should not be empty',
      ).toBeTruthy();

      // Save — waits for success toast to appear and disappear
      await app.employee.saveAndWait();

      // Verify redirect to Personal Details with correct first name
      await expect(
        app.employee.firstNameLocator,
        'First name on Personal Details should match the entered value',
      ).toHaveValue(testData.firstName);

      test.info().annotations.push({
        type: 'employee_id',
        description: employeeId,
      });
    });

    /* ──────────────────────────────────────────────────────────────
     * Step 6 · Validate employee in the Employee List
     * ──────────────────────────────────────────────────────────── */
    await test.step('Validate that the employee appears in the Employee List with correct details', async () => {
      // Navigate to Employee List tab
      await app.pim.navigateToEmployeeList();

      // Search by the captured Employee ID
      await app.pim.searchByEmployeeId(employeeId);

      // Assert a row containing the employee data is visible
      const employeeRow = app.pim.getEmployeeRow(testData.firstName);

      await expect(
        employeeRow,
        'Employee row should be visible in search results',
      ).toBeVisible();

      await expect(
        employeeRow,
        'Employee row should display the correct Employee ID',
      ).toContainText(employeeId);

      await expect(
        employeeRow,
        'Employee row should display the correct first name',
      ).toContainText(testData.firstName);

      await expect(
        employeeRow,
        'Employee row should display the correct last name',
      ).toContainText(testData.lastName);
    });

    /* ──────────────────────────────────────────────────────────────
     * Step 7 · Edit employee details (job title) and validate
     * ──────────────────────────────────────────────────────────── */
    await test.step('Edit the employee job title and validate the update', async () => {
      // Click the row to navigate to the employee's Personal Details
      await app.pim.clickEmployeeRow(testData.firstName);

      // Verify personal details match
      await expect(
        app.employee.firstNameLocator,
        'First name should match the originally entered value',
      ).toHaveValue(testData.firstName);

      await expect(
        app.employee.lastNameLocator,
        'Last name should match the originally entered value',
      ).toHaveValue(testData.lastName);

      // Navigate to the Job tab
      await app.employee.navigateToJobTab();

      // Select "Account Assistant" from the Job Title dropdown
      await app.employee.selectJobTitle('Account Assistant');

      // Save job details — success toast confirms the update
      await app.employee.clickJobSave();
    });

    /* ──────────────────────────────────────────────────────────────
     * Step 8 · Logout and validate
     * ──────────────────────────────────────────────────────────── */
    await test.step('Logout from the application and validate the login page', async () => {
      await app.dashboard.logout();

      // Assert redirect to login URL
      await expect(
        page,
        'User should be redirected to the login page after logout',
      ).toHaveURL(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
      );

      // Assert the Login button is visible
      await expect(
        app.login.loginButtonLocator,
        'Login button should be visible on the login page',
      ).toBeVisible();

      await expect(
        app.login.loginButtonLocator,
        'Login button should display the text "Login"',
      ).toContainText('Login');
    });
  });
});
