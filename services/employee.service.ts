import { BrowserContext } from '@playwright/test';
import { ENV } from '../config/environment';
import type {
  ApiEmployeeListResponse,
  ApiEmployee,
  ApiCreatedEmployee,
  CreateEmployeeResponse,
} from '../testdata';

/**
 * Employee API service.
 * Uses the browser context's request (shares session cookies automatically).
 */
export class EmployeeService {
  constructor(private readonly context: BrowserContext) {}

  /**
   * Fetch employee list using the detailed model.
   */
  async getEmployees(params?: {
    limit?: number;
    offset?: number;
    employeeId?: string;
  }): Promise<ApiEmployeeListResponse> {
    const queryParams = new URLSearchParams({
      limit: String(params?.limit ?? 50),
      offset: String(params?.offset ?? 0),
      model: 'detailed',
      includeEmployees: 'onlyCurrent',
      sortField: 'employee.firstName',
      sortOrder: 'ASC',
    });

    if (params?.employeeId) {
      queryParams.set('employeeId', params.employeeId);
    }

    const response = await this.context.request.get(
      `${ENV.API_BASE_URL}/pim/employees?${queryParams}`,
    );

    if (!response.ok()) {
      throw new Error(`getEmployees failed: ${response.status()} ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * Search for a single employee by employeeId.
   */
  async getEmployeeById(employeeId: string): Promise<ApiEmployee | null> {
    const response = await this.getEmployees({ employeeId, limit: 50 });
    return response.data.find((e) => e.employeeId === employeeId) ?? null;
  }

  /**
   * Create a new employee via POST.
   */
  async createEmployee(data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    employeeId: string;
  }): Promise<ApiCreatedEmployee> {
    const response = await this.context.request.post(
      `${ENV.API_BASE_URL}/pim/employees`,
      {
        data: {
          firstName: data.firstName,
          middleName: data.middleName ?? '',
          lastName: data.lastName,
          employeeId: data.employeeId,
          empPicture: null,
        },
      },
    );

    if (!response.ok()) {
      throw new Error(`createEmployee failed: ${response.status()} ${await response.text()}`);
    }

    const json: CreateEmployeeResponse = await response.json();
    return json.data;
  }
}
