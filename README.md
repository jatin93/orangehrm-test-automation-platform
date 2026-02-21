# OrangeHRM Test Automation

Playwright + TypeScript automation framework for [OrangeHRM](https://opensource-demo.orangehrmlive.com/).

## Quick Start

```bash
# Install pnpm (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install --with-deps chromium

# Run all tests
pnpm test

# Run UI tests only
pnpm test:ui

# Run API tests only
pnpm test:api

# Run with browser visible
pnpm test:headed
```

## Project Structure

```
├── pages/           # Page Objects (login, dashboard, pim, employee)
├── fixtures/        # Test fixtures (app, testData, employeeService)
├── services/        # API services using Playwright request
├── testdata/        # Test data builder and types
├── tests/
│   ├── ui/          # UI E2E tests
│   └── api/         # API tests
├── config/          # Environment configuration
└── playwright.config.ts
```

## Test Scenarios

### UI Tests (`tests/ui/employee.e2e.spec.ts`)
1. Navigate to OrangeHRM and login
2. Verify side navigation menu
3. Navigate to PIM module
4. Add new employee and capture Employee ID
5. Search and validate employee in list
6. Edit employee job title
7. Logout and verify

### API Tests (`tests/api/employee.api.spec.ts`)
1. Fetch employee list and validate response structure
2. Create employee via API and verify in list
3. Validate UI-created employee data via API

## Environment Variables (optional)

Create `.env` file to override defaults:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
HEADLESS=true
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests |
| `pnpm test:ui` | Run UI tests only |
| `pnpm test:api` | Run API tests only |
| `pnpm test:headed` | Run with browser visible |
| `pnpm test:debug` | Run with Playwright inspector |
| `pnpm report` | Generate and open Allure report |
