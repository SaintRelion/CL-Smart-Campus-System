import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { Classes } from "@/models/classes";

// Firebase
firebaseRegister("Classes");

// API
apiRegister("Classes", "classes");

// Mock
mockRegister<Classes>("Classes", [
  {
    id: "1",
    userID: "1",
    title: "Introduction to Programming",
    code: "CS101",
    days: ["Monday", "Wednesday"],
    time: "08:00",
    room: "Room A1",
  },
  {
    id: "2",
    userID: "2",
    title: "Database Systems",
    code: "CS202",
    days: ["Tuesday", "Thursday"],
    time: "10:00",
    room: "Room B2",
  },
]);
