import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

import { allStudentAttendanceData } from "@/data/mock-student-data";
import {
  allInstructorClasses,
  classesNotifications,
} from "@/data/mock-classes-instructor";

import { BanIcon, CalendarIcon } from "lucide-react";

import { formatTime, formatYYYYMMDDTime } from "@/lib/mydate";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Top Grid: Next + Missed */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Next Class */}
        <Card className="rounded-2xl border-2 border-black/20 transition-all hover:border-black/40">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CalendarIcon className="text-primary h-5 w-5" />
            <CardTitle className="text-lg">Next Class</CardTitle>
          </CardHeader>
          <CardContent>
            {allInstructorClasses && allInstructorClasses.length > 0 ? (
              [...allInstructorClasses]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((c, idx) => {
                  const notesForClass = classesNotifications.filter(
                    (n) => n.classId === c.id,
                  );

                  return (
                    <div key={c.id} className="mb-3">
                      <p
                        className={`leading-relaxed ${
                          idx === 0
                            ? "p-1 text-xl font-semibold"
                            : "text-sm opacity-50"
                        }`}
                      >
                        <span className="text-primary font-medium">
                          {c.title}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {formatTime(c.time)}
                        </span>
                      </p>

                      <ul className="ml-4 space-y-1">
                        {notesForClass.length > 0 ? (
                          notesForClass.map((note) => (
                            <li
                              key={note.id}
                              className={`italic ${
                                idx === 0
                                  ? "text-lg text-black/80"
                                  : "text-muted-foreground text-sm"
                              }`}
                            >
                              • {note.message}
                            </li>
                          ))
                        ) : (
                          <li
                            className={`italic ${
                              idx === 0
                                ? "text-lg text-black/80"
                                : "text-muted-foreground text-sm"
                            }`}
                          >
                            • No changes
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })
            ) : (
              <p className="text-muted-foreground text-sm">
                You're not enrolled yet.{" "}
                <Link to="/student/enroll" className="text-primary underline">
                  Enroll now →
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Missed Classes */}
        <Card className="rounded-2xl border-2 border-black/20 transition-all hover:border-black/40">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BanIcon className="text-destructive h-5 w-5" />
            <CardTitle className="text-lg">Missed Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {allStudentAttendanceData.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {allStudentAttendanceData
                  .filter((a) => a.status === "missed")
                  .sort(
                    (a, b) =>
                      new Date(b.time).getTime() - new Date(a.time).getTime(),
                  )
                  .map((attendance, idx) => {
                    const classInfo = allInstructorClasses.find(
                      (c) => c.id === attendance.classId,
                    );

                    return (
                      <li
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-red-400/40 px-2 py-1 transition hover:bg-red-100"
                      >
                        <span>
                          {classInfo ? classInfo.title : "Unknown Class"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatYYYYMMDDTime(attendance.time)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No missed classes 🎉
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
