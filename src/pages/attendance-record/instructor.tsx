import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  allInstructorClasses,
  allInstructorAttendanceData,
} from "@/data/mock-classes-instructor";
import { users } from "@/data/mock-users";
import {
  enrolledClasses,
  allStudentAttendanceData,
} from "@/data/mock-student-data";
import { Calendar } from "@/components/ui/calendar";
import { formatDateToOnlyTime, formatTime24To12 } from "@/lib/mydate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X } from "lucide-react";
import { useAuth } from "@saintrelion/auth-lib";
import type { AttendanceLogs } from "@/models/attendance";

const dayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const InstructorAttendanceRecordPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const [studentAttendanceData, setStudentAttendanceData] = useState(
    allStudentAttendanceData,
  );
  const [instructorAttendanceData, setInstructorAttendanceData] = useState(
    allInstructorAttendanceData,
  );

  const { user } = useAuth();
  const teachingDays = useMemo(() => {
    const cls = allInstructorClasses.filter((c) => c.userId === user.id);
    const weekdays = cls.flatMap((c) => c.days); // ["Monday", "Wednesday", ...]

    return [...new Set(weekdays.map((d) => dayMap[d]))]; // unique day numbers
  }, [allInstructorClasses]);

  const modifiers = {
    teaching: (date: Date) => teachingDays.includes(date.getDay()),
  };

  const modifiersClassNames = {
    teaching: "bg-blue-100 text-blue-900 font-semibold rounded-md", // highlight style
  };

  const selectedDay = selectedDate ? format(selectedDate, "EEEE") : null;
  const instructorClasses = allInstructorClasses.filter((c) =>
    selectedDay ? c.userId === user.id && c.days.includes(selectedDay) : false,
  );

  const isSelectedToday =
    selectedDate != undefined
      ? format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
      : false;

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Calendar */}
      <div className="border-muted col-span-5 rounded-2xl border shadow-sm lg:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full cursor-pointer rounded-md border"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </div>

      {/* Class + Attendance */}
      <Card className="border-muted col-span-5 rounded-xl border shadow-sm lg:col-span-3">
        {selectedDate ? (
          <>
            <CardHeader>
              <CardTitle>
                Classes on {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>

            <CardContent className="">
              {instructorClasses.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {instructorClasses.map((icl) => {
                    const enrolledStudents = enrolledClasses.filter(
                      (ecl) => ecl.classId === icl.id,
                    );

                    const instructorAttendance = instructorAttendanceData.find(
                      (a) =>
                        a.userId === user.id &&
                        a.classId === icl.id &&
                        format(parseISO(a.time), "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd"),
                    );
                    // TODO: Continue here, improve or refactor or extract
                    return (
                      <AccordionItem
                        key={icl.id}
                        value={icl.id.toString()}
                        className="my-1"
                      >
                        <AccordionTrigger
                          className={`px-2 py-2 text-left ${
                            instructorAttendance?.status === "present"
                              ? "bg-green-200"
                              : instructorAttendance?.status === "no-class"
                                ? "bg-gray-200"
                                : "bg-red-200"
                          }`}
                        >
                          <div className="flex w-full flex-col">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {icl.title} ({icl.code})
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {formatTime24To12(icl.time)} •{" "}
                                  {enrolledStudents.length} students
                                </span>
                              </div>

                              {isSelectedToday && (
                                <div className="flex items-center gap-2">
                                  {/* ✅ Mark Present */}
                                  <button
                                    onClick={() => {
                                      const newRecord: AttendanceLogs = {
                                        id: instructorAttendanceData.length + 1,
                                        userId: user.id, // instructor id
                                        userType: "instructor",
                                        classId: icl.id,
                                        time: new Date().toISOString(),
                                        status: "present",
                                      };

                                      setInstructorAttendanceData((prev) => {
                                        const formattedSelected = format(
                                          selectedDate,
                                          "yyyy-MM-dd",
                                        );

                                        // check if record exists for this instructor, class, and date
                                        const existingIndex = prev.findIndex(
                                          (a) =>
                                            a.userId === user.id &&
                                            a.classId === icl.id &&
                                            format(
                                              parseISO(a.time),
                                              "yyyy-MM-dd",
                                            ) === formattedSelected,
                                        );

                                        if (existingIndex !== -1) {
                                          // replace existing
                                          const updated = [...prev];
                                          updated[existingIndex] = {
                                            ...prev[existingIndex],
                                            ...newRecord,
                                          };
                                          return updated;
                                        }

                                        // add new if none found
                                        return [...prev, newRecord];
                                      });
                                    }}
                                    className="rounded-md bg-green-500 p-1 text-white hover:bg-green-600"
                                  >
                                    <Check size={16} />
                                  </button>

                                  {/* 🚫 No Class */}
                                  <button
                                    onClick={() => {
                                      const reason =
                                        prompt("Reason for no class?") ||
                                        "unspecified";

                                      const newRecord: AttendanceLogs = {
                                        id: instructorAttendanceData.length + 1,
                                        userId: user.id, // instructor id
                                        userType: "instructor",
                                        classId: icl.id,
                                        time: new Date().toISOString(),
                                        status: "no-class",
                                        reason,
                                      };

                                      setInstructorAttendanceData((prev) => {
                                        const formattedSelected = format(
                                          selectedDate,
                                          "yyyy-MM-dd",
                                        );

                                        // check if record exists for this instructor, class, and date
                                        const existingIndex = prev.findIndex(
                                          (a) =>
                                            a.userId === user.id &&
                                            a.classId === icl.id &&
                                            format(
                                              parseISO(a.time),
                                              "yyyy-MM-dd",
                                            ) === formattedSelected,
                                        );

                                        if (existingIndex !== -1) {
                                          // replace existing
                                          const updated = [...prev];
                                          updated[existingIndex] = {
                                            ...prev[existingIndex],
                                            ...newRecord,
                                          };
                                          return updated;
                                        }

                                        // add new if none found
                                        return [...prev, newRecord];
                                      });
                                    }}
                                    className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {instructorAttendance?.status === "no-class" && (
                              <span className="text-muted-foreground text-xs italic">
                                No Class - Reason: {instructorAttendance.reason}
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {enrolledStudents.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-sm">
                              {enrolledStudents.map((student) => {
                                const studentInfo = users.find(
                                  (u) => u.id === student.userId,
                                );

                                const studentAttendance =
                                  studentAttendanceData.find(
                                    (a) =>
                                      a.userId === student.userId &&
                                      a.classId === icl.id &&
                                      format(parseISO(a.time), "yyyy-MM-dd") ===
                                        format(selectedDate, "yyyy-MM-dd"),
                                  );

                                return (
                                  <li
                                    key={studentInfo?.id}
                                    className="bg-muted/30 flex items-center justify-between rounded-md px-2 py-1"
                                  >
                                    <span>{studentInfo?.name}</span>
                                    {studentAttendance ? (
                                      <span
                                        className={
                                          studentAttendance.status === "present"
                                            ? "text-green-600"
                                            : studentAttendance.status ===
                                                "missed"
                                              ? "text-red-500"
                                              : studentAttendance.status ===
                                                  "late"
                                                ? "text-yellow-500"
                                                : "text-muted-foreground"
                                        }
                                      >
                                        {studentAttendance.status} (
                                        {formatDateToOnlyTime(
                                          studentAttendance.time,
                                        )}
                                        )
                                      </span>
                                    ) : (
                                      // ✅ Show button if no record AND class is today
                                      isSelectedToday && (
                                        <div className="space-x-2">
                                          <button
                                            onClick={() => {
                                              const newId =
                                                allStudentAttendanceData.length +
                                                1;
                                              setStudentAttendanceData(
                                                (prev) => [
                                                  ...prev,
                                                  {
                                                    id: newId,
                                                    userId: student.userId,
                                                    userType: "student",
                                                    classId: icl.id,
                                                    time: new Date().toISOString(), // store as ISO string
                                                    status: "present",
                                                  },
                                                ],
                                              );
                                            }}
                                            className="rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                                          >
                                            Mark Present
                                          </button>
                                          <button
                                            onClick={() => {
                                              const newId =
                                                allStudentAttendanceData.length +
                                                1;

                                              setStudentAttendanceData(
                                                (prev) => [
                                                  ...prev,
                                                  {
                                                    id: newId,
                                                    userId: student.userId,
                                                    userType: "student",
                                                    classId: icl.id,
                                                    time: new Date().toISOString(), // store as ISO string
                                                    status: "missed",
                                                  },
                                                ],
                                              );
                                            }}
                                            className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                          >
                                            Mark Absent
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground mt-2 text-xs">
                              No students enrolled.
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <p className="text-muted-foreground text-sm">No classes</p>
              )}
            </CardContent>
          </>
        ) : (
          <p className="text-muted-foreground p-5 text-sm">
            Select a date on the calendar to view classes.
          </p>
        )}
      </Card>
    </div>
  );
};
export default InstructorAttendanceRecordPage;
