import type { JSX } from "react";
import StudentAttendanceRecordPage from "./student";
import InstructorAttendanceRecordPage from "./instructor";
import { useAuth } from "@saintrelion/auth-lib";
import type { UserRole } from "@/models/userrole";

const AttendanceRecordPage = () => {
  const { user } = useAuth();

  const atttendanceRecordPages: Record<string, JSX.Element> = {
    admin: <StudentAttendanceRecordPage />,
    instructor: <InstructorAttendanceRecordPage />,
    student: <StudentAttendanceRecordPage />,
  };

  return (
    <div className="p-6">{atttendanceRecordPages[user.role as UserRole]}</div>
  );
};
export default AttendanceRecordPage;
