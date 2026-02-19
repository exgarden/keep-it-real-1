use anchor_lang::prelude::*;

declare_id!("KrealMoment11111111111111111111111111111111");

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
        let proof = &mut ctx.accounts.reality_proof;

        // Enforce CID length limit (64 chars max)
        require!(
            ipfs_cid.as_bytes().len() <= 64,
            ErrorCode::CidTooLong
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
    #[msg("IPFS CID exceeds maximum length.")]
    CidTooLong,
}
