import type { InstructorAttendanceDatesProps } from "@/models/attendance-data";
import type {
  ClassesProps,
  ClassesNotificationsProps,
} from "@/models/classes-instructor";

export const allInstructorClasses: ClassesProps[] = [
  {
    id: 1,
    userId: 14, // Instructor ID
    title: "Introduction to Fili",
    code: "FILI-101",
    days: ["Monday", "Tuesday", "Wednesday"],
    time: "08:30", // 24h
  },
  {
    id: 2,
    userId: 10,
    title: "Math Fundamentals",
    code: "MATH-100",
    days: ["Tuesday", "Thursday"],
    time: "19:05",
  },
  {
    id: 3,
    userId: 15,
    title: "English Literature",
    code: "ENG-201",
    days: ["Monday", "Friday"],
    time: "14:00",
  },
  {
    id: 4,
    userId: 14,
    title: "Computer Science Basics",
    code: "CS-105",
    days: ["Wednesday"],
    time: "16:05",
  },
  {
    id: 5,
    userId: 12,
    title: "History of Asia",
    code: "HIST-301",
    days: ["Tuesday", "Thursday"],
    time: "13:30",
  },
  {
    id: 6,
    userId: 13, // Same instructor as Fili, teaching another
    title: "Business Communication",
    code: "BUS-220",
    days: ["Thursday"],
    time: "15:00",
  },
  {
    id: 7,
    userId: 11,
    title: "Physics for Engineers",
    code: "PHY-150",
    days: ["Friday"],
    time: "11:15",
  },
  {
    id: 8,
    userId: 14, // Instructor ID
    title: "Introduction to Fili",
    code: "FILI-101",
    days: ["Monday", "Wednesday"],
    time: "13:00", // 24h
  },
  {
    id: 9,
    userId: 12,
    title: "History of Asia",
    code: "HIST-301",
    days: ["Tuesday", "Thursday"],
    time: "15:00",
  },
];

export const classesNotifications: ClassesNotificationsProps[] = [
  {
    id: 1,
    classId: 1,
    type: "room_change",
    message: "Room changed from 101 to 203",
    date: "2025-07-30",
  },
  {
    id: 2,
    classId: 3,
    type: "cancellation",
    message: "Class cancelled due to holiday",
    date: "2025-07-31",
  },
  {
    id: 3,
    classId: 5,
    type: "instructor_absence",
    message: "Instructor absent — substitute will be assigned",
    date: "2025-08-01",
  },
];

export const allInstructorAttendanceData: InstructorAttendanceDatesProps[] = [
  {
    id: 1,
    userId: 10,
    classId: 1,
    time: "2025-08-18T08:30",
    status: "present",
  },
  {
    id: 2,
    userId: 15,
    classId: 1,
    time: "2025-08-18T08:30",
    status: "missed",
  },
  {
    id: 3,
    userId: 12,
    classId: 5,
    time: "2025-08-19T10:00",
    status: "present",
  },
];
