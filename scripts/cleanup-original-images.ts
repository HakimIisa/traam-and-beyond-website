/**
 * Original Image Cleanup Script
 * Run with: npx tsx scripts/cleanup-original-images.ts [--dry-run]
 *
 * Deletes the pre-WebP original image files left behind by
 * scripts/backfill-images.ts, now that every Firestore reference has been
 * confirmed to point at the "-optimized.webp" replacement instead.
 *
 * This is the one genuinely irreversible step in the whole WebP migration —
 * unlike the backfill script, it does not have a "leave the old one around
 * as a safety net" option, because deleting the old one IS the point. To
 * keep it safe:
 *
 *   - It only ever considers files recorded in backfill-images-log.json
 *     (i.e. files this migration itself created a replacement for) — it
 *     never does a generic "delete anything unreferenced" sweep of Storage.
 *   - Before deleting an original, it re-reads Firestore FRESH (not just
 *     trusting the log) and only deletes when BOTH are true:
 *       1. the original URL is confirmed NOT referenced anywhere anymore
 *       2. the new WebP URL IS confirmed referenced somewhere
 *     If either check fails, that file is skipped, not deleted — e.g. if an
 *     item was edited/deleted after the backfill ran, this conservatively
 *     leaves the original alone rather than guessing.
 *
 * Prerequisites:
 *   1. scripts/backfill-images.ts must have already been run (this script
 *      reads its log; it does nothing if the log doesn't exist)
 *   2. .env.local must be filled in, same as the backfill script
 *
 * Recommended: run with --dry-run first and read the report before running
 * for real.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "{}"
  );
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

const LOG_PATH = path.join(__dirname, "backfill-images-log.json");
const DRY_RUN = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

const STORAGE_PREFIX = `https://storage.googleapis.com/${bucket.name}/`;

function storagePathFromUrl(url: string): string | null {
  return url.startsWith(STORAGE_PREFIX)
    ? decodeURIComponent(url.slice(STORAGE_PREFIX.length))
    : null;
}

type LogEntry = {
  oldUrl: string;
  newUrl: string;
  status: "done" | "failed";
  error?: string;
};

/** Every image URL currently referenced anywhere in Firestore, as of right now. */
async function collectCurrentlyReferencedUrls(): Promise<Set<string>> {
  const referenced = new Set<string>();

  function add(url: unknown) {
    if (typeof url === "string" && url) referenced.add(url);
  }

  const items = await db.collection("items").get();
  for (const doc of items.docs) {
    const images: string[] = doc.data().images ?? [];
    images.forEach(add);
  }

  const categories = await db.collection("categories").get();
  for (const doc of categories.docs) add(doc.data().coverImage);

  const research = await db.collection("research_items").get();
  for (const doc of research.docs) {
    const images: string[] = doc.data().images ?? [];
    images.forEach(add);
  }

  const featured = await db.collection("featured_items").get();
  for (const doc of featured.docs) add(doc.data().imageUrl);

  const stories = await db.collection("stories").get();
  for (const doc of stories.docs) add(doc.data().image);

  return referenced;
}

async function main() {
  console.log(`🧹 Original image cleanup${DRY_RUN ? " (DRY RUN — no deletes)" : ""}\n`);

  if (!fs.existsSync(LOG_PATH)) {
    console.log("No backfill-images-log.json found — run scripts/backfill-images.ts first.");
    process.exit(1);
  }

  const log: Record<string, LogEntry> = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
  const referenced = await collectCurrentlyReferencedUrls();

  const toDelete: LogEntry[] = [];
  let skippedOldStillReferenced = 0;
  let skippedNewNotConfirmed = 0;
  let skippedNotDone = 0;

  for (const entry of Object.values(log)) {
    if (entry.status !== "done" || entry.oldUrl === entry.newUrl) {
      skippedNotDone++;
      continue;
    }
    if (referenced.has(entry.oldUrl)) {
      // Something still points at the original — never delete it, no matter what.
      skippedOldStillReferenced++;
      continue;
    }
    if (!referenced.has(entry.newUrl)) {
      // Can't confirm the replacement actually took effect (e.g. the item was
      // edited/deleted since the backfill ran) — skip rather than guess.
      skippedNewNotConfirmed++;
      continue;
    }
    toDelete.push(entry);
  }

  console.log(`${toDelete.length} original file(s) confirmed safe to delete.`);
  console.log(`${skippedOldStillReferenced} skipped — original is still referenced somewhere.`);
  console.log(`${skippedNewNotConfirmed} skipped — could not confirm the WebP replacement is currently referenced.`);
  console.log(`${skippedNotDone} skipped — not a completed migration entry.\n`);

  const batch = toDelete.slice(0, LIMIT);
  if (batch.length < toDelete.length) {
    console.log(`--limit=${LIMIT}: processing ${batch.length} of ${toDelete.length} this run.\n`);
  }

  let totalBytes = 0;
  let deleted = 0;
  let failed = 0;

  for (const entry of batch) {
    const storagePath = storagePathFromUrl(entry.oldUrl);
    if (!storagePath) {
      console.log(`  could not resolve Storage path for ${entry.oldUrl}`);
      failed++;
      continue;
    }

    try {
      const fileRef = bucket.file(storagePath);
      const [exists] = await fileRef.exists();
      if (!exists) {
        console.log(`  (already gone) ${storagePath}`);
        continue;
      }

      const [metadata] = await fileRef.getMetadata();
      const sizeBytes = Number(metadata.size ?? 0);
      totalBytes += sizeBytes;

      console.log(
        `${DRY_RUN ? "[dry-run] would delete" : "deleted"} original (${(sizeBytes / 1024 / 1024).toFixed(2)}MB):\n` +
          `  old: ${entry.oldUrl}\n` +
          `  new (still live): ${entry.newUrl}`
      );

      if (!DRY_RUN) await fileRef.delete();
      deleted++;
    } catch (err) {
      failed++;
      console.log(`  ✗ failed on ${storagePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(
    `\n${DRY_RUN ? "Would free" : "Freed"} ~${(totalBytes / 1024 / 1024).toFixed(1)}MB across ${deleted} file(s). ${failed} failed.`
  );
  if (DRY_RUN) {
    console.log("\nNothing was deleted. Re-run without --dry-run to actually delete these files.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Cleanup failed:", err);
  process.exit(1);
});
