export interface AttendanceLogs {
  id: string;
  userID: string;
  userType: string;
  classID: string;
  time: string;
  status: "present" | "missed" | "late" | "no-class";
  reason?: string;
}
