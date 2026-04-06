# Project Details — Traam and Beyond

A complete reference document for understanding this project from scratch in a new conversation.

---

## 1. What This Project Is

**Traam and Beyond** is a showcase website for a curated collection of Kashmiri handcrafted items. It is **not an e-commerce platform** — there is no cart, no checkout, no payments. Users browse items and submit enquiries. The owner manages inventory and content through a private admin panel.

- **Live purpose:** Browse Kashmiri crafts → submit an enquiry → owner responds manually
- **Word origin:** "Traam" (ترام) means copper in Kashmiri — the first and oldest craft in the collection

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.5.14, App Router, TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (selective components) |
| Fonts | Cormorant (serif, headings) + Raleway (sans, body) via `next/font/google`; Helvetica loaded locally |
| Animations | framer-motion v12 |
| Database | Firebase Firestore v12 (client SDK for reads, Admin SDK for writes) |
| Auth | Firebase Auth — Email/Password (admin only) |
| Storage | Firebase Storage (images, always 1:1 ratio) |
| Images | Next.js `<Image>` component, `aspect-square` enforced everywhere |
| Email | Resend (server-side only, via Route Handler) |
| Search | Firestore `array-contains-any` on `searchTokens` field |
| Forms | react-hook-form + zod + shadcn Form components |
| Icons | lucide-react |
| Notifications | sonner (toast) |

---

## 3. Environment Variables (`.env.local`)

```env
# Firebase client (public, safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-only, never expose)
FIREBASE_SERVICE_ACCOUNT_JSON=   # full JSON string of service account

# Email (server-only)
RESEND_API_KEY=
RESEND_FROM_EMAIL=               # e.g. noreply@yourdomain.com
OWNER_EMAIL=                     # where enquiry notifications are sent
```

**Dev mode:** If `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is not set, all Firebase calls fall back to mock data (`lib/mock-data.ts`). Email is skipped with a console log.

---

## 4. Design System

### Colour Tokens (`app/globals.css`)
| Token | Hex | Usage |
|-------|-----|-------|
| `walnut` | `#20180C` | Page background (near-black) |
| `walnut-light` | `#5F4B2B` | Cards, hover backgrounds |
| `cream` | `#F8E8D2` | Primary text, headings |
| `cream-dark` | `#2A1E0F` | Dividers, dark card backgrounds |
| `terracotta` | `#B57031` | Primary accent, CTA, active states |
| `terracotta-light` | `#CA9A56` | Hover state for terracotta |
| `terracotta-dark` | `#8F5620` | Active/pressed state |
| `saffron` | `#D4A017` | Secondary accent (hero tagline) |
| `stone` | `#A68F67` | Secondary text, descriptions |

### Font CSS Variables
- `--font-display` → Cormorant (serif) — used for all `h1/h2/h3` automatically via `@layer base`
- `--font-sans` → Raleway — default body font
- `--font-helvetica` → Local Helvetica — available but not the default

### Admin Override
`.light-theme` class sets `background: white; color: #111` and switches headings back to sans-serif. Applied to the admin shell so the dark theme doesn't bleed into the admin panel.

---

## 5. Data Models (`types/index.ts`)

### Category
```ts
{
  id: string          // slugified name, e.g. "copper"
  name: string        // display name, e.g. "Copper"
  slug: string        // URL segment, e.g. "copper"
  order: number       // sort order in nav and listings
  coverImage?: string // Firebase Storage URL (1:1 ratio)
  description?: string
  createdAt: string   // ISO string
}
```

### Item
```ts
{
  id: string
  title: string
  description: string
  price: number | null   // null = "Price on Request"
  notForSale: boolean    // true = "Not for Sale" (display only)
  dimensions: string | null
  categoryId: string     // matches category.id
  categorySlug: string   // matches category.slug
  categoryName: string   // matches category.name (denormalised)
  images: string[]       // Firebase Storage URLs, all 1:1 ratio
  searchTokens: string[] // auto-generated from title + description
  createdAt: string
}
```

### Enquiry
```ts
{
  id: string
  name: string
  email: string
  message: string
  itemId: string | null       // null for general enquiries
  itemTitle: string | null
  type: "general" | "item-specific"
  read: boolean
  createdAt: string
}
```

### HomeContent (`types/home-content.ts`)
Stored in Firestore at `site-content/home`. Merged with `DEFAULT_HOME_CONTENT` on read.
```ts
{
  hero: { tagline, headline, subtext, ctaLabel }
  intro: { title, body }
  collections: { title, subtitle }
  enquiry: { title, subtitle }
}
```

### AboutContent (`types/about-content.ts`)
Stored in Firestore at `site-content/about`. Merged with `DEFAULT_ABOUT_CONTENT` on read.
```ts
{
  intro: { heading, paragraph1, paragraph2, paragraph3 }
  crafts: {
    heading,
    copper: { name, desc }
    silver: { name, desc }
    jade: { name, desc }
    papierMache: { name, desc }
  }
  enquiry: { title, subtitle }
}
```

---

## 6. Firestore Collections

| Collection | Document ID | Notes |
|-----------|------------|-------|
| `categories` | slugified name (e.g. `copper`) | Ordered by `order` field |
| `items` | auto-generated | Queried by `categorySlug`, full-text via `searchTokens` |
| `enquiries` | auto-generated | Ordered by `createdAt` desc, has `read` boolean |
| `site-content` | `home` or `about` | Stores editable page content |

### Firebase Storage Paths
- Item images: `items/{itemId}/{filename}`
- Category cover: uploaded via admin, stored under categories path
- All images are made public on upload

---

## 7. Route Structure

### Public Routes (`app/(public)/`)
Shared layout: `Navbar` + `main` + `Footer` + `BottomTabBar`

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | Hero + Intro + CategoryHighlights + EnquiryForm |
| `/category/[slug]` | Category listing | Shows all items for a category via ItemGrid |
| `/category/[slug]/[itemId]` | Item detail | Gallery + details + inline EnquiryForm. `revalidate = 3600` |
| `/about` | About | Story + craft descriptions + EnquiryForm. `force-dynamic` |
| `/contact` | Contact | EnquiryForm + contact info |
| `/search` | Search | Query via `?q=` param, uses `searchItems()` |

### Admin Routes (`app/(admin)/`)
Protected by `AdminAuthContext`. Separate layout with `AdminSidebar`.

| Route | Purpose |
|-------|---------|
| `/login` | Firebase email/password login |
| `/admin` | Dashboard — stats (items, categories, unread enquiries) |
| `/admin/items` | List all items |
| `/admin/items/new` | Create item form |
| `/admin/items/[id]` | Edit item form |
| `/admin/categories` | List all categories |
| `/admin/categories/new` | Create category |
| `/admin/categories/[id]` | Edit category |
| `/admin/enquiries` | Inbox — mark read/unread |
| `/admin/home` | Edit home page content |
| `/admin/about` | Edit about page content |

### API Routes (`app/api/`)
All admin routes verify Bearer token via `verifyAdminRequest()`.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/enquiry` | POST | Public enquiry submission. Validates with Zod, saves to Firestore, sends Resend emails |
| `/api/admin/items` | GET/POST | List or create items |
| `/api/admin/items/[id]` | PUT/DELETE | Update or delete item |
| `/api/admin/categories` | GET/POST | List or create categories |
| `/api/admin/categories/[id]` | PUT/DELETE | Update or delete category |
| `/api/admin/enquiries/[id]` | PATCH | Mark enquiry read/unread |
| `/api/admin/upload` | POST | Upload file to Firebase Storage, return public URL |
| `/api/admin/home-content` | GET/PATCH | Read or update home page sections |
| `/api/admin/about-content` | GET/PATCH | Read or update about page sections |

---

## 8. Component Map

### Layout
| Component | Location | Purpose |
|-----------|----------|---------|
| `Navbar` | `components/layout/Navbar.tsx` | Fixed, auto-hides on scroll down, transparent→frosted on scroll. Desktop only (mobile uses BottomTabBar). Search icon. Categories dropdown. |
| `Footer` | `components/layout/Footer.tsx` | `bg-walnut-light`, `border-t`, links to About + Contact |
| `BottomTabBar` | `components/layout/BottomTabBar.tsx` | Mobile-only fixed bottom nav. 5 tabs: Home, Collections, Search, About, Contact. Collections opens a bottom Sheet. Auto-hides on scroll down. |
| `AdminSidebar` | `components/layout/AdminSidebar.tsx` | Dark walnut sidebar, 6 nav links, sign out button |

### Home Page
| Component | Location | Purpose |
|-----------|----------|---------|
| `HeroSection` | `components/home/HeroSection.tsx` | Full-screen dark hero with Cormorant headline. Staggered mount animations (framer-motion `animate`). |
| `CategoryHighlights` | `components/home/CategoryHighlights.tsx` | Desktop: alternating 35/65 image+text panels. Mobile: full-width `aspect-square` image + text below. Scale+fade scroll animation with 1s text stagger. Hover turns heading terracotta. |

### Items
| Component | Location | Purpose |
|-----------|----------|---------|
| `ItemGrid` | `components/items/ItemGrid.tsx` | Maps items → ItemCard, passes `index` for alternating layout |
| `ItemCard` | `components/items/ItemCard.tsx` | Matches CategoryHighlights exactly. Desktop: 35/65 alternating. Mobile: full-width. Scale+fade scroll animation. Hover terracotta heading. Enquire button opens EnquiryDialog. |
| `ItemImageGallery` | `components/items/ItemImageGallery.tsx` | Main image + thumbnail strip + lightbox Dialog. Click-to-zoom. Arrow navigation. |

### Forms
| Component | Location | Purpose |
|-----------|----------|---------|
| `EnquiryForm` | `components/forms/EnquiryForm.tsx` | react-hook-form + zod. Two modes: `general` and `item-specific`. POST to `/api/enquiry`. Shows success/error state. |
| `EnquiryDialog` | `components/forms/EnquiryDialog.tsx` | shadcn Dialog wrapping EnquiryForm. Used from ItemCard. Closes 2s after success. |
| `ItemForm` | `components/forms/ItemForm.tsx` | Admin: create/edit item. Includes ImageUploadField. |
| `CategoryForm` | `components/forms/CategoryForm.tsx` | Admin: create/edit category. |
| `ImageUploadField` | `components/forms/ImageUploadField.tsx` | File picker with progress, uploads to Firebase Storage via `/api/admin/upload`. |

### Utilities
| Component | Location | Purpose |
|-----------|----------|---------|
| `ScrollReveal` | `components/ScrollReveal.tsx` | Framer Motion wrapper. `scale 0.8→1, opacity 0→1, duration 1.2s`. Reverses on scroll up (`once: false`). Used on About page and section headings. |

---

## 9. Library / Utility Files

### `lib/utils.ts`
- `cn(...inputs)` — clsx + tailwind-merge
- `slugify(text)` — converts text to URL-safe slug
- `formatPrice(price, notForSale)` — returns "Not for Sale" / "Price on Request" / INR formatted string
- `tokenize(text)` — lowercases, splits by word, dedupes. Used to build `searchTokens`

### `lib/validations.ts` (Zod schemas)
- `enquirySchema` — name (min 2), email, message (min 10), type, optional itemId/itemTitle
- `itemSchema` — all Item fields, images array min 1
- `categorySchema` — name, slug, order, optional coverImage

### `lib/email.ts`
- `sendEnquiryNotification(data)` — sends two Resend emails: one to owner, one auto-reply to submitter. Skips gracefully if `RESEND_API_KEY` not set.

### `lib/admin-auth.ts`
- `verifyAdminRequest(req)` — extracts Bearer token from Authorization header, verifies with Firebase Admin Auth. Returns boolean.

### `lib/admin-api.ts` (client-side API helpers)
All functions get Firebase ID token from `auth.currentUser`, attach as Bearer header.
- Upload: `uploadFile(file, path)`
- Items: `apiCreateItem`, `apiUpdateItem`, `apiDeleteItem`
- Categories: `apiCreateCategory`, `apiUpdateCategory`, `apiDeleteCategory`
- Home content: `apiGetHomeContent`, `apiUpdateHomeSection`
- About content: `apiGetAboutContent`, `apiUpdateAboutSection`
- Enquiries: `apiMarkEnquiryRead`

### `lib/firebase/client.ts`
Singleton exports: `db` (Firestore), `auth`, `storage` — uses `getApps()` guard to prevent re-init.

### `lib/firebase/admin.ts`
Singleton exports: `adminDb`, `adminAuth`, `adminStorage` — parses `FIREBASE_SERVICE_ACCOUNT_JSON` env var.

### `lib/firebase/categories.ts` (public reads)
- `getAllCategories()` — ordered by `order` asc
- `getCategoryBySlug(slug)`
- `getCategoryById(id)`
- Falls back to `MOCK_CATEGORIES` if Firebase not configured

### `lib/firebase/items.ts` (public reads)
- `getItemsByCategory(categorySlug)` — ordered by `createdAt` desc
- `getItemById(id)`
- `getAllItems()`
- `searchItems(queryText)` — tokenises query, `array-contains-any`, sorts by match count
- `getPaginatedItems(pageSize, cursor?)` — cursor-based pagination (not yet used in UI)
- Falls back to mock data if Firebase not configured

### `lib/firebase/enquiries.ts` (Admin SDK writes + reads)
- `createEnquiry(data)` — writes to `enquiries` collection
- `getAllEnquiries()` — ordered by `createdAt` desc
- `markEnquiryRead(id, read)`
- `getUnreadEnquiryCount()` — uses Firestore `count()` aggregate

### `lib/firebase/admin-items.ts`
- `adminCreateItem(data)` — auto-generates `searchTokens`, writes to Firestore
- `adminUpdateItem(id, data)` — rebuilds `searchTokens` if title or description changed
- `adminDeleteItem(id)` — deletes Firestore doc + all `items/{id}/` storage files
- `adminGetAllItems()`

### `lib/firebase/admin-categories.ts`
- `adminCreateCategory(data)` — uses `slugify(name)` as document ID
- `adminUpdateCategory(id, data)`
- `adminDeleteCategory(id)` — deletes Firestore doc + all `categories/{id}/` storage files
- `adminGetAllCategories()`

### `lib/firebase/storage.ts` (client-side, for legacy/direct upload)
- `uploadItemImage(itemId, file, onProgress?)` — uploads to `items/{itemId}/{filename}`, returns download URL
- `deleteItemImage(url)`
- Note: admin image uploads now go through `/api/admin/upload` instead

### `lib/firebase/site-content.ts`
- `getHomeContent()` — reads from Admin SDK, merges with `DEFAULT_HOME_CONTENT`

### `lib/firebase/about-content.ts`
- `getAboutContent()` — reads from Admin SDK, merges with `DEFAULT_ABOUT_CONTENT`

### `lib/mock-data.ts`
Full set of mock categories and items used when Firebase is not configured:
- 6 categories: Copper, Silver, Jade, Papier-mâché, Terracotta Jewellery, Coins
- 14 items spread across categories
- Uses `picsum.photos` for placeholder images

---

## 10. Context

### `context/AdminAuthContext.tsx`
- `AdminAuthProvider` — wraps admin shell, listens to `onAuthStateChanged`
- Provides: `user: User | null`, `loading: boolean`, `login(email, password)`, `logout()`
- `useAdminAuth()` hook — throws if used outside provider

---

## 11. Admin Auth Flow

1. User visits any `/admin/*` route
2. `AdminLayout` → `AdminShell` checks `user` and `loading` from `AdminAuthContext`
3. If not authenticated and not on `/login`, redirects to `/login`
4. Login page calls `signInWithEmailAndPassword` via `useAdminAuth().login()`
5. After successful login, redirects to `/admin`
6. All API calls from admin panel attach Firebase ID token as `Authorization: Bearer {token}`
7. Server-side `verifyAdminRequest()` validates the token via Firebase Admin Auth

---

## 12. Scroll Animations (Framer Motion)

### `ScrollReveal` component (for misc sections)
```ts
initial: { opacity: 0, scale: 0.8 }
whileInView: { opacity: 1, scale: 1 }
viewport: { once: false, margin: "-60px" }
transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
```

### `CategoryHighlights` + `ItemCard` (staggered image → text)
```ts
// Card container
cardVariants: { visible: { transition: { staggerChildren: 1.0 } } }

// Each child (image first, text 1s later)
childVariants: {
  hidden: { opacity: 0, scale: 0.8 }
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22,1,0.36,1] } }
}
viewport: { once: false, margin: "-60px" }
```

`once: false` means animations reverse when scrolling back up.

### `HeroSection` (mount animations, above the fold)
Uses `initial`/`animate` (not `whileInView`) since it's above the fold. 4 elements staggered at 0s, 0.1s, 0.25s, 0.4s.

---

## 13. Key Conventions

- **All images are 1:1 ratio** — uploaded square, displayed square (`aspect-square`). Never deviate from this.
- **No client-side Firestore writes** — public writes (enquiries) go through `/api/enquiry` Route Handler. Admin writes go through `/api/admin/*` with auth.
- **`force-dynamic`** on pages that read from Firestore directly (About, Home) to prevent stale SSG.
- **Category slug = category Firestore document ID** — created via `slugify(name)`.
- **searchTokens** are auto-built from `tokenize(title + description)` on item create/update.
- **`formatPrice`** logic: `notForSale=true` → "Not for Sale"; `price=null` → "Price on Request"; otherwise INR formatted.

---

## 14. `next.config.ts`

Allows Next.js `<Image>` from:
- `firebasestorage.googleapis.com` (Firebase Storage)
- `storage.googleapis.com` (public Firebase Storage URLs)
- `picsum.photos` (dev placeholder images)

---

## 15. `components.json` (shadcn/ui)

shadcn components installed: `badge`, `button`, `dialog`, `form`, `input`, `label`, `sheet`, `skeleton`, `sonner`, `tabs`, `textarea`.

Style: `default`, baseColor: `neutral`, CSS variables: yes, Tailwind v4.

---

## 16. Development Phases

| Phase | Status | Scope |
|-------|--------|-------|
| Phase 1 | ✅ Done | Core UI, category pages, enquiry system |
| Phase 2 | ✅ Done | Admin panel (CRUD items/categories, enquiry inbox), search, content editing |
| Phase 3 | Pending | SEO polish, ISR, sitemap, performance |

---

## 17. Running the Project

```bash
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run seed         # seed Firestore with mock data (requires .env.local)

# Mobile testing on local network:
npm run dev -- -H 0.0.0.0
# Then open http://{YOUR_LOCAL_IP}:3000 on mobile
```

---

## 18. Tooling in This Project

- **Ruflo MCP** — registered as Claude Code MCP server (`claude mcp list` to verify). Provides 98 agents, 30 skills, 215+ tools.
- **ui-ux-pro-max skill** — installed at `.claude/skills/ui-ux-pro-max/`. Activate with `/ui-ux-pro-max` in Claude Code. Provides design intelligence with 67 UI styles, 161 palettes, 57 font pairings.
- **framer-motion** — v12, used for all scroll and mount animations.
