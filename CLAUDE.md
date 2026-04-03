# Traam and Beyond — Claude Project Context

## Project Overview

A modern, minimal, visually rich website to showcase a curated collection of **Kashmiri handcrafted items**. This is **not** an e-commerce platform — no payments or checkout. Users browse, discover, and submit enquiries.

## Tech Stack

- **Frontend**: Next.js 16, App Router, TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui (selective components)
- **Font**: Jost (Google Fonts via `next/font/google`)
- **Backend**: Firebase v11 — Firestore, Auth (Email/Password), Storage
- **Admin writes**: Firebase Admin SDK via Route Handlers (never client-side)
- **Images**: Firebase Storage, always 1:1 ratio, served via Next.js `<Image>`
- **Email**: Resend (server-side only, via Route Handler)
- **Search**: Firestore `array-contains-any` on `searchTokens` field

## Data Models (`types/index.ts`)

**Item**: `id, title, description, price, notForSale (bool), dimensions, categoryId, categorySlug, categoryName, images[], searchTokens[], createdAt`

**Category**: `id, name, slug, order, coverImage?, createdAt`

**Enquiry**: `id, name, email, message, itemId (nullable), itemTitle (nullable), type (general | item-specific), createdAt`

## Site Structure

- **Navbar**: Logo left, dynamic category links right (server-fetched), search icon, Contact link
- **`app/(public)/`** — public route group, shared Navbar + Footer layout
- **`app/(admin)/`** — admin route group, separate auth-gated layout (Phase 2)
- **`app/api/enquiry/`** — only write path for public users

## Key Files

- `lib/firebase/client.ts` — client SDK singleton
- `lib/firebase/admin.ts` — Admin SDK singleton (server-only)
- `lib/firebase/categories.ts` — getAllCategories, getCategoryBySlug
- `lib/firebase/items.ts` — getItemsByCategory, getItemById, searchItems
- `lib/firebase/enquiries.ts` — createEnquiry (uses Admin SDK)
- `lib/email.ts` — sendEnquiryNotification (Resend)
- `lib/validations.ts` — Zod schemas
- `lib/utils.ts` — cn, slugify, formatPrice, tokenize
- `components/items/ItemCard.tsx` — hover-reveal Enquire (desktop), always-visible (mobile)
- `components/forms/EnquiryForm.tsx` — shared for general + item-specific
- `components/forms/EnquiryDialog.tsx` — Dialog wrapper for item enquiries

## Design

- Brand palette: terracotta `#C25B3F`, walnut `#3D2B1F`, saffron `#D4A017`, cream `#FAF6F0`
- Mobile-first, responsive grid (2 col mobile → 4 col desktop)
- Kashmiri aesthetic: earth tones, minimal, no clutter

## Development Phases

1. **Phase 1** ✅ — Core UI, category pages, enquiry system
2. **Phase 2** — Admin panel (CRUD items/categories, enquiry inbox), search
3. **Phase 3** — SEO polish, ISR, sitemap, performance

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
OWNER_EMAIL=
```
