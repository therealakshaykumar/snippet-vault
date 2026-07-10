import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type Language = "javascript" | "typescript";

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  userId: string;
  userEmail: string;
  isPublic: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

const SNIPPETS = "snippets";

export async function createSnippet(data: {
  title: string;
  code: string;
  language: Language;
  userId: string;
  userEmail: string;
  isPublic: boolean;
}) {
  const ref = await addDoc(collection(db, SNIPPETS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSnippet(
  id: string,
  data: Partial<Pick<Snippet, "title" | "code" | "language" | "isPublic">>
) {
  await updateDoc(doc(db, SNIPPETS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSnippet(id: string) {
  await deleteDoc(doc(db, SNIPPETS, id));
}

export async function getSnippet(id: string): Promise<Snippet | null> {
  const snap = await getDoc(doc(db, SNIPPETS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Snippet;
}

export async function getPublicSnippets(): Promise<Snippet[]> {
  const q = query(
    collection(db, SNIPPETS),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Snippet);
}

export async function getUserSnippets(userId: string): Promise<Snippet[]> {
  const q = query(
    collection(db, SNIPPETS),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Snippet);
}
