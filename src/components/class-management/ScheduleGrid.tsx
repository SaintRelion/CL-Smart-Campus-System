import type { ClassSubject } from "@/models/class-subject";
import React from "react";

export const ScheduleGrid = ({
  allClasses,
  selectedDays,
  previewRange,
}: {
  allClasses: ClassSubject[];
  selectedDays: string[];
  previewRange: { in: string; out: string };
}) => {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = [];
  for (let hour = 7; hour <= 21; hour++) {
    timeSlots.push(`${String(hour).padStart(2, "0")}:00`);
    timeSlots.push(`${String(hour).padStart(2, "0")}:30`);
  }

  const toMins = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const formatTime = (time24: string) => {
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m === 0 ? "00" : "30"} ${ampm}`;
  };

  return (
    <div className="space-y-4 select-none">
      <div className="grid grid-cols-[85px_repeat(7,1fr)] gap-px border bg-gray-200 text-[10px]">
        {/* Header */}
        <div className="bg-gray-100 p-2" />
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-2 text-center font-bold text-gray-500"
          >
            {day.substring(0, 3)}
          </div>
        ))}

        {timeSlots.map((slot) => (
          <React.Fragment key={slot}>
            {/* Time Label */}
            <div className="flex h-10 items-center justify-end border-r bg-white pr-2 font-semibold text-gray-400">
              {slot.endsWith(":00") ? formatTime(slot) : ""}
            </div>

            {/* Day Columns */}
            {weekDays.map((day) => {
              const slotStart = toMins(slot);
              const pIn = toMins(previewRange.in);
              const pOut = toMins(previewRange.out);
              const isSelectedDay = selectedDays.includes(day);

              // 1. Find ALL classes for this day/time
              const classesThisSlot = allClasses.filter((cls) =>
                cls.days.includes(day),
              );

              // Identify if ANY class is entering or exiting this exact slot
              const exitingCls = classesThisSlot.find(
                (cls) => toMins(cls.time_out) === slotStart,
              );
              const enteringCls = classesThisSlot.find(
                (cls) => toMins(cls.time_in) === slotStart,
              );
              const insideCls = classesThisSlot.find(
                (cls) =>
                  slotStart > toMins(cls.time_in) &&
                  slotStart < toMins(cls.time_out),
              );

              // 2. Identify Preview status
              const isPStart = isSelectedDay && pIn === slotStart;
              const isPEnd = isSelectedDay && pOut === slotStart;
              const isPInside =
                isSelectedDay && slotStart > pIn && slotStart < pOut;

              let bgStyle: React.CSSProperties = { backgroundColor: "white" };

              // --- LOGIC ENGINE ---

              // PRIORITY 1: Existing Class Hand-off (Red to Red)
              if (exitingCls && enteringCls) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, #ef4444 50%, #ef4444 50%)",
                }; // Solid Red
              }
              // PRIORITY 2: Existing Exit to Preview Entry (Red to Blue)
              else if (exitingCls && isPStart) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, #ef4444 50%, #60a5fa 50%)",
                };
              }
              // PRIORITY 3: Preview Exit to Existing Entry (Blue to Red)
              else if (isPEnd && enteringCls) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, #60a5fa 50%, #ef4444 50%)",
                };
              }
              // PRIORITY 4: Single Hand-offs (to White)
              else if (exitingCls) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, #ef4444 50%, white 50%)",
                };
              } else if (enteringCls) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, white 50%, #ef4444 50%)",
                };
              } else if (isPEnd) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, #60a5fa 50%, white 50%)",
                };
              } else if (isPStart) {
                bgStyle = {
                  background:
                    "linear-gradient(to bottom, white 50%, #60a5fa 50%)",
                };
              }
              // PRIORITY 5: Solid Fills
              else if (insideCls) {
                bgStyle = { backgroundColor: "#ef4444" };
              } else if (isPInside) {
                bgStyle = { backgroundColor: "#60a5fa" };
              }

              return (
                <div
                  key={day + slot}
                  style={bgStyle}
                  className="relative flex h-10 items-center justify-center border-b border-gray-100 transition-all"
                >
                  {(isPInside || insideCls) && (
                    <span className="truncate px-1 text-[8px] font-bold text-white uppercase opacity-60">
                      Occupied
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
