export const UserRole = {
  admin: "Admin",
  instructor: "Instructor",
  parttime: "Part-Time Instructor",
};

export type UserRole = keyof typeof UserRole;
