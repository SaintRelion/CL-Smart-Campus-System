export const UserRole = {
  admin: "Admin",
  instructor: "Instructor",
};

export type UserRole = keyof typeof UserRole;
