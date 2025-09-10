import type { AttendanceLogsProps } from "@/models/attendance";
import type { EnrolledClassesProps } from "@/models/enrolled-classes";

export const enrolledClasses: EnrolledClassesProps[] = [
  { id: 1, userId: 1, classId: 1 },
  { id: 2, userId: 2, classId: 2 },
  { id: 3, userId: 1, classId: 3 },
  { id: 4, userId: 4, classId: 4 },
  { id: 5, userId: 6, classId: 5 },
  { id: 6, userId: 5, classId: 5 },
  { id: 7, userId: 8, classId: 7 },
  { id: 8, userId: 1, classId: 5 },
];

export const allStudentAttendanceData: AttendanceLogsProps[] = [
  {
    id: 1,
    userId: 1,
    userType: "student",
    classId: 1,
    time: "2025-08-18T08:30",
    status: "present",
  },
  {
    id: 2,
    userId: 2,
    userType: "student",
    classId: 1,
    time: "2025-08-18T08:30",
    status: "missed",
  },
  {
    id: 3,
    userId: 3,
    userType: "student",
    classId: 2,
    time: "2025-08-19T10:00",
    status: "present",
  },
  {
    id: 4,
    userId: 4,
    userType: "student",
    classId: 2,
    time: "2025-08-19T10:00",
    status: "missed",
  },
  {
    id: 5,
    userId: 5,
    userType: "student",
    classId: 3,
    time: "2025-08-22T14:00",
    status: "present",
  },
  {
    id: 6,
    userId: 1,
    userType: "student",
    classId: 5,
    time: "2025-08-22T13:30",
    status: "no-class",
  },
  {
    id: 7,
    userId: 2,
    userType: "student",
    classId: 7,
    time: "2025-08-21T11:15",
    status: "late",
  },
  {
    id: 8,
    userId: 6,
    userType: "student",
    classId: 5,
    time: "2025-08-26T13:40",
    status: "late",
  },
];
