export interface ClassesProps {
  id: number;
  userId: number;
  title: string;
  code: string;
  days: string[];
  time: string;
  room?: string;
}

export interface ClassesNotificationsProps {
  id: number;
  classId: number;
  type: "room_change" | "cancellation" | "instructor_absence";
  message: string;
  date: string; // ISO for when it applies
}
