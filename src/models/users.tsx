import type { UserRole } from "./userrole";

export interface Users {
  id: number;
  name: string;
  role: UserRole;
}
