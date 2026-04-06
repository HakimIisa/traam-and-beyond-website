# Traam and Beyond — First Build Summary

**Project Type:** Full-stack Next.js web application
**Build Phase:** Phase 1 (Public site) + Phase 2 (Admin panel) — Complete
**Last Updated:** April 2026
**Developer:** Built with Claude Code (claude-sonnet-4-6)

---

## What This Project Is

Traam and Beyond is a website built to showcase and promote a curated collection of authentic Kashmiri handcrafted items. It is not an e-commerce platform — there is no shopping cart, no checkout, and no payment system. Instead, visitors browse the collection, discover items they like, and submit an enquiry to express interest. The business then follows up directly.

The site covers six categories of Kashmiri craft:
- **Copper** — hand-hammered copper vessels, trays, bowls, and decorative items
- **Silver** — jewellery and silverwork
- **Jade** — carved jade pieces
- **Papier-mâché** — painted papier-mâché boxes, bowls, and ornaments
- **Terracotta Jewellery** — handcrafted terracotta jewellery
- **Coins** — antique and historical coins

The website has two main sections:
1. **Public site** — what visitors and the client's customers see
2. **Admin panel** — a private, password-protected panel where the business owner manages everything

---

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 15.5.14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 with custom theme |
| UI Components | shadcn/ui (selective — Button, Dialog, Form, Badge, Input, Textarea, Sheet, Tabs, Skeleton, Sonner) |
| Font | Helvetica (local files via `next/font/local`) |
| Database | Firebase Firestore |
| Authentication | Firebase Auth (Email/Password) |
| File Storage | Firebase Storage |
| Admin Writes | Firebase Admin SDK (server-side only, via API Route Handlers) |
| Email | Resend (optional — site works without it) |
| Search | Firestore `array-contains-any` on tokenized search field |
| Forms | react-hook-form + Zod |
| Icons | lucide-react |
| Hosting | Vercel (free tier, auto-deploys from GitHub) |

---

## Brand Design

The site uses a custom Kashmiri-inspired colour palette:

| Name | Hex | Usage |
|------|-----|-------|
| Terracotta | `#C25B3F` | Primary accent, buttons, links, active states |
| Terracotta Light | `#D4735A` | Hover state for terracotta |
| Terracotta Dark | `#A0432A` | Pressed / darker variant |
| Walnut | `#3D2B1F` | Primary text, headings, dark backgrounds |
| Walnut Light | `#5C4033` | Secondary dark background |
| Saffron | `#D4A017` | Accent highlights (hero tagline) |
| Cream | `#FAF6F0` | Page background |
| Cream Dark | `#F0E8DC` | Card backgrounds, dividers |
| Stone | `#8B7355` | Muted/secondary text |
| Stone Light | `#A8916E` | Lighter muted text |

Font: Helvetica (local, 5 weights: Light 300, Regular 400, Regular Italic 400, Bold 700, Bold Italic 700)

Design philosophy: minimal, earth-toned, no clutter. Mobile-first and fully responsive.

---

## Project File Structure

```
traam-and-beyond/
├── app/
│   ├── (public)/                  # Public-facing pages (shared Navbar + Footer)
│   │   ├── layout.tsx             # Public layout — loads Navbar/Footer
│   │   ├── page.tsx               # Home page
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Category listing page
│   │   │       └── [itemId]/
│   │   │           └── page.tsx   # Item detail page
│   │   ├── search/page.tsx        # Search results page
│   │   ├── contact/page.tsx       # Contact page
│   │   └── about/page.tsx         # About page
│   ├── (admin)/                   # Admin panel (auth-gated, separate layout)
│   │   ├── layout.tsx             # Admin layout — wraps with auth context
│   │   ├── login/page.tsx         # Admin login page
│   │   └── admin/
│   │       ├── page.tsx           # Dashboard
│   │       ├── home/page.tsx      # Home page content editor
│   │       ├── about/
│   │       │   ├── page.tsx       # About page content editor (server wrapper)
│   │       │   └── AboutContentClient.tsx  # About editor client component
│   │       ├── items/
│   │       │   ├── page.tsx       # Items list
│   │       │   ├── new/page.tsx   # Add new item
│   │       │   └── [id]/page.tsx  # Edit item
│   │       ├── categories/
│   │       │   ├── page.tsx       # Categories list
│   │       │   ├── new/page.tsx   # Add new category
│   │       │   └── [id]/page.tsx  # Edit category
│   │       └── enquiries/
│   │           └── page.tsx       # Enquiry inbox
│   ├── api/
│   │   ├── enquiry/route.ts       # POST — public enquiry submission
│   │   └── admin/
│   │       ├── upload/route.ts    # POST — image upload to Firebase Storage
│   │       ├── items/
│   │       │   ├── route.ts       # GET + POST items
│   │       │   └── [id]/route.ts  # PUT + DELETE item
│   │       ├── categories/
│   │       │   ├── route.ts       # GET + POST categories
│   │       │   └── [id]/route.ts  # PUT + DELETE category
│   │       ├── enquiries/
│   │       │   └── [id]/route.ts  # PATCH enquiry read status
│   │       ├── home-content/
│   │       │   └── route.ts       # GET + PATCH home page content
│   │       └── about-content/
│   │           └── route.ts       # GET + PATCH about page content
│   ├── layout.tsx                 # Root layout — font, metadata
│   └── globals.css                # Tailwind theme, colours, base styles
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Site navigation bar
│   │   ├── Footer.tsx             # Site footer
│   │   └── AdminSidebar.tsx       # Admin panel sidebar
│   ├── home/
│   │   ├── HeroSection.tsx        # Full-screen hero banner
│   │   └── CategoryHighlights.tsx # Vertical category list on home page
│   ├── items/
│   │   ├── ItemCard.tsx           # Single item row (image + text)
│   │   ├── ItemGrid.tsx           # Vertical list of ItemCards
│   │   └── ItemImageGallery.tsx   # Image gallery with lightbox
│   └── forms/
│       ├── EnquiryForm.tsx        # Public enquiry submission form
│       ├── EnquiryDialog.tsx      # Modal wrapper for EnquiryForm
│       ├── ItemForm.tsx           # Admin item create/edit form
│       ├── CategoryForm.tsx       # Admin category create/edit form
│       └── ImageUploadField.tsx   # Reusable image upload field
├── context/
│   └── AdminAuthContext.tsx       # Firebase auth state + login/logout
├── lib/
│   ├── utils.ts                   # cn, slugify, formatPrice, tokenize
│   ├── validations.ts             # Zod schemas
│   ├── mock-data.ts               # Fallback data (dev without Firebase)
│   ├── email.ts                   # Resend email notification helper
│   ├── admin-auth.ts              # Bearer token verification helper
│   ├── admin-api.ts               # Client-side API wrapper functions
│   └── firebase/
│       ├── client.ts              # Firebase client SDK singleton
│       ├── admin.ts               # Firebase Admin SDK singleton
│       ├── categories.ts          # Public: getAllCategories, getCategoryBySlug
│       ├── items.ts               # Public: getItemsByCategory, getItemById, searchItems
│       ├── enquiries.ts           # createEnquiry, getAllEnquiries, markEnquiryRead
│       ├── site-content.ts        # Public: getHomeContent (uses Admin SDK)
│       ├── about-content.ts       # Public: getAboutContent (uses Admin SDK)
│       ├── admin-categories.ts    # Admin: create/update/delete categories
│       ├── admin-items.ts         # Admin: create/update/delete items
│       ├── admin-site-content.ts  # Admin: get/set/update home page sections
│       ├── admin-about-content.ts # Admin: get/update about page sections
│       └── storage.ts             # Client-side upload/delete helpers
├── types/
│   ├── index.ts                   # Category, Item, Enquiry interfaces
│   ├── home-content.ts            # HomeContent interface + defaults
│   └── about-content.ts           # AboutContent interface + defaults
├── scripts/
│   └── seed.ts                    # One-time Firestore seeder script
├── fonts/
│   └── helvetica-255/             # Local Helvetica font files (5 variants)
├── docs/                          # Project documentation
├── next.config.ts                 # Image remote patterns
├── tailwind.config.ts             # (Tailwind v4 — config in globals.css)
├── package.json
└── .env.local                     # Secret keys (not in git)
```

---

## Data Models

### Category
```typescript
{
  id: string
  name: string           // e.g. "Copper"
  slug: string           // e.g. "copper"
  order: number          // display order on home page
  coverImage?: string    // Firebase Storage URL
  description?: string   // paragraph shown on home page
  createdAt: string      // ISO date string
}
```

### Item
```typescript
{
  id: string
  title: string
  description: string
  price: number | null   // null if notForSale is true
  notForSale: boolean
  dimensions: string | null
  categoryId: string
  categorySlug: string
  categoryName: string
  images: string[]       // array of Firebase Storage URLs
  searchTokens: string[] // auto-generated from title + description
  createdAt: string
}
```

### Enquiry
```typescript
{
  id: string
  name: string
  email: string
  message: string
  itemId: string | null
  itemTitle: string | null
  type: "general" | "item-specific"
  read: boolean
  createdAt: string
}
```

### HomeContent (site_content/home in Firestore)
```typescript
{
  hero: { tagline, headline, subtext, ctaLabel }
  intro: { title, body }
  collections: { title, subtitle }
  enquiry: { title, subtitle }
}
```

### AboutContent (site_content/about in Firestore)
```typescript
{
  intro: { heading, paragraph1, paragraph2, paragraph3 }
  crafts: {
    heading,
    copper:      { name, desc }
    silver:      { name, desc }
    jade:        { name, desc }
    papierMache: { name, desc }
  }
  enquiry: { title, subtitle }
}
```

---

## Public Site — Pages and Features

### Home Page (`/`)

The home page is made of four sections, all editable from the admin panel:

1. **Hero Banner** — Full-screen dark (walnut) section with a dot pattern overlay. Shows the site tagline, headline ("Traam and Beyond"), a subtext paragraph, and a "Explore Collection" button that smoothly scrolls down to the collections section.

2. **Intro Section** — A centred text block with a title and body paragraph introducing the brand's story.

3. **Category Highlights** — A vertical list of all categories. Each row shows the category cover image (left, rounded) and the category name and description (right). Hovering highlights the row and changes the name to terracotta. Clicking the row navigates to that category page.

4. **Enquiry Section** — A general contact form at the bottom for visitors who want to reach out without a specific item in mind.

---

### Category Page (`/category/[slug]`)

Shows all items in a selected category in a vertical list. Each item is displayed as a horizontal row:
- **Image** on the left (224px wide, rounded corners)
- **Title** (large, links to the item detail page)
- **Description** (3-line clamp)
- **Price badge** and **"Enquire →"** button on the bottom

Items are fetched server-side. Page is statically generated for all known categories via `generateStaticParams()`.

---

### Item Detail Page (`/category/[slug]/[itemId]`)

Full detail view of a single item:
- **Breadcrumb** navigation (Home > Category > Item name)
- **Left column**: Image gallery with main image, thumbnail strip, and a full-screen lightbox viewer. Supports multiple images with left/right navigation arrows.
- **Right column**: Category badge, item title, price (or "Not for Sale" / "Price on Request"), full description, dimensions (if set), and a complete enquiry form pre-filled with the item reference.

Page uses ISR with a 1-hour revalidation window.

---

### Search Page (`/search?q=...`)

Accepts a search query via URL parameter. Searches items using Firestore's `array-contains-any` against the `searchTokens` field. Shows the number of results found and a vertical list of matching items. Falls back to mock data in development.

---

### Contact Page (`/contact`)

Two-column layout:
- Left: Enquiry form for general messages
- Right: Business contact details (email, location note)

---

### About Page (`/about`)

Prose content about the brand's story and heritage, with a grid section describing each craft type (Copper, Silver, Jade, Papier-mâché). A general enquiry form is embedded at the bottom.

---

### Navbar

Sticky top navigation with:
- **Logo / Brand name** (links to home)
- **Home link**
- **Collections dropdown** — a single "Collections" button that opens a dropdown listing all categories vertically in their display order. The button turns terracotta when on any category page. Clicking outside the dropdown closes it. Categories are fetched server-side and passed down; order is determined by the `order` field on each category.
- **About link** (links to `/about`)
- **Contact link**
- **Search icon** — expands an inline search input on click
- **Mobile menu** — a slide-out sheet (drawer) with the same links. Categories appear as flat links under a "Collections" label (indented), rather than a nested dropdown.

---

## Admin Panel — Pages and Features

The admin panel lives at `/admin` and all routes are protected. An unauthenticated user is automatically redirected to `/login`.

### Login (`/login`)

A simple email and password form. Uses Firebase Email/Password authentication. On success, redirects to the admin dashboard.

---

### Dashboard (`/admin`)

Shows four summary stat cards:
- Total Items
- Total Categories
- Unread Enquiries (highlighted if > 0)
- Total Enquiries

Quick action buttons link to: Add Item, Add Category, View Enquiries.

---

### Home Page Content Editor (`/admin/home`)

Allows the admin to edit all text on the public home page without touching code. Organised into four cards, each saved independently:

| Card | Fields |
|------|--------|
| Hero Banner | Tagline, Headline, Subtext, Button Label |
| Intro Section | Title, Body paragraph |
| Collections Section | Title, Subtitle |
| Enquiry Section | Title, Subtitle |

Changes are saved to the `site_content/home` Firestore document via the `/api/admin/home-content` route and are reflected on the public site immediately.

---

### About Page Content Editor (`/admin/about`)

Allows the admin to edit all text on the public about page without touching code. Organised into three cards, each saved independently:

| Card | Fields |
|------|--------|
| Our Story | Heading, Paragraph 1, Paragraph 2, Paragraph 3 |
| The Crafts | Section heading; Name + Description for each of: Copper, Silver, Jade, Papier-mâché |
| Enquiry Section | Title, Subtitle |

Changes are saved to the `site_content/about` Firestore document via the `/api/admin/about-content` route. The admin sidebar includes an "About Page" link (Info icon) to reach this editor.

---

### Items (`/admin/items`)

**List view** — Shows all items filterable by category via tabs ("All" tab + one tab per category with item count). Each item shows its thumbnail, title, category, and price. Edit and Delete buttons per row.

**Add Item (`/admin/items/new`)** — A form with:
- Image uploader (multiple images, at least 1 required)
- Title
- Description
- Category dropdown
- "Not for Sale" toggle
- Price input (hidden when Not for Sale is checked)
- Dimensions (optional)

**Edit Item (`/admin/items/[id]`)** — Same form pre-filled with existing data.

On save, the item is written to Firestore via the Admin SDK (server-side). Search tokens are automatically generated from the title and description.

On delete, the item document and all its associated Storage images are deleted.

---

### Categories (`/admin/categories`)

**List view** — Table showing Cover image thumbnail, Name, Slug, Display Order, Edit and Delete actions.

**Add Category (`/admin/categories/new`)** — A form with:
- Name (slug is auto-generated from name)
- Description (shown on the home page)
- Display Order
- Cover Image upload (single image)

**Edit Category (`/admin/categories/[id]`)** — Same form pre-filled.

On delete, the category document and its storage files are removed.

---

### Enquiries (`/admin/enquiries`)

Lists all enquiries received through the website, separated into two tabs:
- **General** — messages not tied to a specific item
- **Item-specific** — enquiries about a particular item (shows which item)

Each enquiry card shows:
- Sender name and email
- Message text
- Date and time received
- Read / Unread status with a toggle button (optimistic update — flips immediately in the UI without waiting for the server)

Unread counts shown in tab badges.

---

## API Routes

All admin API routes require a valid Firebase ID token in the `Authorization: Bearer <token>` header. The `verifyAdminRequest()` helper validates this on every admin route.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/enquiry` | POST | Public — receive and store a new enquiry, send email notifications |
| `/api/admin/upload` | POST | Upload an image file to Firebase Storage, return public URL |
| `/api/admin/items` | GET, POST | List all items / create new item |
| `/api/admin/items/[id]` | PUT, DELETE | Update / delete item (also deletes storage images) |
| `/api/admin/categories` | GET, POST | List all categories / create new category |
| `/api/admin/categories/[id]` | PUT, DELETE | Update / delete category |
| `/api/admin/enquiries/[id]` | PATCH | Mark enquiry as read or unread |
| `/api/admin/home-content` | GET, PATCH | Get / update home page content sections |
| `/api/admin/about-content` | GET, PATCH | Get / update about page content sections |

---

## Key Technical Decisions

### Firebase Admin SDK — Server Only
All database writes go through Next.js Route Handlers using the Firebase Admin SDK. This keeps the service account credentials on the server and prevents any admin operations from being triggered from the browser by non-admin users.

### Mock Data Fallback
Every public Firebase query checks `isFirebaseConfigured()` first. If the Firebase environment variables are not set, mock data is returned instead. This allowed the full UI to be built and tested before Firebase was connected.

### Search Tokenization
When an item is created or updated, the Admin SDK generates a `searchTokens` array from the title and description — splitting into individual words, lowercased, and deduped. Firestore's `array-contains-any` then enables basic keyword search without a third-party search service.

### Firestore Timestamp Serialisation
Next.js App Router does not allow Firestore `Timestamp` objects to be passed from Server Components to Client Components directly (they're not plain objects). A `serialize()` helper converts all Timestamps to ISO strings before passing data across the boundary.

### Image Upload Flow
1. Admin selects a file in `ImageUploadField`
2. The file is POST'd (multipart) to `/api/admin/upload` with the target storage path
3. The route saves it via Admin SDK, calls `makePublic()`, and returns the `https://storage.googleapis.com/...` URL
4. That URL is stored in Firestore as a string

### Home Page Content System
The home page text is stored in a single Firestore document: `site_content/home`. The public site fetches it server-side on each request and deep-merges it with hardcoded defaults, so any missing fields never break the page. The admin panel provides section-by-section editing — each section saves independently without overwriting the others.

### Composite Firestore Index
The items collection query (`where categorySlug == X` + `orderBy createdAt DESC`) requires a composite index in Firestore. This was created manually in the Firebase Console.

---

## Environment Variables

Stored in `.env.local` (never committed to git):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=       # Full service account JSON, minified to one line
RESEND_API_KEY=                       # Optional — email notifications
RESEND_FROM_EMAIL=                    # Optional — sender address
OWNER_EMAIL=                          # Admin notification recipient
```

All `NEXT_PUBLIC_*` vars are safe to expose in the browser. `FIREBASE_SERVICE_ACCOUNT_JSON`, `RESEND_API_KEY`, and `OWNER_EMAIL` are server-only and never sent to the client.

---

## Deployment

- **Repository:** GitHub (`HakimIisa/traam-and-beyond-website`)
- **Hosting:** Vercel (free tier)
- **Deploy trigger:** Every push to `main` automatically triggers a new Vercel deployment
- **Domain:** `traam-and-beyond-website.vercel.app` (Vercel-provided, free)

---

## Bugs Fixed During Build

| Bug | Cause | Fix |
|-----|-------|-----|
| Next.js 16.2.2 type errors | Broken types in `dist/client/components/navigation` | Downgraded to Next.js 15.5.14 |
| `class-variance-authority` missing | Not installed by default | `npm install class-variance-authority` |
| Firestore Timestamp crash | Plain objects only allowed in Client Components | Added `serialize()` helper to convert Timestamps to ISO strings |
| Enquiry form "Something went wrong" | Resend crashed when `RESEND_API_KEY` was missing | Added early return guard if key not set |
| Two dev servers conflict | Opened second terminal, got port 3002 vs 3000 | Closed all terminals, restarted once |
| Firestore composite index error | `where + orderBy` requires a Firestore index | Created index in Firebase Console |
| `z.coerce.number()` TypeScript conflict | react-hook-form resolver type mismatch | Switched to `z.string()` for order field, parsed with `parseInt()` on submit |
| Service account JSON format error | Multi-line JSON pasted below env vars | Minified JSON to single line in `.env.local` |
| shadcn init failed | Tailwind v4 not auto-detected by shadcn CLI | Manually created `components.json` |
| Images not loading (next/image error) | `storage.googleapis.com` not whitelisted in `next.config.ts` | Added `storage.googleapis.com` to `remotePatterns` |
| Admin edits not reflecting on public site | `getHomeContent` / `getAboutContent` used the Firebase Client SDK, which is gated by Firestore Security Rules — unauthenticated reads failed silently and the `catch {}` block returned hardcoded defaults | Switched both functions to use the Admin SDK (`adminGetHomeContent`, `adminGetAboutContent`), which bypasses security rules. Also added `export const dynamic = "force-dynamic"` to both public pages to prevent Next.js static caching. |

---

## What Is Not Built Yet (Phase 3)

- SEO polish (structured data / JSON-LD per item)
- XML sitemap (`/sitemap.xml`)
- Open Graph images per category / item
- Full ISR (Incremental Static Regeneration) strategy
- Performance audits (Lighthouse)
- Resend email fully configured and tested end-to-end
- Custom domain (currently on Vercel subdomain)
