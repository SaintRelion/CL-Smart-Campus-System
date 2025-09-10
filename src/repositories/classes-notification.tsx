import { db } from "@/lib/firebase-client";
import type { ClassesNotificationsProps } from "@/models/classes-notifications";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const COLLECTION = "classes-notifications";

// --- SELECT ---
export async function selectClassesNotifications(): Promise<
  ClassesNotificationsProps[]
> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({
    ...(d.data() as ClassesNotificationsProps),
    firebaseID: d.id,
  }));
}

// --- INSERT ---
export async function insertClassNotification(
  cls: Omit<ClassesNotificationsProps, "id" | "firebaseID">,
): Promise<string> {
  const colRef = collection(db, COLLECTION);
  const docRef = await addDoc(colRef, cls);
  return docRef.id;
}

// --- UPDATE ---
export async function updateClassNotification(
  firebaseID: string,
  updates: Partial<ClassesNotificationsProps>,
): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseID);
  await updateDoc(docRef, updates);
}

// ARCHIVE (soft delete)
export async function archiveClassNotification(
  firebaseId: string,
): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseId);
  await updateDoc(docRef, { archived: true });
}

// --- DELETE (hard delete) ---
export async function deleteClassNotification(
  firebaseID: string,
): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseID);
  await deleteDoc(docRef);
}
