import { db } from "@/lib/firebase-client";
import type { AttendanceLogsProps } from "@/models/attendance";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const COLLECTION = "attendanceLogs";

// --- SELECT ---
export async function selectAttendanceLogs(): Promise<AttendanceLogsProps[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({
    ...(d.data() as AttendanceLogsProps),
    firebaseID: d.id,
  }));
}

// --- INSERT ---
export async function insertAttendanceLog(
  cls: Omit<AttendanceLogsProps, "id" | "firebaseID">,
): Promise<string> {
  const colRef = collection(db, COLLECTION);
  const docRef = await addDoc(colRef, cls);
  return docRef.id;
}

// --- UPDATE ---
export async function updateAttendanceLog(
  firebaseID: string,
  updates: Partial<AttendanceLogsProps>,
): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseID);
  await updateDoc(docRef, updates);
}

// ARCHIVE (soft delete)
export async function archiveAttendanceLog(firebaseId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseId);
  await updateDoc(docRef, { archived: true });
}

// --- DELETE (hard delete) ---
export async function deleteAttendanceLog(firebaseID: string): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseID);
  await deleteDoc(docRef);
}
