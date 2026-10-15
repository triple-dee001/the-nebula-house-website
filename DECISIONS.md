# Architectural & Design Decisions Log: The Chapter Room

This file records all significant design, architectural, and operational decisions made during the implementation of The Chapter Room within The Nebula House, detailing chosen paths, alternatives considered, and rationale.

---

## Decision 1: Single Reconciled Design Token Architecture
- **Decision:** Align all Chapter Room CSS custom properties strictly to The Nebula House's production design tokens and site values (`#000000`, `#0D0D0D`, `#1A1A1A`, `#F0EBE0`, `#FFFFFF`, Cormorant Garamond, and Inter).
- **Alternatives Considered:**
  1. A standalone design system with separate ochre accents (`#C4975A`) and additional fonts (`Newsreader`, `Plus Jakarta Sans`).
  2. Complete rewrite of the site's base `styles.css`.
- **Reasoning:** The Chapter Room is an integral room inside The Nebula House, not a distinct product or standalone SaaS app. Reusing the site's exact palette guarantees brand fidelity and prevents visual fragmentation.

---

## Decision 2: Theme Model — Dark Default with Opt-in Cream Reading Mode
- **Decision:** Chapter Room defaults to the site's dark palette (`#000000` / `#0D0D0D` / `#1A1A1A`). An opt-in cream reading mode (`#f0ebe0` with `#1a1a1a` ink, matching `past-reads/`) is provided for reading comfort and persisted per user in `localStorage`.
- **Alternatives Considered:**
  1. Cream as the default page theme.
  2. System-preference OS auto-switch only.
- **Reasoning:** The Nebula House opens in deep cosmic black. Preserving dark mode as default provides a consistent landing experience from the parent site, while offering cream as an opt-in reading theme fulfills the literary paper reading preference without disrupting site continuity.

---

## Decision 3: Five-Item Mobile Navigation Bottom Tab Bar
- **Decision:** Implement a 5-item mobile tab bar: **Home**, **Explore**, **This Month (Book of the Month)**, **My Reading**, **Community**.
- **Alternatives Considered:**
  1. 4-item bar omitting Book of the Month.
  2. Mobile drawer hamburger only without bottom tab bar.
- **Reasoning:** Book of the Month is the primary reading pulse answering "What are we reading right now?". Surfacing it in the thumb zone on mobile alongside discovery and personal shelf drives the core loop: Discover → Read → Discuss.

---

## Decision 4: Typographic Cover Fallbacks
- **Decision:** Provide an automatic CSS-rendered typographic cover adhering to the 2:3 ratio for any book without a photographic asset.
- **Alternatives Considered:**
  1. Generic grey placeholder image or blank box.
  2. External dynamic image placeholder service (e.g., placehold.co).
- **Reasoning:** Avoids external network dependencies and visual layout shifts. The classical serif typography on textured paper or dark leatherette aesthetic reinforces the literary institution feel.

---

## Decision 5: Non-Negotiable Server-Enforced Chapter Unlocking
- **Decision:** Sequential chapter unlocking and spoiler protection must be strictly enforced on the server/API layer. Requests for locked chapter content return 403 Forbidden with zero summaries or discussion content.
- **Alternatives Considered:**
  1. Client-side CSS blur/hide only (`display: none` or `filter: blur`).
- **Reasoning:** Client-side hiding leaks full spoilers in DOM inspection, network traces, and screen readers. Server-side validation guarantees readers on Chapter 3 never have future chapters spoiled.
