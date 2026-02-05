import { useState, useMemo, useEffect } from "react";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { formatReadableDate } from "@saintrelion/time-functions";
import type { User } from "@/models/user";
import type { AttendanceLog } from "@/models/attendance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { GeoViewer } from "../to-be-library/geo/GeoViewer";
import { decodePath } from "../to-be-library/geo/lib/parser";
import { useGeoStore } from "../to-be-library/geo/useGeoStore";

export default function AdminAttendancePage() {
  // Instructor Select
  const { useSelect: usersSelect } = useDBOperationsLocked<User>("User");
  const { data: users = [] } = usersSelect({});
  const instructors = users.filter((u) => u.role != "admin");

  // Instructor Attendance Select
  const { useSelect: attendanceSelect } =
    useDBOperationsLocked<AttendanceLog>("AttendanceLog");
  const { data: attendanceLogs = [] } = attendanceSelect({});

  const [selectedInstructor, setSelectedInstructor] = useState<User | null>(
    null,
  );
  const [selectedAttendanceLog, setSelectedAttendanceLog] =
    useState<AttendanceLog | null>(null);

  const parsedPath = decodePath(selectedAttendanceLog?.pathMovement);
  useEffect(() => {
    useGeoStore.getState().setParsedPath(parsedPath);
  }, [parsedPath]);

  // Filter logs for instructor
  const instructorLogs = useMemo(() => {
    if (!selectedInstructor) return [];
    return attendanceLogs.filter(
      (log) => log.employeeId === selectedInstructor.employeeId,
    );
  }, [attendanceLogs, selectedInstructor]);

  // Group by day
  const groupedLogs = useMemo(() => {
    const groups: Record<string, AttendanceLog[]> = {};

    instructorLogs.forEach((log) => {
      const dayLabel = formatReadableDate(log.createdAt);

      // Group by that day
      if (!groups[dayLabel]) groups[dayLabel] = [];
      groups[dayLabel].push(log);
    });

    return groups;
  }, [instructorLogs]);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 p-6 md:grid-cols-3">
      {/* LEFT: Instructor List */}
      <div className="space-y-3">
        <h2 className="mb-2 text-lg font-semibold">Instructors</h2>
        {instructors.length === 0 ? (
          <p className="text-gray-500">No instructors found.</p>
        ) : (
          instructors.map((inst) => (
            <div
              key={inst.id}
              onClick={() => {
                setSelectedInstructor(inst);
                setSelectedAttendanceLog(null);
              }}
              className={`cursor-pointer rounded-lg border p-4 transition hover:bg-gray-50 ${
                selectedInstructor?.id === inst.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium">{inst.name}</p>
              <p className="text-sm text-gray-500">{inst.department}</p>
              <p className="text-xs text-gray-400">{inst.email}</p>
            </div>
          ))
        )}
      </div>

      {/* RIGHT: Attendance Logs */}
      <div className="col-span-2">
        <h2 className="mb-4 text-lg font-semibold">
          {selectedInstructor
            ? `${selectedInstructor.name}'s Attendance`
            : "Select an Instructor"}
        </h2>

        {!selectedInstructor ? (
          <p className="text-gray-500">
            Choose an instructor from the left to view attendance logs.
          </p>
        ) : instructorLogs.length === 0 ? (
          <p className="text-gray-500">No attendance logs found.</p>
        ) : (
          Object.entries(groupedLogs)
            .sort(([a], [b]) => (a > b ? -1 : 1))
            .map(([day, logs]) => (
              <div key={day} className="mb-6">
                <h3 className="mb-2 font-semibold text-gray-700">{day}</h3>
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedAttendanceLog(log)}
                      className="flex cursor-pointer justify-between rounded border bg-white p-3 shadow-sm hover:bg-gray-50"
                    >
                      <span className="text-gray-700">
                        Time In:{" "}
                        <strong>
                          {new Date(log.timeIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </span>
                      <span className="text-gray-700">
                        Time Out:{" "}
                        <strong>
                          {log.timeOut
                            ? new Date(log.timeOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Attendance Map Viewer */}
      {selectedAttendanceLog && (
        <Dialog
          open={!!selectedAttendanceLog}
          onOpenChange={(open) => !open && setSelectedAttendanceLog(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Movement Path</DialogTitle>
              <DialogDescription>{`View recorded GPS path for ${
                selectedInstructor?.name ?? ""
              }`}</DialogDescription>
            </DialogHeader>

            <div className="h-[450px] w-full">
              <GeoViewer
                uiParameters={{
                  showDefaultControls: false,
                  showMap: true,
                  wrapperClass: "h-full w-full",
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
