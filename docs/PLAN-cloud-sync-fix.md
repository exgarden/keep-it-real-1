# Plan: Cloud Sync and Storage Fix

Enhance the "Keep It Real" dApp to support wallet-specific storage and full on-chain metadata recovery using IPFS.

## Project Type

**WEB** (Next.js / Solana)

## Success Criteria

- [ ] Images from Wallet A are NOT visible when Wallet B is connected.
- [ ] Photo metadata (caption, location, timestamp) is uploaded to IPFS as a JSON object.
- [ ] The on-chain `RealityProof` record stores the Metadata CID.
- [ ] A fresh login on any device recovers all minted memories (image + metadata) from the blockchain.

## Tech Stack

- **Solana Web3.js / Anchor**: Program interaction
- **Pinata / IPFS**: Decentralized storage for images and metadata
- **Framer Motion**: UI transitions
- **localStorage**: Client-side caching (partitioned by wallet)

## File Structure

- `src/idl.ts`: (Already updated) Solana Program IDL
- `src/utils/solana-utils.ts`: Update storage and fetch logic
- `src/app/page.tsx`: Update sync and partition logic
- `src/types.tsx`: Update types to include Metadata CID

## Task Breakdown

### Phase 1: Storage Partitioning

| Task ID | Name | Agent | Skills | Priority | Dependencies |
|---------|------|-------|--------|----------|--------------|
| T1 | Implement Wallet-Namespaced LocalStorage | `frontend-specialist` | `clean-code` | P0 | None |
| | **INPUT**: `localStorage.getItem('keep_it_real_gallery')` |
| | **OUTPUT**: `localStorage.getItem(`keep_it_real_gallery_${publicKey}`)` |
| | **VERIFY**: Connect Wallet A, mint, logout, connect Wallet B -> Gallery should be empty. |

### Phase 2: Metadata Cloud Storage (IPFS)

| Task ID | Name | Agent | Skills | Priority | Dependencies |
|---------|------|-------|--------|----------|--------------|
| T2 | Create Metadata JSON and Upload to IPFS | `backend-specialist` | `api-patterns` | P1 | T1 |
| | **INPUT**: Caption, Location, Image CID, Timestamp |
| | **OUTPUT**: Metadata JSON CID |
| | **VERIFY**: Check Pinata dashboard for a new JSON file containing correctly formatted metadata. |

### Phase 3: On-Chain Sync Update

| Task ID | Name | Agent | Skills | Priority | Dependencies |
|---------|------|-------|--------|----------|--------------|
| T3 | Update Sync to Resolve Metadata | `backend-specialist` | `clean-code` | P1 | T2 |
| | **INPUT**: Metadata CID from On-Chain Account |
| | **OUTPUT**: Fetched JSON content merged into `PolaroidPhoto` state |
| | **VERIFY**: Reload app -> Memories should show correct captions/locations fetched from IPFS. |

## Phase X: Verification Checklist

- [ ] Run `npm run dev` and verify no console errors on login.
- [ ] Cross-check Wallet A and Wallet B visibility.
- [ ] Verify IPFS metadata structure via gateway link.
- [ ] Run `python .agent/scripts/verify_all.py .`

## ✅ PHASE X COMPLETE

- Date: [Pending]
