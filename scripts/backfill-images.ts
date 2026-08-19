/**
 * Image Backfill Script
 * Run with: npx tsx scripts/backfill-images.ts [--dry-run] [--limit=N]
 *
 * Re-encodes every existing catalogue image (items, categories, research,
 * featured, stories) to a resized WebP copy, uploads it alongside the
 * original under a new path, and only then repoints the relevant Firestore
 * field(s) at the new URL. Originals are never overwritten or deleted by
 * this script — that is a deliberate, separate cleanup step to run later,
 * once the live site has been spot-checked against the new images.
 *
 * Safe to re-run: progress is persisted to backfill-images-log.json next to
 * this file, so a crash or interruption partway through can just be resumed
 * by running the script again (already-converted images and already-applied
 * Firestore updates are both skipped/no-ops on the next run).
 *
 * Prerequisites:
 *   1. .env.local must be filled in with your Firebase config
 *   2. FIREBASE_SERVICE_ACCOUNT_JSON and NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET must be set
 *
 * Recommended first run: npx tsx scripts/backfill-images.ts --dry-run --limit=3
 * — processes/logs a small sample without touching Storage or Firestore, so
 * you can sanity-check the plan before running it for real.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";

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

const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

const LOG_PATH = path.join(__dirname, "backfill-images-log.json");

const DRY_RUN = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

type LogEntry = {
  oldUrl: string;
  newUrl: string;
  status: "done" | "failed";
  error?: string;
};
type Log = Record<string, LogEntry>;

function loadLog(): Log {
  if (fs.existsSync(LOG_PATH)) {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
  }
  return {};
}

function saveLog(log: Log) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

// Only URLs our own upload pipeline could have produced are ever touched.
// Several fields across this codebase (e.g. seeded Research items, category
// covers) can legitimately hold relative /public paths or other non-Storage
// URLs — those are skipped, not treated as errors.
const STORAGE_PREFIX = `https://storage.googleapis.com/${bucket.name}/`;

function storagePathFromUrl(url: string): string | null {
  return url.startsWith(STORAGE_PREFIX)
    ? decodeURIComponent(url.slice(STORAGE_PREFIX.length))
    : null;
}

interface FieldRef {
  collection: string;
  docId: string;
  field: string;
  isArray: boolean;
}

async function collectReferences(): Promise<Map<string, FieldRef[]>> {
  const urlToRefs = new Map<string, FieldRef[]>();

  function addRef(url: unknown, ref: FieldRef) {
    if (typeof url !== "string" || !url) return;
    if (!storagePathFromUrl(url)) return; // not one of our Storage objects — skip
    const list = urlToRefs.get(url) ?? [];
    list.push(ref);
    urlToRefs.set(url, list);
  }

  const items = await db.collection("items").get();
  for (const doc of items.docs) {
    const images: string[] = doc.data().images ?? [];
    images.forEach((url) =>
      addRef(url, { collection: "items", docId: doc.id, field: "images", isArray: true })
    );
  }

  const categories = await db.collection("categories").get();
  for (const doc of categories.docs) {
    addRef(doc.data().coverImage, {
      collection: "categories",
      docId: doc.id,
      field: "coverImage",
      isArray: false,
    });
  }

  const research = await db.collection("research_items").get();
  for (const doc of research.docs) {
    const images: string[] = doc.data().images ?? [];
    images.forEach((url) =>
      addRef(url, { collection: "research_items", docId: doc.id, field: "images", isArray: true })
    );
  }

  const featured = await db.collection("featured_items").get();
  for (const doc of featured.docs) {
    addRef(doc.data().imageUrl, {
      collection: "featured_items",
      docId: doc.id,
      field: "imageUrl",
      isArray: false,
    });
  }

  const stories = await db.collection("stories").get();
  for (const doc of stories.docs) {
    addRef(doc.data().image, {
      collection: "stories",
      docId: doc.id,
      field: "image",
      isArray: false,
    });
  }

  return urlToRefs;
}

/** Returns the new URL on success, or null if nothing needed to change / it failed. */
async function processUrl(url: string, log: Log): Promise<string | null> {
  if (url.endsWith(".webp")) return null; // already optimized (Part 1 upload, or a prior backfill run)

  const existing = log[url];
  if (existing?.status === "done") return existing.newUrl;

  const storagePath = storagePathFromUrl(url);
  if (!storagePath) {
    log[url] = { oldUrl: url, newUrl: url, status: "failed", error: "Could not resolve Storage path" };
    return null;
  }

  try {
    const [buffer] = await bucket.file(storagePath).download();
    const output = await sharp(buffer)
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Deliberately a new path, never the original — the original is left in
    // place untouched until a human confirms the new one renders correctly.
    const newPath = storagePath.replace(/\.[^./]+$/, "") + "-optimized.webp";
    const newUrl = `${STORAGE_PREFIX}${newPath}`;

    if (!DRY_RUN) {
      const newFileRef = bucket.file(newPath);
      await newFileRef.save(output, {
        metadata: { contentType: "image/webp" },
        predefinedAcl: "publicRead",
      });
      const [exists] = await newFileRef.exists();
      if (!exists) throw new Error("Uploaded file not found immediately after save");
    }

    log[url] = { oldUrl: url, newUrl, status: "done" };
    return newUrl;
  } catch (err) {
    log[url] = {
      oldUrl: url,
      newUrl: url,
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
    return null;
  }
}

async function applyFirestoreUpdates(urlToRefs: Map<string, FieldRef[]>, log: Log) {
  const scalarUpdates = new Map<string, { collection: string; docId: string; updates: Record<string, string> }>();
  const arrayFieldRefs = new Map<string, FieldRef>();

  for (const [oldUrl, refs] of urlToRefs) {
    const entry = log[oldUrl];
    const newUrl = entry?.status === "done" ? entry.newUrl : null;

    for (const ref of refs) {
      if (ref.isArray) {
        arrayFieldRefs.set(`${ref.collection}/${ref.docId}/${ref.field}`, ref);
        continue;
      }
      if (!newUrl || newUrl === oldUrl) continue;
      const key = `${ref.collection}/${ref.docId}`;
      const docEntry = scalarUpdates.get(key) ?? { collection: ref.collection, docId: ref.docId, updates: {} };
      docEntry.updates[ref.field] = newUrl;
      scalarUpdates.set(key, docEntry);
    }
  }

  for (const { collection, docId, updates } of scalarUpdates.values()) {
    if (Object.keys(updates).length === 0) continue;
    if (!DRY_RUN) await db.collection(collection).doc(docId).update(updates);
    console.log(`  ${DRY_RUN ? "[dry-run] would update" : "updated"} ${collection}/${docId}:`, updates);
  }

  // Array fields need the whole array rebuilt (not indexed patches), so each
  // touched doc/field is re-read fresh and every element remapped through the log.
  for (const { collection, docId, field } of arrayFieldRefs.values()) {
    const docRef = db.collection(collection).doc(docId);
    const snap = await docRef.get();
    const current: string[] = snap.data()?.[field] ?? [];
    const remapped = current.map((url) => {
      const entry = log[url];
      return entry?.status === "done" ? entry.newUrl : url;
    });
    if (JSON.stringify(remapped) !== JSON.stringify(current)) {
      if (!DRY_RUN) await docRef.update({ [field]: remapped });
      console.log(`  ${DRY_RUN ? "[dry-run] would update" : "updated"} ${collection}/${docId}.${field}`);
    }
  }
}

async function main() {
  console.log(`🖼  Image backfill${DRY_RUN ? " (DRY RUN — no writes)" : ""}\n`);

  const log = loadLog();
  const urlToRefs = await collectReferences();
  const uniqueUrls = [...urlToRefs.keys()];
  const totalRefs = [...urlToRefs.values()].reduce((n, refs) => n + refs.length, 0);

  console.log(
    `Found ${uniqueUrls.length} unique Storage image(s) across ${totalRefs} reference(s) in items, categories, research, featured, and stories.\n`
  );

  let processed = 0;
  let alreadyWebp = 0;
  let failed = 0;

  for (const url of uniqueUrls) {
    if (processed >= LIMIT) {
      console.log(`\n--limit=${LIMIT} reached, stopping (re-run to continue with the rest).`);
      break;
    }
    if (url.endsWith(".webp")) {
      alreadyWebp++;
      continue;
    }

    const alreadyDone = log[url]?.status === "done";
    const result = await processUrl(url, log);
    // Dry runs must be fully side-effect-free: `log` is still mutated in-memory
    // above (so this run's own Firestore-preview step below reports correctly),
    // but a dry run must never persist a fake "done" entry to disk — a real run
    // later would trust that and skip the actual upload while still repointing
    // Firestore at a file that was never written.
    if (!DRY_RUN) saveLog(log); // persist after every image — a crash mid-run loses at most one image's progress

    if (result) {
      console.log(`✓ ${url}\n  -> ${result}`);
    } else if (log[url]?.status === "failed") {
      console.log(`✗ FAILED: ${url}\n  ${log[url].error}`);
      failed++;
    }
    if (!alreadyDone) processed++;
  }

  console.log(`\nProcessed ${processed} this run, ${alreadyWebp} already WebP, ${failed} failed.\n`);

  console.log("Repointing Firestore references to the new images...\n");
  await applyFirestoreUpdates(urlToRefs, log);

  console.log(`\n✅ Done${DRY_RUN ? " (dry run — nothing was actually written)" : ""}.`);
  if (!DRY_RUN) {
    console.log("Original images were left in Storage untouched — nothing was deleted.");
    console.log("Spot-check the live site, then clean up the old originals separately when ready.");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
