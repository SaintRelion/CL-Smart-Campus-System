import { useMemo, useState } from "react";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { AttendanceLog } from "@/models/attendance";
import { useAuth } from "@saintrelion/auth-lib";

import {
  formatReadableDate,
  formatReadableTime,
  getCurrentDateTimeString,
  isSameDay,
} from "@saintrelion/time-functions";

import {
  appendPath,
  decodePath,
  encodePath,
} from "../../pages/to-be-library/geo/lib/parser";
// import { GeoViewer } from "../../pages/to-be-library/geo/GeoViewer";
import { useGeoStore } from "@/pages/to-be-library/geo/useGeoStore";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapIcon,
  Play,
  Square,
} from "lucide-react";
import { GeoViewer } from "@/pages/to-be-library/geo/GeoViewer";
import { AttendanceProgressBar } from "./AttendanceProgressBar";
import type { ClassSubject } from "@/models/class-subject";

export default function InstructorAttendance() {
  const { user } = useAuth();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<AttendanceLog | null>(
    null,
  );

  const {
    useSelect: attendanceSelect,
    useInsert: attendanceInsert,
    useUpdate: attendanceUpdate,
  } = useDBOperationsLocked<AttendanceLog>("AttendanceLog");
  const { useSelect: classesSelect } =
    useDBOperationsLocked<ClassSubject>("ClassSubject");

  // Fetch Data
  const { data: attendanceLogs = [] } = attendanceSelect({
    firebaseOptions: { filterField: "employeeId", value: user.employeeId },
  });
  const { data: allSubjects = [] } = classesSelect({
    firebaseOptions: { filterField: "employeeId", value: user.employeeId },
  });

  // Date Navigation
  const changeDay = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(viewDate.getDate() + offset);
    setViewDate(newDate);
  };

  // Filter Logic for the "Viewed Day"
  const isToday = isSameDay(viewDate.toISOString(), new Date().toISOString());

  const todaysLogs = useMemo(() => {
    return attendanceLogs
      .filter((log) =>
        isSameDay(
          formatReadableDate(log.createdAt),
          formatReadableDate(viewDate.toISOString()),
        ),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [attendanceLogs, viewDate]);

  const todaysSubjects = useMemo(() => {
    const dayName = viewDate.toLocaleDateString("en-US", { weekday: "long" });
    return allSubjects.filter((s) => s.days.includes(dayName));
  }, [allSubjects, viewDate]);

  // Status Check (Only relevant if viewing Today)
  const activeSession = todaysLogs.find((log) => !log.timeOut);
  const isCheckedIn = !!activeSession;

  const handleToggle = async () => {
    const now = getCurrentDateTimeString();
    if (!isCheckedIn) {
      attendanceInsert.run({
        employeeId: user.employeeId,
        timeIn: now,
        pathMovement: encodePath(useGeoStore.getState().path),
      });
    } else {
      attendanceUpdate.run({
        field: "id",
        value: activeSession.id,
        updates: {
          timeOut: now,
          pathMovement: appendPath(
            activeSession.pathMovement,
            useGeoStore.getState().path.slice(-1)[0],
          ),
        },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3">
      {/* LEFT: STATUS & CONTROLS */}
      <div className="space-y-4 lg:col-span-1">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 animate-pulse rounded-full ${isCheckedIn ? "bg-green-500" : "bg-gray-300"}`}
              />
              <h2 className="font-bold text-gray-700">Attendance Status</h2>
            </div>
            {isToday && (
              <button
                onClick={handleToggle}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-white transition-all active:scale-95 ${
                  isCheckedIn
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isCheckedIn ? (
                  <>
                    <Square className="h-4 w-4" /> End Session
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Start Session
                  </>
                )}
              </button>
            )}
          </div>

          {/* DATE NAVIGATOR */}
          <div className="flex items-center justify-between border-t pt-4">
            <button
              onClick={() => changeDay(-1)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold text-blue-500 uppercase">
                {viewDate.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <p className="font-bold">
                {viewDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => changeDay(1)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* PROGRESS BARS (The Admin View for Instructor) */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-black text-gray-400 uppercase">
            Daily Coverage
          </h3>
          {todaysSubjects.length > 0 ? (
            todaysSubjects.map((sub) => (
              <AttendanceProgressBar
                key={sub.id}
                subject={sub}
                logs={todaysLogs}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">
              No classes scheduled.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: MAP & LOG DETAILS */}
      <div className="space-y-4 lg:col-span-2">
        <div className="relative h-[400px] overflow-hidden rounded-2xl border bg-white shadow-sm">
          <GeoViewer
            uiParameters={{
              showDefaultControls: false,
              showMap: true,
              wrapperClass: "h-full w-full",
            }}
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur">
            <MapIcon className="h-3 w-3 text-blue-500" />
            {selectedSession
              ? `Viewing Session: ${formatReadableTime(selectedSession.timeIn)}`
              : "Live Tracking Mode"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {todaysLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => {
                setSelectedSession(log);
                const path = decodePath(log.pathMovement);
                useGeoStore.getState().setParsedPath(path);
              }}
              className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
                selectedSession?.id === log.id
                  ? "border-blue-500 bg-blue-50"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {new Date(log.timeIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {log.timeOut
                        ? ` - ${new Date(log.timeOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : " (Active)"}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Click to view path
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
