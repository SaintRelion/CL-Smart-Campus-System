import type { Department } from "./department";
import type { UserRole } from "./userrole";

export interface Users {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: UserRole;
}
