import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { ClassSubject } from "@/models/class-subject";

// Firebase
firebaseRegister("ClassSubject");

// API
apiRegister("ClassSubject", "classsubject");

// Mock
mockRegister<ClassSubject>("ClassSubject", [
  {
    id: "1",
    employeeId: "1",
    title: "Introduction to Programming",
    days: ["Monday", "Wednesday"],
    time: "08:00",
    room: "Room A1",
    semester: "1st",
    year: "2026",
  },
  {
    id: "2",
    employeeId: "2",
    title: "Database Systems",
    days: ["Tuesday", "Thursday"],
    time: "10:00",
    room: "Room B2",
    semester: "1st",
    year: "2026",
  },
]);
