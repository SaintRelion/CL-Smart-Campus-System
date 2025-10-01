import type { AttendanceLogs } from "@/models/attendance";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("AttendanceLogs");

// API
apiRegister("AttendanceLogs", "attendancelogs");

// Mock
mockRegister<AttendanceLogs>("AttendanceLogs", [
  {
    id: "1",
    userID: "1",
    userType: "student",
    classID: "1",
    time: "2025-10-01T08:00:00Z",
    status: "present",
  },
  {
    id: "2",
    userID: "2",
    userType: "student",
    classID: "1",
    time: "2025-10-01T08:00:00Z",
    status: "late",
    reason: "Traffic",
  },
]);
