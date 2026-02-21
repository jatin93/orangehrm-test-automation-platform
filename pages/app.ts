import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { DashboardPage } from './dashboard.page';
import { PimPage } from './pim.page';
import { EmployeePage } from './employee.page';

export class App {
  public readonly login: LoginPage;
  public readonly dashboard: DashboardPage;
  public readonly pim: PimPage;
  public readonly employee: EmployeePage;

  constructor(public readonly page: Page) {
    this.login = new LoginPage(page);
    this.dashboard = new DashboardPage(page);
    this.pim = new PimPage(page);
    this.employee = new EmployeePage(page);
  }
}
