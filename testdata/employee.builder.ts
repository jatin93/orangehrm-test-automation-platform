import { faker } from '@faker-js/faker';
import { EmployeeData } from './types';

export class EmployeeDataBuilder {
  private data: EmployeeData;

  constructor() {
    this.data = {
      firstName: faker.person.firstName().substring(0, 30),
      lastName: faker.person.lastName().substring(0, 30),
      middleName: faker.person.middleName().substring(0, 30),
    };
  }

  withFirstName(firstName: string): this {
    this.data.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.data.lastName = lastName;
    return this;
  }

  withMiddleName(middleName: string): this {
    this.data.middleName = middleName;
    return this;
  }

  withEmployeeId(employeeId: string): this {
    this.data.employeeId = employeeId;
    return this;
  }

  build(): EmployeeData {
    return { ...this.data };
  }
}
