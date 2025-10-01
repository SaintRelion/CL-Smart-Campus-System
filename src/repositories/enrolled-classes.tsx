import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { EnrolledClasses } from "@/models/enrolled-classes";

// Firebase
firebaseRegister("EnrolledClasses");

// API
apiRegister("EnrolledClasses", "enrolledclasses");

// Mock
mockRegister<EnrolledClasses>("EnrolledClasses", [
  { id: "1", userID: "1", classID: "1" },
  { id: "2", userID: "2", classID: "2" },
]);
