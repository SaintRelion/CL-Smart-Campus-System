import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";

// Firebase
firebaseRegister("User");

// API
apiRegister("User", "user");

// Mock
mockRegister<User>("User", [
  {
    id: "1",
    employeeID: "125689",
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "CBA",
    role: "instructor",
  },
  {
    id: "2",
    employeeID: "675698",
    name: "Bob Smith",
    email: "bob@example.com",
    department: "CCS",
    role: "admin",
  },
]);
