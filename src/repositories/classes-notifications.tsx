import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { ClassesNotifications } from "@/models/classes-notifications";

// Firebase
firebaseRegister("ClassesNotifications");

// API
apiRegister("ClassesNotifications", "classesnotifications");

// Mock
mockRegister<ClassesNotifications>("ClassesNotifications", [
  {
    id: "1",
    classID: "1",
    type: "room_change",
    message: "Class moved to Room B1",
    date: "2025-10-05",
    time: "7:30",
  },
  {
    id: "2",
    classID: "2",
    type: "cancellation",
    message: "Class cancelled due to holiday",
    date: "2025-10-06",
    time: "08:00",
  },
]);
