import { useState, useMemo } from "react";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { formatReadableDate, isSameDay } from "@saintrelion/time-functions";
import type { User } from "@/models/user";
import type { AttendanceLog } from "@/models/attendance";

import type { ClassSubject } from "@/models/class-subject";
import { AttendanceProgressBar } from "@/components/attendance/AttendanceProgressBar";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsRightIcon,
  Clock,
  MapPin,
} from "lucide-react";
import { GeoViewer } from "../to-be-library/geo/GeoViewer";
import { useGeoStore } from "../to-be-library/geo/useGeoStore";
import { decodePath } from "../to-be-library/geo/lib/parser";

export default function AdminAttendancePage() {
  const { useSelect: usersSelect } = useDBOperationsLocked<User>("User");
  const { useSelect: attendanceSelect } =
    useDBOperationsLocked<AttendanceLog>("AttendanceLog");
  const { useSelect: classesSelect } =
    useDBOperationsLocked<ClassSubject>("ClassSubject");

  const [selectedInstructor, setSelectedInstructor] = useState<User | null>(
    null,
  );
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<AttendanceLog | null>(
    null,
  );

  const { data: users = [] } = usersSelect({});
  const { data: attendanceLogs = [] } = attendanceSelect({});
  const { data: allSubjects = [] } = classesSelect({});

  const instructors = users.filter((u) => u.role !== "admin");

  // Navigate Date
  const changeDay = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(viewDate.getDate() + offset);
    setViewDate(newDate);
    setSelectedSession(null); // Reset map when day changes
  };

  // Filter Data for the Current View
  const filteredData = useMemo(() => {
    if (!selectedInstructor) return { logs: [], subjects: [] };
    const dayName = viewDate.toLocaleDateString("en-US", { weekday: "long" });

    const logs = attendanceLogs
      .filter(
        (log) =>
          log.employeeId === selectedInstructor.employeeId &&
          isSameDay(
            formatReadableDate(log.createdAt),
            formatReadableDate(viewDate.toISOString()),
          ),
      )
      .sort(
        (a, b) => new Date(a.timeIn).getTime() - new Date(b.timeIn).getTime(),
      );

    const subjects = allSubjects.filter(
      (s) =>
        s.employeeId === selectedInstructor.employeeId &&
        s.days.includes(dayName),
    );

    return { logs, subjects };
  }, [attendanceLogs, allSubjects, selectedInstructor, viewDate]);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 p-6 lg:grid-cols-4">
      {/* LEFT: INSTRUCTOR SELECTION */}
      <div className="space-y-4 lg:col-span-1">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <MapPin className="text-blue-500" /> Instructors
        </h2>
        <div className="max-h-[80vh] space-y-2 overflow-y-auto pr-2">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              onClick={() => {
                setSelectedInstructor(inst);
                setSelectedSession(null);
              }}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                selectedInstructor?.id === inst.id
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <p className="font-bold">{inst.name}</p>
              <p className="text-xs text-gray-500">{inst.department}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: AUDIT VIEWER */}
      <div className="space-y-6 lg:col-span-3">
        {/* DATE NAVIGATOR */}
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
          <button
            onClick={() => changeDay(-1)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-black">
              {viewDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <p className="text-xs font-bold text-blue-500 uppercase">
              {viewDate.toLocaleDateString("en-US", { weekday: "long" })}
            </p>
          </div>
          <button
            onClick={() => changeDay(1)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>

        {selectedInstructor ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* COLUMN 1: COVERAGE & SESSIONS */}
            <div className="space-y-6">
              {/* Coverage Progress Bars */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 text-xs font-black text-gray-400 uppercase">
                  <Calendar className="h-4 w-4" /> Schedule Coverage
                </h4>
                {filteredData.subjects.length > 0 ? (
                  filteredData.subjects.map((sub) => (
                    <AttendanceProgressBar
                      key={sub.id}
                      subject={sub}
                      logs={filteredData.logs}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No classes scheduled.
                  </p>
                )}
              </div>

              {/* Session List */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 text-xs font-black text-gray-400 uppercase">
                  <Clock className="h-4 w-4" /> Session Logs
                </h4>
                <div className="space-y-2">
                  {filteredData.logs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => {
                        setSelectedSession(log);

                        console.log(log);
                        useGeoStore
                          .getState()
                          .setParsedPath(decodePath(log.pathMovement));
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                        selectedSession?.id === log.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm">
                        <p className="font-bold">
                          {new Date(log.timeIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -
                          {log.timeOut
                            ? new Date(log.timeOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : " Active"}
                        </p>
                        <p className="text-[10px] tracking-widest text-gray-400 uppercase">
                          Click to view path
                        </p>
                      </div>
                      <ChevronsRightIcon
                        className={`h-4 w-4 ${selectedSession?.id === log.id ? "text-blue-500" : "text-gray-300"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: MAP VIEWER */}
            <div className="sticky top-6 h-[600px] overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Movement Path
                </span>
                {selectedSession && (
                  <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                    SESSION:{" "}
                    {new Date(selectedSession.timeIn).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <GeoViewer />
            </div>
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-gray-50 text-gray-400">
            <p className="text-lg font-medium">
              Select an instructor to begin the audit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
