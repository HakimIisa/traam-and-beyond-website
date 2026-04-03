/**
 * Firebase Seed Script
 * Run with: npx tsx scripts/seed.ts
 *
 * Populates your Firestore database with the same placeholder data
 * used during development. Run this once after Firebase is configured.
 *
 * Prerequisites:
 *   1. .env.local must be filled in with your Firebase config
 *   2. FIREBASE_SERVICE_ACCOUNT_JSON must be set
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { MOCK_CATEGORIES, MOCK_ITEMS } from "../lib/mock-data";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "{}"
  );
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  // Seed categories
  console.log("📁 Seeding categories...");
  for (const category of MOCK_CATEGORIES) {
    const { id, ...data } = category;
    await db
      .collection("categories")
      .doc(id)
      .set({ ...data, createdAt: Timestamp.now() });
    console.log(`  ✓ ${category.name}`);
  }

  // Seed items
  console.log("\n📦 Seeding items...");
  for (const item of MOCK_ITEMS) {
    const { id, ...data } = item;
    await db
      .collection("items")
      .doc(id)
      .set({ ...data, createdAt: Timestamp.now() });
    console.log(`  ✓ ${item.title}`);
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${MOCK_CATEGORIES.length} categories`);
  console.log(`   ${MOCK_ITEMS.length} items`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
