export interface ClassesNotificationsProps {
  firebaseID?: string;
  id: number;
  classId: number;
  type: "room_change" | "cancellation" | "instructor_absence";
  message: string;
  date: string; // ISO for when it applies
}
