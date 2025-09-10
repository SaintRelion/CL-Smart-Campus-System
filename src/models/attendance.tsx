export interface AttendanceLogsProps {
  firebaseID?: string;
  id: number;
  userId: number;
  userType: string;
  classId: number;
  time: string;
  status: "present" | "missed" | "late" | "no-class";
  reason?: string;
}
