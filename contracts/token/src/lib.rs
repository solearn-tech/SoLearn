use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use solana_program::program_option::COption;
use std::convert::TryFrom;

declare_id!("LearnTokenProgramID111111111111111111111111111");

#[program]
pub mod solearn_token {
    use super::*;

    /// Initialize a new LEARN token mint with the program as mint authority
    pub fn initialize_mint(
        ctx: Context<InitializeMint>,
        decimals: u8,
        supply_cap: u64,
    ) -> Result<()> {
        // Set default values for the mint
        let mint_info = &ctx.accounts.mint;
        let authority_info = &ctx.accounts.authority;
        let rent = Rent::get()?;

        // Validate supply cap
        if supply_cap == 0 {
            return Err(ErrorCode::InvalidSupplyCap.into());
        }

        // Save the supply cap and other mint configuration
        let mint_config = &mut ctx.accounts.mint_config;
        mint_config.authority = authority_info.key();
        mint_config.supply_cap = supply_cap;
        mint_config.total_minted = 0;
        mint_config.is_initialized = true;
        mint_config.mint = mint_info.key();
        mint_config.decimals = decimals;
        mint_config.paused = false;
        mint_config.last_mint_timestamp = 0;
        mint_config.mint_cooldown = 0; // No cooldown by default

        msg!("LEARN token mint initialized with supply cap: {}", supply_cap);
        
        Ok(())
    }

    /// Mint new LEARN tokens
    pub fn mint_tokens(
        ctx: Context<MintTokens>,
        amount: u64,
        recipient_wallet: Pubkey,
    ) -> Result<()> {
        let mint_config = &mut ctx.accounts.mint_config;
        let now = Clock::get()?.unix_timestamp as u64;

        // Check if minting is paused
        if mint_config.paused {
            return Err(ErrorCode::MintingPaused.into());
        }

        // Check cooldown period
        if mint_config.mint_cooldown > 0 && now < mint_config.last_mint_timestamp + mint_config.mint_cooldown {
            return Err(ErrorCode::MintCooldownNotMet.into());
        }

        // Check supply cap
        if mint_config.total_minted + amount > mint_config.supply_cap {
            return Err(ErrorCode::SupplyCapExceeded.into());
        }

        // Mint tokens to the specified recipient
        let seeds = &[
            b"mint-authority".as_ref(),
            &[*ctx.bumps.get("mint_authority").unwrap()],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::mint_to(cpi_ctx, amount)?;

        // Update mint config
        mint_config.total_minted += amount;
        mint_config.last_mint_timestamp = now;

        msg!("Minted {} tokens to {}", amount, recipient_wallet);
        
        Ok(())
    }

    /// Update mint configuration parameters
    pub fn update_mint_config(
        ctx: Context<UpdateMintConfig>,
        new_authority: Option<Pubkey>,
        new_supply_cap: Option<u64>,
        new_cooldown: Option<u64>,
        pause_minting: Option<bool>,
    ) -> Result<()> {
        let mint_config = &mut ctx.accounts.mint_config;

        // Update mint authority if provided
        if let Some(authority) = new_authority {
            mint_config.authority = authority;
            msg!("Updated mint authority to: {}", authority);
        }

        // Update supply cap if provided
        if let Some(supply_cap) = new_supply_cap {
            // Cannot lower supply cap below already minted amount
            if supply_cap < mint_config.total_minted {
                return Err(ErrorCode::InvalidSupplyCap.into());
            }
            mint_config.supply_cap = supply_cap;
            msg!("Updated supply cap to: {}", supply_cap);
        }

        // Update cooldown if provided
        if let Some(cooldown) = new_cooldown {
            mint_config.mint_cooldown = cooldown;
            msg!("Updated mint cooldown to: {} seconds", cooldown);
        }

        // Update pause state if provided
        if let Some(pause) = pause_minting {
            mint_config.paused = pause;
            msg!("Minting is now {}", if pause { "paused" } else { "active" });
        }

        Ok(())
    }

    /// Burn LEARN tokens
    pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
        let cpi_accounts = token::Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::burn(cpi_ctx, amount)?;
        
        msg!("Burned {} tokens", amount);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(
        init,
        seeds = [b"mint-config", mint.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + MintConfig::LEN
    )]
    pub mint_config: Account<'info, MintConfig>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = decimals,
        mint::authority = mint_authority.key(),
        mint::freeze_authority = mint_authority.key(),
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        seeds = [b"mint-authority"],
        bump,
    )]
    /// CHECK: This is the PDA that will have authority over the mint
    pub mint_authority: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(
        mut,
        seeds = [b"mint-config", mint.key().as_ref()],
        bump,
        has_one = mint,
        constraint = mint_config.is_initialized @ ErrorCode::MintNotInitialized,
        constraint = mint_config.authority == authority.key() @ ErrorCode::Unauthorized,
    )]
    pub mint_config: Account<'info, MintConfig>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(
        seeds = [b"mint-authority"],
        bump,
    )]
    /// CHECK: This is the PDA that has authority over the mint
    pub mint_authority: UncheckedAccount<'info>,
    
    #[account(
        mut,
        constraint = token_account.mint == mint.key(),
        constraint = token_account.owner == recipient.key(),
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: This is the recipient of the tokens
    pub recipient: UncheckedAccount<'info>,
    
    #[account(
        constraint = authority.key() == mint_config.authority @ ErrorCode::Unauthorized,
    )]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateMintConfig<'info> {
    #[account(
        mut,
        seeds = [b"mint-config", mint.key().as_ref()],
        bump,
        has_one = mint,
        constraint = mint_config.is_initialized @ ErrorCode::MintNotInitialized,
        constraint = mint_config.authority == authority.key() @ ErrorCode::Unauthorized,
    )]
    pub mint_config: Account<'info, MintConfig>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        constraint = authority.key() == mint_config.authority @ ErrorCode::Unauthorized,
    )]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        constraint = token_account.mint == mint.key(),
        constraint = token_account.owner == owner.key(),
        constraint = token_account.amount >= amount,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    pub owner: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(Default)]
pub struct MintConfig {
    pub is_initialized: bool,        // 1 byte
    pub mint: Pubkey,                // 32 bytes
    pub authority: Pubkey,           // 32 bytes
    pub supply_cap: u64,             // 8 bytes
    pub total_minted: u64,           // 8 bytes
    pub decimals: u8,                // 1 byte
    pub paused: bool,                // 1 byte
    pub last_mint_timestamp: u64,    // 8 bytes
    pub mint_cooldown: u64,          // 8 bytes
}

impl MintConfig {
    pub const LEN: usize = 1 + 32 + 32 + 8 + 8 + 1 + 1 + 8 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("The mint has not been initialized")]
    MintNotInitialized,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Invalid supply cap")]
    InvalidSupplyCap,
    
    #[msg("Supply cap exceeded")]
    SupplyCapExceeded,
    
    #[msg("Minting is paused")]
    MintingPaused,
    
    #[msg("Mint cooldown period not met")]
    MintCooldownNotMet,
} 