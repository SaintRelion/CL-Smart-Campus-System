import type { AttendanceLog } from "@/models/attendance";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("AttendanceLog");

// API
apiRegister("AttendanceLog", "attendancelog");

// Mock
mockRegister<AttendanceLog>("AttendanceLog", [
  {
    id: "1",
    employeeID: "1",
    createdAt: "2025-10-01T08:00:00Z",
    day: "2025-10-01",
    timeIn: "2025-10-01T08:00:00Z",
    timeOut: "2025-10-01T16:30:00Z",
    pathMovement: "[[14.5995, 120.9842], [14.6, 120.985], [14.6012, 120.986]]",
  },
  {
    id: "2",
    employeeID: "1",
    createdAt: "2025-10-02T08:10:00Z",
    day: "2025-10-02",
    timeIn: "2025-10-02T08:10:00Z",
    timeOut: "2025-10-02T16:15:00Z",
    pathMovement:
      "[[14.5998, 120.9839], [14.6005, 120.9848], [14.601, 120.9859], [14.6015, 120.9868]]",
  },
  {
    id: "3",
    employeeID: "2",
    createdAt: "2025-10-01T07:55:00Z",
    day: "2025-10-01",
    timeIn: "2025-10-01T07:55:00Z",
    timeOut: "2025-10-01T15:45:00Z",
    pathMovement:
      "[[14.6578, 121.0296], [14.6582, 121.0302], [14.659, 121.031]]",
  },
]);
