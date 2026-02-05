# PLAN: Keep It Real — Authentic Polaroid Memories

## Overview
"Keep It Real" is a mobile camera application designed for the Solana dApp store. It focuses on authentic, unedited photography by enforcing real-time capture and on-chain verification. The aesthetic is "Minimalist Luxury" with a nostalgic Polaroid twist.

## Project Type: WEB (Mobile-First)

## Success Criteria
- [ ] Guaranteed real-time capture (no gallery uploads).
- [ ] Consistent "Minimalist Luxury" UI with Polaroid motifs.
- [ ] Successful "Proof of Reality" hash generation on capture.
- [ ] Animated "Polaroid print" experience.
- [ ] Scattered Gallery view on a "Desk" background.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS / Vanilla CSS (Modern aesthetic)
- **Animation**: Framer Motion
- **Blockchain**: Solana Web3.js / Wallet Adapter
- **Icons**: Lucide React

## File Structure (Planned Changes)
```text
/src
  /components
    /ui-kit (Design tokens & base buttons)
    /camera (Camera overlay & shutter)
    /preview (Polaroid animation & cropping)
    /gallery (Scattered desk layout)
  /hooks (useCamera, useGallery, useSolana)
  /utils (Hashing, Image processing)
```

## Task Breakdown

### Phase 1: Foundation & Identity (P0)
- **Task 1: Style System Refinement**
  - **Agent**: `frontend-specialist`
  - **Action**: Update `index.css` with the new color palette (#F6F3EE, #EFE9E1, #2A2A2A, #D9D4CC, #3FA37C) and typography (Inter + Courier).
- **Task 2: Global Layout & Desk Background**
  - **Agent**: `frontend-specialist`
  - **Action**: Implement the `desk-bg` utility and the scattered background Polaroids for the Home screen.

### Phase 2: Authentic Capture Flow (P1)
- **Task 3: Camera UI Overhaul**
  - **Agent**: `frontend-specialist`
  - **Action**: Add the rounded Polaroid frame overlay and tactile shutter button.
- **Task 4: The "Print" Animation**
  - **Agent**: `frontend-specialist`
  - **Skills**: `frontend-design`, `react-best-practices`
  - **Action**: Implement the Framer Motion animation for the Polaroid sliding out of the "camera slot" after capture.

### Phase 3: Verification & Minting (P1)
- **Task 5: Post-Capture Cropping & Hashing**
  - **Agent**: `backend-specialist` (Logic)
  - **Action**: Implement light cropping (square/vertical) and ensure image hash is generated *after* the crop to finalize the "Authentic Version".
- **Task 6: Mint Confirmation & Success UI**
  - **Agent**: `frontend-specialist`
  - **Action**: Redesign the Mint screen to feel like a Polaroid sits on a desk, adding the "Verified Stamp" animation on success.

### Phase 4: The Scrapbook Gallery (P2)
- **Task 7: Scattered Desk Gallery**
  - **Agent**: `frontend-specialist`
  - **Skills**: `frontend-design`
  - **Action**: Implement "Option A" - a desk layout where photos are scattered and slightly rotated, rather than a strict grid.

## Phase X: Verification Checklist
- [ ] **Security**: Verify no secret keys in frontend.
- [ ] **UX**: Audit for "Minimalist Luxury" compliance (no purple, premium fonts).
- [ ] **Functional**: Confirm gallery uploads are disabled.
- [ ] **Solana**: Verify devnet minting simulation logic is sound.
- [ ] **Build**: `npm run build` succeeds.
