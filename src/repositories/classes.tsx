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
    userID: "1",
    title: "Introduction to Programming",
    days: ["Monday", "Wednesday"],
    time: "08:00",
    room: "Room A1",
    students: ["Name 1", "Name 2"],
  },
  {
    id: "2",
    userID: "2",
    title: "Database Systems",
    days: ["Tuesday", "Thursday"],
    time: "10:00",
    room: "Room B2",
    students: ["Name 1", "Name 2"],
  },
]);
