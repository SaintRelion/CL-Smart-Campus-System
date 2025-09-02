import type { Users } from "@/models/users";

export const users: Users[] = [
  { id: 1, name: "Alice Student", role: "student" },
  { id: 2, name: "Bob Student", role: "student" },
  { id: 3, name: "Charlie Student", role: "student" },
  { id: 4, name: "Diana Student", role: "student" },
  { id: 5, name: "Eve Student", role: "student" },
  { id: 6, name: "Frank Student", role: "student" },
  { id: 7, name: "Grace Student", role: "student" },
  { id: 8, name: "Hank Student", role: "student" },
  { id: 9, name: "Ivy Student", role: "student" },

  // Instructors
  { id: 10, name: "Prof. Santos", role: "instructor" },
  { id: 11, name: "Dr. Reyes", role: "instructor" },
  { id: 12, name: "Ms. Dela Cruz", role: "instructor" },
  { id: 13, name: "Mr. Bautista", role: "instructor" },
  { id: 14, name: "Dr. Lim", role: "instructor" },
  { id: 15, name: "Prof. Ong", role: "instructor" },

  // Superadmins
  { id: 16, name: "Admin Garcia", role: "superadmin" },
  { id: 17, name: "Admin Torres", role: "superadmin" },
  { id: 18, name: "Admin Mendoza", role: "superadmin" },
  { id: 19, name: "Admin Flores", role: "superadmin" },
  { id: 20, name: "Admin Ramos", role: "superadmin" },

  // Department Admins
  { id: 21, name: "Dept. Admin Cruz", role: "departmentadmin" },
  { id: 22, name: "Dept. Admin Villanueva", role: "departmentadmin" },
  { id: 23, name: "Dept. Admin Bautista", role: "departmentadmin" },
  { id: 24, name: "Dept. Admin Santos", role: "departmentadmin" },
  { id: 25, name: "Dept. Admin Reyes", role: "departmentadmin" },
];
