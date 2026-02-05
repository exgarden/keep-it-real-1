use anchor_lang::prelude::*;

declare_id!("KrealMoment11111111111111111111111111111111");

#[program]
pub mod keep_it_real {
    use super::*;

    pub fn mint_memory(ctx: Context<MintMemory>, image_hash: String, caption: String, timestamp: i64) -> Result<()> {
        let memory = &mut ctx.accounts.memory;
        memory.owner = *ctx.accounts.user.key;
        memory.image_hash = image_hash;
        memory.caption = caption;
        memory.timestamp = timestamp;
        memory.is_verified = true;
        
        emit!(MemoryMinted {
            owner: memory.owner,
            image_hash: memory.image_hash.clone(),
            timestamp: memory.timestamp,
        });

        Ok(())
    }

    pub fn transfer_memory(ctx: Context<TransferMemory>) -> Result<()> {
        let memory = &mut ctx.accounts.memory;
        memory.owner = *ctx.accounts.new_owner.key;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(image_hash: String)]
pub struct MintMemory<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 64 + 100 + 8 + 1, // disc + owner + hash + caption + ts + bool
        seeds = [b"memory", user.key().as_ref(), image_hash.as_bytes()],
        bump
    )]
    pub memory: Account<'info, MemoryAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferMemory<'info> {
    #[account(mut, has_one = owner)]
    pub memory: Account<'info, MemoryAccount>,
    pub owner: Signer<'info>,
    /// CHECK: New owner can be any account
    pub new_owner: AccountInfo<'info>,
}

#[account]
pub struct MemoryAccount {
    pub owner: Pubkey,
    pub image_hash: String, // SHA-256 or CID
    pub caption: String,
    pub timestamp: i64,
    pub is_verified: bool,
}

#[event]
pub struct MemoryMinted {
    pub owner: Pubkey,
    pub image_hash: String,
    pub timestamp: i64,
}
