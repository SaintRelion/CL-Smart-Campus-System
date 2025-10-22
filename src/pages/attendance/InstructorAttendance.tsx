import { useState, useRef, useEffect } from "react";
import { GeoViewer } from "../to-be-library/geo/geo-viewer";
import { useDBOperations } from "@saintrelion/data-access-layer";
import type { AttendanceLog } from "@/models/attendance";
import { useAuth } from "@saintrelion/auth-lib";

import {
  formatReadableDateTime,
  getCurrentDateTime,
  isSameDay,
} from "@saintrelion/time-functions";

import { appendPath, encodePath } from "../to-be-library/geo/lib/parser";

export default function InstructorAttendance() {
  const { user } = useAuth();

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([
    { lat: 6.9271552, lng: 122.0706304 },
  ]);
  const [pathMovement, setPathMovement] = useState<number[][]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    useSelect: attendanceSelect,
    useUpdate: attendanceUpdate,
    useInsert: attendanceInsert,
  } = useDBOperations<AttendanceLog>("AttendanceLog");
  const { data: attendanceLogs = [] } = attendanceSelect({
    firebaseOptions: {
      filterField: "employeeID",
      value: user.employeeID,
    },
    mockOptions: {
      filterFn: (a) => a.employeeID === user.employeeID,
    },
  });

  const todayAttendance = attendanceLogs.find((log) => {
    const created = log.createdAt;
    const today = getCurrentDateTime();
    if (isSameDay(created, today)) return log;
  });

  // useEffect(() => {
  //   if (todayAttendance?.timeIn && !todayAttendance?.timeOut) {
  //     console.log("Tracking Position");
  //     setIsCheckedIn(true);

  //     // clear any previous interval before setting a new one
  //     if (intervalRef.current) clearInterval(intervalRef.current);

  //     intervalRef.current = setInterval(
  //       () => {
  //         setPathMovement((prevPath) => {
  //           if (path.length === 0) return prevPath;

  //           const last = path[path.length - 1];
  //           const newPath = [...prevPath, [last.lat, last.lng]];

  //           attendanceUpdate.mutate({
  //             field: "id",
  //             value: todayAttendance?.id,
  //             updates: {
  //               pathMovement: appendPath(todayAttendance?.pathMovement, last),
  //             },
  //           });

  //           return newPath;
  //         });
  //       },
  //       5 * 60 * 1000,
  //     ); // every 5 minutes

  //     // Cleanup on unmount or when attendance changes
  //     return () => {
  //       if (intervalRef.current) clearInterval(intervalRef.current);
  //     };
  //   } else {
  //     // not checked in, ensure no interval is running
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //   }
  //   if (intervalRef.current) clearInterval(intervalRef.current);
  // }, [
  //   todayAttendance?.id,
  //   todayAttendance?.timeIn,
  //   todayAttendance?.timeOut,
  //   attendanceUpdate,
  //   todayAttendance?.pathMovement,
  //   path,
  // ]);

  // 🟢 Toggle Attendance
  const handleAttendanceToggle = () => {
    const logId = todayAttendance?.id;
    if (!isCheckedIn) {
      // ---- CHECK IN ----
      const now = new Date().toISOString();
      setIsCheckedIn(true);

      // Capture first position immediately
      if (path.length > 0) {
        const last = path[path.length - 1];
        setPathMovement([[last.lat, last.lng]]);
      }

      // if no record for today, create one
      if (!logId) {
        attendanceInsert.mutate({
          employeeID: user.employeeID,
          timeIn: now,
          pathMovement: encodePath([path[0]]),
        });
      }

      // Start periodic path capture every 5 minutes
      intervalRef.current = setInterval(
        () => {
          if (path.length > 0) {
            const last = path[path.length - 1];
            setPathMovement((prev) => [...prev, [last.lat, last.lng]]);

            attendanceUpdate.mutate({
              field: "id",
              value: logId!,
              updates: {
                pathMovement: appendPath(todayAttendance?.pathMovement, last),
              },
            });
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes
    } else {
      // ---- CHECK OUT ----
      setIsCheckedIn(false);

      const now = new Date().toISOString();

      // Stop tracking timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Save final position
      if (path.length > 0) {
        const last = path[path.length - 1];
        setPathMovement((prev) => [...prev, [last.lat, last.lng]]);

        attendanceUpdate.mutate({
          field: "id",
          value: logId!,
          updates: {
            timeOut: now,
            pathMovement: appendPath(todayAttendance?.pathMovement, last),
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Attendance Tracker ({isCheckedIn ? "Checked In" : "Checked Out"})
        </h2>
        <button
          onClick={handleAttendanceToggle}
          className={`rounded px-4 py-2 text-white ${
            isCheckedIn ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>

      <GeoViewer
        wrapperClass="h-[400px] w-full"
        showControls={false}
        showMap={false}
        geoOptions={{ mode: "single" }}
        // onCoordinateChange={(_, pathData) => setPath(pathData)}
      />

      <div className="rounded border bg-gray-50 p-4">
        <p>
          <strong>Time In:</strong>{" "}
          {todayAttendance?.timeIn
            ? formatReadableDateTime(todayAttendance.timeIn)
            : "—"}
        </p>
        <p>
          <strong>Time Out:</strong>{" "}
          {todayAttendance?.timeOut
            ? formatReadableDateTime(todayAttendance.timeOut)
            : "—"}
        </p>
        <p>
          <strong>Path Points Recorded:</strong> {pathMovement.length}
        </p>
      </div>
    </div>
  );
}
