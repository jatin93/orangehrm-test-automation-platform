/* ── UI test data ───────────────────────────────────────────── */

export interface EmployeeData {
  firstName: string;
  lastName: string;
  middleName?: string;
  employeeId?: string;
}

export interface EmployeeRecord extends EmployeeData {
  employeeId: string;
  empNumber?: number;
  fullName?: string;
}

/* ── API — nested objects (detailed model) ──────────────────── */

export interface ApiJobTitle {
  id: number | null;
  title: string | null;
  isDeleted: boolean | null;
}

export interface ApiSubUnit {
  id: number | null;
  name: string | null;
}

export interface ApiEmploymentStatus {
  id: number | null;
  name: string | null;
}

export interface ApiSupervisor {
  empNumber: number;
  lastName: string;
  firstName: string;
  middleName: string;
}

/* ── API — employee (detailed model response) ───────────────── */

export interface ApiEmployee {
  empNumber: number;
  lastName: string;
  firstName: string;
  middleName: string;
  employeeId: string;
  terminationId: number | null;
  jobTitle: ApiJobTitle;
  subunit: ApiSubUnit;
  empStatus: ApiEmploymentStatus;
  supervisors: ApiSupervisor[];
}

export interface ApiEmployeeListResponse {
  data: ApiEmployee[];
  meta: { total: number };
  rels: unknown[];
}

/* ── API — create employee (POST) ───────────────────────────── */

export interface CreateEmployeePayload {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  empPicture: null;
}

export interface ApiCreatedEmployee {
  empNumber: number;
  lastName: string;
  firstName: string;
  middleName: string;
  employeeId: string;
  terminationId: number | null;
}

export interface CreateEmployeeResponse {
  data: ApiCreatedEmployee;
}
