use anchor_lang::prelude::*;

declare_id!("KrealMoment11111111111111111111111111111111");

#[program]
pub mod keep_it_real {
    use super::*;

    pub fn mint_proof(
        ctx: Context<MintProof>, 
        image_hash: String, 
        caption: String, 
        timestamp: i64,
        entropy: String,
        dither: String
    ) -> Result<()> {
        let proof = &mut ctx.accounts.proof;
        proof.owner = *ctx.accounts.user.key;
        proof.image_hash = image_hash;
        proof.caption = caption;
        proof.timestamp = timestamp;
        proof.entropy = entropy;
        proof.dither = dither;
        proof.is_verified = true;
        
        emit!(ProofMinted {
            owner: proof.owner,
            image_hash: proof.image_hash.clone(),
            timestamp: proof.timestamp,
        });

        Ok(())
    }

    pub fn transfer_proof(ctx: Context<TransferProof>) -> Result<()> {
        let proof = &mut ctx.accounts.proof;
        proof.owner = *ctx.accounts.new_owner.key;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(image_hash: String)]
pub struct MintProof<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + (4 + 64) + (4 + 100) + 8 + (4 + 32) + (4 + 32) + 1,
        seeds = [b"proof", user.key().as_ref(), image_hash.as_bytes()],
        bump
    )]
    pub proof: Account<'info, RealityProof>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferProof<'info> {
    #[account(mut, has_one = owner)]
    pub proof: Account<'info, RealityProof>,
    pub owner: Signer<'info>,
    /// CHECK: New owner can be any account
    pub new_owner: AccountInfo<'info>,
}

#[account]
pub struct RealityProof {
    pub owner: Pubkey,
    pub image_hash: String, // SHA-256
    pub caption: String,
    pub timestamp: i64,
    pub entropy: String,    // Atmospheric Seed
    pub dither: String,     // Dither Factor
    pub is_verified: bool,
}

#[event]
pub struct ProofMinted {
    pub owner: Pubkey,
    pub image_hash: String,
    pub timestamp: i64,
}
