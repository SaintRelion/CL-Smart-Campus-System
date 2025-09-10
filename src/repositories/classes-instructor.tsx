import { db } from "@/lib/firebase-client";
import type { ClassesProps } from "@/models/classes-instructor";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const COLLECTION = "classes";

// --- SELECT ---
export async function selectClasses(): Promise<ClassesProps[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({
    ...(d.data() as ClassesProps),
    firebaseID: d.id,
  }));
}

// --- INSERT ---
export async function insertClass(
  cls: Omit<ClassesProps, "id" | "firebaseID">,
): Promise<string> {
  const colRef = collection(db, COLLECTION);
  const docRef = await addDoc(colRef, cls);
  return docRef.id;
}

// --- UPDATE ---
export async function updateClass(
  firebaseID: string,
  updates: Partial<ClassesProps>,
): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseID);
  await updateDoc(docRef, updates);
}

// ARCHIVE (soft delete)
export async function archiveClass(firebaseId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseId);
  await updateDoc(docRef, { archived: true });
}

// --- DELETE (hard delete) ---
export async function deleteClass(firebaseID: string): Promise<void> {
  const docRef = doc(db, COLLECTION, firebaseID);
  await deleteDoc(docRef);
}
