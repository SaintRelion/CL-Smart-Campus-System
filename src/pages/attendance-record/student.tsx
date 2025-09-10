import {
  enrolledClasses,
  allStudentAttendanceData,
} from "@/data/mock-student-data";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatYYYYMMDDTime } from "@/lib/mydate";
import { allInstructorClasses } from "@/data/mock-classes-instructor";

const StudentAttendanceRecordPage = () => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const userId = 1;
  const myClassesEnrolled = enrolledClasses.filter(
    (ecl) => ecl.userId == userId,
  );
  console.log(myClassesEnrolled);
  const selectedClass = allInstructorClasses.find(
    (c) => c.id === selectedClassId,
  );
  const attendanceForClass = allStudentAttendanceData
    .filter((a) => a.userId == userId && a.classId === selectedClassId)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Left side: Classes */}
      <Card>
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {myClassesEnrolled.map((ecl) => {
            const classInfo = allInstructorClasses.find(
              (c) => c.id == ecl.classId,
            );
            return (
              <Button
                key={ecl.id}
                variant={
                  selectedClassId === ecl.classId ? "default" : "outline"
                }
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedClassId(ecl.classId)}
              >
                {classInfo?.title} ({classInfo?.code})
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Right side: Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedClass ? selectedClass.title : "Select a class"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedClass ? (
            attendanceForClass.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {attendanceForClass.map((a) => (
                  <li
                    key={a.id}
                    className={`flex items-center justify-between rounded-md px-2 py-1 ${
                      a.status === "missed"
                        ? "bg-red-400/40"
                        : a.status === "late"
                          ? "bg-yellow-200/70"
                          : a.status === "no-class"
                            ? "bg-gray-200/70"
                            : "bg-green-200/70"
                    }`}
                  >
                    <span className="capitalize">{a.status}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatYYYYMMDDTime(a.time)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No attendance records yet.
              </p>
            )
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a class to view attendance.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default StudentAttendanceRecordPage;
