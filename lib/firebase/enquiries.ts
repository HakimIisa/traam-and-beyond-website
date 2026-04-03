import { adminDb } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import type { EnquiryFormData, Enquiry } from "@/types";

export async function createEnquiry(data: EnquiryFormData): Promise<string> {
  const ref = adminDb.collection("enquiries").doc();
  await ref.set({
    ...data,
    read: false,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  const snapshot = await adminDb
    .collection("enquiries")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      email: data.email,
      message: data.message,
      itemId: data.itemId ?? null,
      itemTitle: data.itemTitle ?? null,
      type: data.type,
      read: data.read ?? false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as Enquiry;
  });
}

export async function markEnquiryRead(id: string, read: boolean): Promise<void> {
  await adminDb.collection("enquiries").doc(id).update({ read });
}

export async function getUnreadEnquiryCount(): Promise<number> {
  const snapshot = await adminDb
    .collection("enquiries")
    .where("read", "==", false)
    .count()
    .get();
  return snapshot.data().count;
}
