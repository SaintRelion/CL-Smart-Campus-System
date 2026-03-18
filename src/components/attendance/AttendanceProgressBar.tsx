import type { AttendanceLog } from "@/models/attendance";
import type { ClassSubject } from "@/models/class-subject";

const toMins = (t: string | Date) => {
  if (t instanceof Date) return t.getHours() * 60 + t.getMinutes();
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const AttendanceProgressBar = ({
  subject,
  logs,
}: {
  subject: ClassSubject;
  logs: AttendanceLog[];
}) => {
  const sStart = toMins(subject.time_in);
  const sEnd = toMins(subject.time_out);
  const sDuration = sEnd - sStart;

  return (
    <div className="space-y-1 py-2">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
        <span>
          {subject.title} ({subject.room})
        </span>
        <span>
          {subject.time_in} - {subject.time_out}
        </span>
      </div>

      {/* The Track (Expected Time) */}
      <div className="relative h-4 w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100">
        {logs.map((log) => {
          const lStart = toMins(new Date(log.timeIn));
          const lEnd = log.timeOut
            ? toMins(new Date(log.timeOut))
            : toMins(new Date());

          // Calculate bounds (clamped within subject time)
          const startBound = Math.max(lStart, sStart);
          const endBound = Math.min(lEnd, sEnd);

          if (startBound >= sEnd || endBound <= sStart) return null; // No overlap

          const left = ((startBound - sStart) / sDuration) * 100;
          const width = ((endBound - startBound) / sDuration) * 100;

          return (
            <div
              key={log.id}
              className="absolute h-full bg-blue-500 shadow-[inset_0_0_8px_rgba(0,0,0,0.1)] transition-all"
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`Actual: ${new Date(log.timeIn).toLocaleTimeString()}`}
            />
          );
        })}
      </div>
    </div>
  );
};
