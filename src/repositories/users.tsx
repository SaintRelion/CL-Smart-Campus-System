import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { Users } from "@/models/users";

// Firebase
firebaseRegister("Users");

// API
apiRegister("Users", "user");

// Mock
mockRegister<Users>("Users", [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "CS",
    role: "instructor",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    department: "ENG",
    role: "instructor",
  },
]);
