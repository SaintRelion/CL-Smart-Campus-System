export interface ClassesNotifications {
  id: string;
  classID: string;
  type: "room_change" | "time_change" | "cancellation" | "instructor_absence";
  message: string;
  date: string;
  time: string;
}
