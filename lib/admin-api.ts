"use client";

import { auth } from "@/lib/firebase/client";

async function getAuthHeader(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function getAuthHeaderFormData(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// ── Upload ──────────────────────────────────────────────────────────────────
export async function uploadFile(file: File, path: string): Promise<string> {
  const headers = await getAuthHeaderFormData();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);
  const res = await fetch("/api/admin/upload", { method: "POST", headers, body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const { url } = await res.json();
  return url;
}

// ── Items ───────────────────────────────────────────────────────────────────
export async function apiCreateItem(data: object): Promise<string> {
  const headers = await getAuthHeader();
  const res = await fetch("/api/admin/items", { method: "POST", headers, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create item");
  const { id } = await res.json();
  return id;
}

export async function apiUpdateItem(id: string, data: object): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`/api/admin/items/${id}`, { method: "PUT", headers, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update item");
}

export async function apiDeleteItem(id: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`/api/admin/items/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error("Failed to delete item");
}

// ── Categories ──────────────────────────────────────────────────────────────
export async function apiCreateCategory(data: object): Promise<string> {
  const headers = await getAuthHeader();
  const res = await fetch("/api/admin/categories", { method: "POST", headers, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create category");
  const { id } = await res.json();
  return id;
}

export async function apiUpdateCategory(id: string, data: object): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`/api/admin/categories/${id}`, { method: "PUT", headers, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update category");
}

export async function apiDeleteCategory(id: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error("Failed to delete category");
}

// ── Home Content ────────────────────────────────────────────────────────────
export async function apiGetHomeContent(): Promise<object> {
  const headers = await getAuthHeader();
  const res = await fetch("/api/admin/home-content", { method: "GET", headers });
  if (!res.ok) throw new Error("Failed to fetch home content");
  return res.json();
}

export async function apiUpdateHomeSection(section: string, data: object): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch("/api/admin/home-content", {
    method: "PATCH",
    headers,
    body: JSON.stringify({ section, data }),
  });
  if (!res.ok) throw new Error("Failed to update home content");
}

// ── Enquiries ───────────────────────────────────────────────────────────────
export async function apiMarkEnquiryRead(id: string, read: boolean): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ read }),
  });
  if (!res.ok) throw new Error("Failed to update enquiry");
}
