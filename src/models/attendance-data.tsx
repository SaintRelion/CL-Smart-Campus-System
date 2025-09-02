export interface StudentAttendanceDatesProps {
  id: number;
  userId: number;
  classId: number;
  time: string;
  status: "present" | "missed" | "late" | "no-class";
}

export interface InstructorAttendanceDatesProps {
  id: number;
  userId: number;
  classId: number;
  time: string;
  status: "present" | "missed" | "late" | "no-class";
  reason?: string;
}
