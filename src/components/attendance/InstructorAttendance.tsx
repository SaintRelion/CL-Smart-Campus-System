import { useState, useRef, useEffect } from "react";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { AttendanceLog } from "@/models/attendance";
import { useAuth } from "@saintrelion/auth-lib";

import {
  formatReadableDate,
  formatReadableDateTime,
  getCurrentDateTimeString,
  isSameDay,
} from "@saintrelion/time-functions";

import {
  appendPath,
  encodePath,
} from "../../pages/to-be-library/geo/lib/parser";
import { GeoViewer } from "../../pages/to-be-library/geo/GeoViewer";
import { useGeoStore } from "@/pages/to-be-library/geo/useGeoStore";

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");

  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < raw.length; i++) {
    view[i] = raw.charCodeAt(i);
  }

  return buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}

function prepareAuthenticationOptions(options: any) {
  return {
    ...options,
    challenge: base64urlToBuffer(options.challenge),
    allowCredentials: (options.allowCredentials || []).map((cred: any) => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    })),
  };
}

async function authenticateFingerprint(userId: string) {
  const csrfToken = getCookie("csrftoken");

  const optionsRes = await fetch(
    "http://127.0.0.1:8000/api/device/login/begin/",
    {
      method: "POST",
      body: JSON.stringify({ username: userId }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken ?? "",
      },
      credentials: "include",
    },
  );
  const options = await optionsRes.json();

  const publicKey = prepareAuthenticationOptions(options);
  const assertion = (await navigator.credentials.get({
    publicKey: publicKey,
  })) as PublicKeyCredential;

  const res = assertion.response as AuthenticatorAssertionResponse;

  const authResponse = {
    id: assertion.id,
    rawId: bufferToBase64url(assertion.rawId),
    type: assertion.type,
    response: {
      authenticatorData: bufferToBase64url(res.authenticatorData),
      clientDataJSON: bufferToBase64url(res.clientDataJSON),
      signature: bufferToBase64url(res.signature),
      userHandle: res.userHandle ? bufferToBase64url(res.userHandle) : null,
    },
  };

  console.log(authResponse);
  const verifyRes = await fetch(
    "http://127.0.0.1:8000/api/device/login/finish/",
    {
      method: "POST",
      body: JSON.stringify(authResponse),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken ?? "",
      },
      credentials: "include",
    },
  );

  return await verifyRes.json();
}

export default function InstructorAttendance() {
  const { user } = useAuth();

  const initTracking = useGeoStore((s) => s.initTracking);

  useEffect(() => {
    initTracking();
  }, [initTracking]);

  const pathMovement = useGeoStore((s) => s.path);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Attendance Select, Update, Insert
  const {
    useSelect: attendanceSelect,
    useInsert: attendanceInsert,
    useUpdate: attendanceUpdate,
  } = useDBOperationsLocked<AttendanceLog>("AttendanceLog");
  const { data: attendanceLogs = [] } = attendanceSelect({
    firebaseOptions: {
      filterField: "employeeId",
      value: user.employeeId,
    },
    mockOptions: {
      filterFn: (a) => a.employeeId === user.employeeId,
    },
  });

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const todayAttendance = attendanceLogs.find((log) => {
    const today = getCurrentDateTimeString();
    // console.log("TODAY--");
    // console.log(formatReadableDate(today));
    // console.log(formatReadableDate(log.createdAt));

    if (isSameDay(formatReadableDate(log.createdAt), formatReadableDate(today)))
      return log;
  });

  useEffect(() => {
    setIsCheckedIn(todayAttendance != undefined);
  }, [todayAttendance]);

  const handleAttendanceToggle = async () => {
    // const result = await registerFingerprint(user.id);
    // console.log(result);

    const result = await authenticateFingerprint(user.id);
    if (result.status) {
      // setIsCheckedIn(true);
      console.log(result.status);

      const logId = todayAttendance?.id;
      if (!isCheckedIn) {
        // ---- CHECK IN ----
        const now = getCurrentDateTimeString();
        setIsCheckedIn(true);

        // if no record for today, create one
        if (!logId) {
          attendanceInsert.run({
            employeeId: user.employeeId,
            timeIn: now,
            pathMovement: encodePath(pathMovement),
          });
        }

        // Start periodic path capture every 5 minutes
        // intervalRef.current = setInterval(
        //   () => {
        //     if (pathMovement.length > 0) {
        //       const last = pathMovement[pathMovement.length - 1];

        //       attendanceUpdate.mutate({
        //         field: "id",
        //         value: logId!,
        //         updates: {
        //           pathMovement: appendPath(todayAttendance?.pathMovement, last),
        //         },
        //       });
        //     }
        //   },
        //   5 * 60 * 1000,
        // ); // 5 minutes
      } else {
        // ---- CHECK OUT ----
        const now = getCurrentDateTimeString();
        setIsCheckedIn(false);

        // Stop tracking timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Save final position
        if (pathMovement.length > 0) {
          const last = pathMovement[pathMovement.length - 1];

          attendanceUpdate.run({
            field: "id",
            value: logId!,
            updates: {
              timeOut: now,
              pathMovement: appendPath(todayAttendance?.pathMovement, last),
            },
          });
        }
      }
    } else {
      alert("Fingerprint failed");
      console.log(result.error || "Fingerprint failed");
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
          className={`cursor-pointer rounded px-4 py-2 text-white ${
            isCheckedIn ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>

      <GeoViewer
        uiParameters={{
          showDefaultControls: false,
          showDefaultData: true,
          showMap: true,
        }}
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
