use anchor_lang::prelude::*;

declare_id!("7iLFBYxQFx4QL9GHmeh6ELJBiizavd7dTWxi1sQNjsJ5");

pub const STORAGE_FEE: u64 = 2_000_000; // 0.002 SOL in lamports

#[program]
pub mod keep_it_real {
    use super::*;

    pub fn mint_memory(
        ctx: Context<MintMemory>,
        image_hash: [u8; 32],
        ipfs_cid: String,
        app_signature: [u8; 64],
        timestamp: i64,
    ) -> Result<()> {
        // 0. Transfer Preservation Fee to Treasury
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.dao_treasury.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, STORAGE_FEE)?;

        let proof = &mut ctx.accounts.reality_proof;
        let clock = Clock::get()?;

        // 1. CID Validation (Basic check)
        require!(
            !ipfs_cid.is_empty() && ipfs_cid.as_bytes().len() <= 64,
            ErrorCode::InvalidCid
        );

        // 2. Time Drift Protection (+/- 10 minutes)
        // This ensures the claimed capture time is close to on-chain time
        let drift = (timestamp - clock.unix_timestamp).abs();
        require!(
            drift <= 600, // 10 minutes in seconds
            ErrorCode::TimeDriftTooLarge
        );

        proof.owner = ctx.accounts.user.key();
        proof.image_hash = image_hash;
        proof.ipfs_cid = ipfs_cid;
        proof.app_signature = app_signature;
        proof.timestamp = timestamp;
        proof.is_verified = true;

        Ok(())
    }

    pub fn revoke_memory(_ctx: Context<RevokeMemory>) -> Result<()> {
        // Anchor automatically refunds rent to `user` via `close` constraint
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(image_hash: [u8; 32])]
pub struct MintMemory<'info> {
    #[account(
        init,
        payer = user,
        space = RealityProof::LEN,
        seeds = [b"memory", user.key().as_ref(), &image_hash],
        bump
    )]
    pub reality_proof: Account<'info, RealityProof>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Protocol treasury account receiving the preservation fee
    #[account(mut)]
    pub dao_treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeMemory<'info> {
    #[account(
        mut,
        close = user,
        has_one = owner
    )]
    pub reality_proof: Account<'info, RealityProof>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct RealityProof {
    pub owner: Pubkey,          // 32 bytes
    pub image_hash: [u8; 32],   // 32 bytes
    pub ipfs_cid: String,       // 4 + 64 bytes max
    pub app_signature: [u8; 64], // 64 bytes
    pub timestamp: i64,         // 8 bytes
    pub is_verified: bool,      // 1 byte
}

impl RealityProof {
    pub const LEN: usize =
        8 + // discriminator
        32 + // owner
        32 + // image_hash
        4 + 64 + // ipfs_cid (string prefix + max len)
        64 + // app_signature
        8 + // timestamp
        1; // is_verified
}

#[error_code]
pub enum ErrorCode {
    #[msg("IPFS CID is invalid or too long.")]
    InvalidCid,
    #[msg("The timestamp provided differs too much from on-chain time.")]
    TimeDriftTooLarge,
}
