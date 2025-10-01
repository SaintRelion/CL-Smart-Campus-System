export const UserRole = {
  superadmin: "Super Admin",
  departmentadmin: "Department Admin",
  instructor: "Instructor",
  student: "Student",
} as const;

export type UserRole = keyof typeof UserRole;
