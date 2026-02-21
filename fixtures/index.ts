import { test as base, expect } from '@playwright/test';
import { App } from '../pages/app';
import { EmployeeDataBuilder } from '../testdata';
import { EmployeeService } from '../services/employee.service';
import { ENV } from '../config/environment';
import type { EmployeeData } from '../testdata';

type Fixtures = {
  app: App;
  testData: EmployeeData;
  employeeService: EmployeeService;
  loggedInApp: App;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use(new App(page));
  },

  testData: async ({}, use) => {
    const data = new EmployeeDataBuilder().build();
    await use(data);
  },

  // employeeService uses the browser context (shares session cookies after login)
  employeeService: async ({ context }, use) => {
    await use(new EmployeeService(context));
  },

  loggedInApp: async ({ page }, use) => {
    const app = new App(page);
    await page.goto(ENV.BASE_URL);
    await app.login.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    await page.waitForURL('**/dashboard/**', { timeout: 15_000 });
    await use(app);
  },
});

export { expect };
