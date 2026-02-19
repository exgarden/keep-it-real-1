# PLAN: Keep It Real Mobile Web3 Overhaul

## 🎯 Goal
Transform "Keep It Real" into a premium mobile-first dApp with robust Web3 integration, real-time verification logs, and a hybrid storage architecture (On-Chain Hash + Cloud Storage).

## 🧩 Orchestration Strategy
| Agent | Role | Focus |
| :--- | :--- | :--- |
| `project-planner` | Strategic Lead | Roadmap, 4-Phase execution, Task management. |
| `debugger` | Quality Assurance | Resolve `npm run dev` errors, Buffer crash verification, Linting. |
| `frontend-specialist` | UI/UX Master | Mobile-first "Minimalist Luxury" styling, logo integration, animations. |
| `backend-specialist` | Web3 Engineer | Real entropy mapping, On-Chain minting logic, Cloud storage integration. |

---

## 🛠 Phase 1: Stability & Foundation (TIER 0)
- [x] **Terminal Recovery**: Diagnose and fix errors in `npm run dev`.
- [x] **Polyfill Audit**: Confirm `vite-plugin-node-polyfills` is correctly handling Solana deps.
- [ ] **Mobile Environment**: Configure viewport and touch targets for mobile priority.

## 🌈 Phase 2: Visual & Brand Integration (TIER 1)
- [x] **Handwritten Branding**: Finalize Logo placement in all screen headers.
- [x] **Typography Fix**: Ensure `Bodoni Moda` and `Jost` are loading correctly on mobile devices.
- [x] **Luxury Aesthetic**: Refine glassmorphism and subtle micro-animations.

## ⛓ Phase 3: Web3 & Reality Verification (TIER 2)
- [x] **Real Entropy**: Map "Atmospheric Seed" and "Entropy Source" to `window.crypto` and `performance.now()`.
- [ ] **Hybrid Storage**:
    - [ ] Plan integration for Cloud storage (Stingray/Simple storage).
    - [ ] Implement On-Chain verification (Image Hash -> Solana).
- [ ] **Minting Engine**: Finalize `MintingScreen` logic with real wallet signatures.

## 📤 Phase 4: Social & Scrapbook (TIER 3)
- [x] **Sharing System**: Native Web Share API integration for mobile "Sharing".
- [ ] **Scrapbook Enhancement**: Polish the "Apple Photos" style gallery with smooth transitions.
- [ ] **Final Audit**: Run `checklist.py`.

---

## 🚦 Verification Plan
### Automated
- `npm run build` to verify polyfill bundling.
- Browser test in Mobile Emulation mode.
### Manual
- Connect Phantom Mobile.
- Verify "Reality Hash" matches image content.
- Test "Share" functionality on mobile browser.
