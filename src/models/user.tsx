import type { Department } from "../model-types/department";
import type { UserRole } from "../model-types/userrole";

export interface User {
  id: string;
  employeeID: string;
  name: string;
  email: string;
  department: Department;
  role: UserRole;
}
