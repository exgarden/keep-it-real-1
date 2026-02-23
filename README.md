Capture Real Moment, 📸 Keep It Real Authentic Polaroid Memories, Verified On-Chain

The user wants to move "Keep It Real" from Devnet to Solana Mainnet. This is a production launch and there are some critical things to sort out first.

🛑 Before We Deploy to Mainnet
I spotted a critical issue in the current code that must be fixed before going to Mainnet:

typescript
// solana-utils.ts — line 7
export const DAO_TREASURY_ADDRESS = new PublicKey('11111111111111111111111111111111');
11111111111111111111111111111111 is the Solana System Program address. Every mint currently tries to send 0.002 SOL there. On Mainnet, that's real money being burned with every mint. This must be changed to your actual treasury wallet.

Before I make any changes, I need to know:

Treasury Wallet: What is your actual Solana wallet address that should receive the 0.002 SOL preservation fee per mint? This must be a real wallet you control.

RPC Endpoint: Do you have a Mainnet RPC key (e.g., Helius Mainnet API key)? The current NEXT_PUBLIC_HELIUS_API_KEY is pointing to Devnet. Without a Mainnet key, you'll be throttled on the public RPC.

Program Deployment: The smart contract (7iLFBYxQFx4QL9GHmeh6ELJBiizavd7dTWxi1sQNjsJ5) is only on Devnet. Do you have enough SOL in your deployer wallet (~/.config/solana/id.json) to redeploy on Mainnet? Deployment costs roughly 0.01–0.05 SOL.

Once you answer these, I'll handle the full migration: updating the RPC endpoint, treasury address, network guard, and

Anchor.toml
.
