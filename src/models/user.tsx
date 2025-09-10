import type { UserRole } from "./userrole";

export interface User {
  firebaseID?: string;
  id: number;
  name: string;
  role: UserRole;
}
