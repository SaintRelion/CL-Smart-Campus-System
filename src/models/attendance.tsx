export interface AttendanceLog {
  id: string; // firebase ID
  employeeID: string; // instructor or student
  createdAt: string; // ISO date when record created (e.g. "2025-10-18T08:00:00Z")
  day: string; // derived: YYYY-MM-DD for easy grouping
  timeIn: string; // ISO string of check-in
  timeOut?: string; // ISO string of check-out (optional until done)
  pathMovement: string;
}
