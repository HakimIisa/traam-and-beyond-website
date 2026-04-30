# Traam and Beyond — Kashmiri Handcrafted Items

A modern, visually rich showcase website for a curated collection of authentic Kashmiri handcrafted items. Browse copperware, papier-mâché, silverware, carpets, jewellery, and more — each piece carrying centuries of craft history. Not an e-commerce platform: this is a space for discovery, enquiry, and cultural memory.

**Stack:** Next.js 16 · Firebase Firestore · Firebase Storage · Tailwind CSS v4 · TypeScript · Vercel · Resend

---

## Table of Contents

1. [Demo Video](#1-demo-video)
2. [Home Page — Hero Section](#2-home-page--hero-section)
3. [Home Page — Our Story](#3-home-page--our-story)
4. [Home Page — Our Collections](#4-home-page--our-collections)
5. [About Page — Our Story Timeline](#5-about-page--our-story-timeline)
6. [About Page — Craft Heritage of Kashmir](#6-about-page--craft-heritage-of-kashmir)
7. [Category Catalogue](#7-category-catalogue)
8. [Item Detail Page](#8-item-detail-page)
9. [Contact & Enquiry](#9-contact--enquiry)
10. [Admin Panel](#10-admin-panel)
11. [Tech Stack](#11-tech-stack)
12. [Project Structure](#12-project-structure)
13. [License](#13-license)
14. [Author](#14-author)

---

## 1. Demo Video

<video src="https://github.com/user-attachments/assets/f8299bab-1646-4b75-8832-a3d9e1dbbf36" controls width="100%"></video>

---

## 2. Home Page — Hero Section

A full-screen scroll-animated hero featuring a Kashmiri copper vessel. On mobile, the bowl rises and fades as a logo silhouette grows over it — creating a bowl-to-logo transformation as you scroll. On desktop, the bowl drifts diagonally from center to its corner position while the text scales up. Both animations are driven by Framer Motion's `useScroll` + `useTransform`.

![](<Screenshots for github/HomePageHeroSection.jpeg>)

---

## 3. Home Page — Our Story

A fixed-background panel with two craft images pinned to the top and bottom of the viewport, and a short text piece in between — giving the section a visual presence even before the user scrolls into it. The panel uses CSS `position: fixed` with a z-index layer beneath all scrolling content.

![](<Screenshots for github/HomePageOurStorySection.jpeg>)

---

## 4. Home Page — Our Collections

The collections section introduces each craft category with a full-bleed image and description. On desktop, categories alternate in a 35/65 image-text split. On mobile, each category stacks vertically as a full-width card. Images fade in with a staggered Framer Motion animation as each card enters the viewport.

![](<Screenshots for github/HomePageOurCollectionIntro.jpeg>)

![](<Screenshots for github/HomePageOurCollectionList.jpeg>)

---

## 5. About Page — Our Story Timeline

A scroll-driven timeline of personal stories behind the collection — from a 300-rupee copper bowl in 2004 to pieces brought back from Europe. Each story has its own full-screen sticky background image that cross-fades as you scroll. A floating right-side indicator tracks which era you are reading. The image swap is bidirectional: it works identically scrolling up and down.

![](<Screenshots for github/AboutPageOurStory1.jpeg>)

![](<Screenshots for github/AboutPageOurStory2.jpeg>)

---

## 6. About Page — Craft Heritage of Kashmir

An illustrated academic history of Kashmiri arts and crafts — from prehistoric Burzahom settlements (3000 BCE) through to the modern revival. Eleven illustrated panels span the full history, each with its own sticky background image. A separate timeline indicator replaces the Our Story indicator as you scroll into this section, showing the period label for each chapter (3000–1500 BCE → 2nd BCE → 1–5 CE → … → 20th c.). A references panel closes the section.

![](<Screenshots for github/AboutPageCraftHeritageOfKashmir1.jpeg>)

![](<Screenshots for github/AboutPageCraftHeritageOfKashmir2.jpeg>)

---

## 7. Category Catalogue

Each craft category has its own page listing all items in a responsive grid (2 columns mobile → 4 columns desktop). Items display their cover image with a hover-reveal **Enquire** button on desktop and an always-visible button on mobile. Items can carry a price or be marked "Not for Sale".

![](<Screenshots for github/CopperwareCatalogue.jpeg>)

---

## 8. Item Detail Page

A full detail view for each item: cover image, title, description, price or "Not for Sale" badge, dimensions, and an inline enquiry form. Breadcrumb navigation links back to the category. All text is legible on the dark background with a carefully chosen color hierarchy (cream titles, warm body text, terracotta accents).

![](<Screenshots for github/RoseWaterSprinklerProductPage.jpeg>)

---

## 9. Contact & Enquiry

A general enquiry form available site-wide and on the Contact page. Item-specific enquiries open in a dialog from the item detail page. All submissions are stored in Firestore and trigger an email notification to the owner via Resend. The form handles both general and item-specific enquiry types.

![](<Screenshots for github/ContactUsPage.jpeg>)

---

## 10. Admin Panel

A password-protected admin dashboard for managing the entire site's content:

- **Categories** — create, edit, reorder, and delete craft categories with cover images
- **Items** — add and manage items within each category; upload images to Firebase Storage
- **Enquiries** — view all incoming enquiries with item context and contact details
- **Site Content** — edit home page hero text, collections subtitle, and about page content directly from the dashboard

![](<Screenshots for github/AdminPannel.jpeg>)

---

## 11. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, TypeScript |
| Animation | Framer Motion |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Authentication | Firebase Auth (Email/Password) |
| Admin Writes | Firebase Admin SDK via Route Handlers |
| Email | Resend (server-side, via Route Handler) |
| Hosting | Vercel |
| Fonts | Jost (body), display font (headings) via `next/font/google` |

---

## 12. Project Structure

```
traam-and-beyond/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  ← Home page
│   │   ├── about/page.tsx            ← About page
│   │   ├── contact/page.tsx          ← Contact page
│   │   ├── category/[slug]/          ← Category listing
│   │   │   └── [itemId]/page.tsx     ← Item detail
│   │   └── research/                 ← Research section
│   ├── (admin)/                      ← Auth-gated admin panel
│   └── api/enquiry/                  ← Enquiry POST handler
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx           ← Scroll-animated hero
│   │   ├── OurStorySection.tsx       ← Fixed background panel
│   │   └── CategoryHighlights.tsx    ← Collections grid
│   ├── about/
│   │   ├── OurStoryTimeline.tsx      ← Scroll timeline — personal stories
│   │   ├── CraftHeritageTimeline.tsx ← Scroll timeline — history
│   │   └── AboutPageClient.tsx       ← Visibility coordinator
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── forms/
│       ├── EnquiryForm.tsx
│       └── EnquiryDialog.tsx
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── admin.ts
│   │   ├── categories.ts
│   │   ├── items.ts
│   │   └── enquiries.ts
│   ├── email.ts
│   ├── validations.ts
│   └── utils.ts
├── public/
│   ├── hero-vessel.png
│   ├── LOGO.png
│   ├── OurStoryUpper1.png
│   ├── OurStoryLower1.png
│   ├── IsbandHomePage.png
│   ├── aboutImages/
│   └── crafts-heritage/
└── docs/
    └── summary-*.md                  ← Build session notes
```

---

## 13. License

© 2026 Traam and Beyond. All rights reserved.

This project and all its contents — including code, images, text, and design — are the intellectual property of the author. No part of this repository may be copied, modified, distributed, sublicensed, or used in any form without the express written permission of the author.

---

## 14. Author

**Hakim Mohammad Iisa**
Architect & Developer

Traam and Beyond is a personal project born from a lifelong connection to Kashmiri arts and crafts. Designed, researched, and built from the ground up — covering the full-stack web application, scroll-driven animations, academic craft history research, and a curated collection of handcrafted masterpieces.

> Preserving the legacy of Kashmiri craftsmanship · Milan, Italy · 2026
