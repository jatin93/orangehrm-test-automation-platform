import { test, expect } from '../../fixtures';
import { faker } from '@faker-js/faker';

test.describe('Employee Management — API Tests', () => {
  /* ================================================================
   * Scenario 1 + 4
   * Fetch the employee list and validate the detailed response
   * structure (jobTitle, subunit, empStatus, supervisors).
   * ================================================================ */
  test('should fetch employee list and validate detailed response structure', async ({
    loggedInApp,
    employeeService,
  }) => {
    // loggedInApp must be requested so the login fixture runs and sets the session cookie
    void loggedInApp;

    const response = await employeeService.getEmployees({ limit: 10 });

    /* ── top-level structure ─────────────────────────────────── */
    expect(response, 'Response should contain data array').toHaveProperty('data');
    expect(response, 'Response should contain meta object').toHaveProperty('meta');
    expect(response.meta, 'Meta should include total count').toHaveProperty('total');
    expect(
      Array.isArray(response.data),
      'data should be an array',
    ).toBeTruthy();
    expect(
      response.data.length,
      'Employee list should not be empty',
    ).toBeGreaterThan(0);
    expect(
      response.meta.total,
      'Total employee count should be positive',
    ).toBeGreaterThan(0);

    /* ── pick the first employee and validate schema ─────────── */
    const employee = response.data[0];

    // Core scalar fields
    expect(employee, 'Employee should have empNumber').toHaveProperty('empNumber');
    expect(employee, 'Employee should have employeeId').toHaveProperty('employeeId');
    expect(employee, 'Employee should have firstName').toHaveProperty('firstName');
    expect(employee, 'Employee should have lastName').toHaveProperty('lastName');
    expect(employee, 'Employee should have middleName').toHaveProperty('middleName');
    expect(employee, 'Employee should have terminationId').toHaveProperty('terminationId');

    // Data types
    expect(typeof employee.empNumber, 'empNumber should be a number').toBe('number');
    expect(typeof employee.firstName, 'firstName should be a string').toBe('string');
    expect(typeof employee.lastName, 'lastName should be a string').toBe('string');
    expect(typeof employee.employeeId, 'employeeId should be a string').toBe('string');

    // Nested jobTitle object
    expect(employee, 'Employee should have jobTitle object').toHaveProperty('jobTitle');
    expect(employee.jobTitle, 'jobTitle should have id').toHaveProperty('id');
    expect(employee.jobTitle, 'jobTitle should have title').toHaveProperty('title');
    expect(employee.jobTitle, 'jobTitle should have isDeleted').toHaveProperty('isDeleted');

    // Nested subunit object
    expect(employee, 'Employee should have subunit object').toHaveProperty('subunit');
    expect(employee.subunit, 'subunit should have id').toHaveProperty('id');
    expect(employee.subunit, 'subunit should have name').toHaveProperty('name');

    // Nested empStatus object
    expect(employee, 'Employee should have empStatus object').toHaveProperty('empStatus');
    expect(employee.empStatus, 'empStatus should have id').toHaveProperty('id');
    expect(employee.empStatus, 'empStatus should have name').toHaveProperty('name');

    // Supervisors array
    expect(employee, 'Employee should have supervisors array').toHaveProperty('supervisors');
    expect(
      Array.isArray(employee.supervisors),
      'supervisors should be an array',
    ).toBeTruthy();
  });

  /* ================================================================
   * Scenario 2
   * Create an employee via API (POST), then search for it in the
   * employee list (GET) and validate the data matches.
   * ================================================================ */
  test('should create employee via API and find in employee list', async ({
    loggedInApp,
    employeeService,
    testData,
  }) => {
    // loggedInApp must be requested so the login fixture runs and sets the session cookie
    void loggedInApp;

    const uniqueEmployeeId = faker.string.numeric({ length: 6 });

    /* ── POST /pim/employees ─────────────────────────────────── */
    const created = await employeeService.createEmployee({
      firstName: testData.firstName,
      middleName: testData.middleName,
      lastName: testData.lastName,
      employeeId: uniqueEmployeeId,
    });

    // Validate creation response
    expect(
      created,
      'Create response should contain empNumber',
    ).toHaveProperty('empNumber');
    expect(
      created.empNumber,
      'empNumber should be a positive number',
    ).toBeGreaterThan(0);
    expect(
      created.firstName,
      'Created firstName should match the request payload',
    ).toBe(testData.firstName);
    expect(
      created.lastName,
      'Created lastName should match the request payload',
    ).toBe(testData.lastName);
    expect(
      created.employeeId,
      'Created employeeId should match the request payload',
    ).toBe(uniqueEmployeeId);

    /* ── GET /pim/employees — search by Employee ID ──────────── */
    const found = await employeeService.getEmployeeById(uniqueEmployeeId);

    expect(
      found,
      `Employee with ID "${uniqueEmployeeId}" should appear in the list`,
    ).not.toBeNull();

    expect(
      found!.firstName,
      'Listed firstName should match creation data',
    ).toBe(testData.firstName);
    expect(
      found!.lastName,
      'Listed lastName should match creation data',
    ).toBe(testData.lastName);
    expect(
      found!.middleName,
      'Listed middleName should match creation data',
    ).toBe(testData.middleName ?? '');
    expect(
      found!.employeeId,
      'Listed employeeId should match creation data',
    ).toBe(uniqueEmployeeId);

    // Validate the detailed model fields are present
    expect(
      found!,
      'Listed employee should include jobTitle object',
    ).toHaveProperty('jobTitle');
    expect(
      found!,
      'Listed employee should include subunit object',
    ).toHaveProperty('subunit');
    expect(
      found!,
      'Listed employee should include empStatus object',
    ).toHaveProperty('empStatus');
    expect(
      found!,
      'Listed employee should include supervisors array',
    ).toHaveProperty('supervisors');
  });

  /* ================================================================
   * Scenario 2 + 3
   * Create an employee through the UI, then use the API to verify
   * the same employee exists with matching data (name, job title,
   * employee ID).
   * ================================================================ */
  test('should find UI-created employee via API and validate data matches', async ({
    loggedInApp,
    employeeService,
    testData,
  }) => {
    /* ── create employee via UI ──────────────────────────────── */
    await loggedInApp.dashboard.navigateToModule('PIM');
    await loggedInApp.pim.clickAddEmployee();

    const capturedEmployeeId = await loggedInApp.employee.fillAddEmployeeForm({
      firstName: testData.firstName,
      lastName: testData.lastName,
      middleName: testData.middleName,
    });

    await loggedInApp.employee.saveAndWait();

    /* ── search via API ──────────────────────────────────────── */
    const apiEmployee = await employeeService.getEmployeeById(capturedEmployeeId);

    expect(
      apiEmployee,
      `Employee with ID "${capturedEmployeeId}" should be retrievable via API`,
    ).not.toBeNull();

    // Validate UI data matches API response — name
    expect(
      apiEmployee!.firstName,
      'API firstName should match the name entered in UI',
    ).toBe(testData.firstName);
    expect(
      apiEmployee!.lastName,
      'API lastName should match the name entered in UI',
    ).toBe(testData.lastName);
    expect(
      apiEmployee!.middleName,
      'API middleName should match the name entered in UI',
    ).toBe(testData.middleName ?? '');

    // Validate UI data matches API response — employee ID
    expect(
      apiEmployee!.employeeId,
      'API employeeId should match the ID captured from UI',
    ).toBe(capturedEmployeeId);

    // Validate job title structure (null for a newly created employee)
    expect(
      apiEmployee!,
      'API response should include jobTitle object',
    ).toHaveProperty('jobTitle');
    expect(
      apiEmployee!.jobTitle,
      'jobTitle.id should be present',
    ).toHaveProperty('id');
    expect(
      apiEmployee!.jobTitle,
      'jobTitle.title should be present',
    ).toHaveProperty('title');

    // Validate remaining detailed-model fields
    expect(
      apiEmployee!,
      'API response should include subunit object',
    ).toHaveProperty('subunit');
    expect(
      apiEmployee!,
      'API response should include empStatus object',
    ).toHaveProperty('empStatus');
    expect(
      apiEmployee!,
      'API response should include supervisors array',
    ).toHaveProperty('supervisors');
  });
});
