use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use solana_program::program::invoke_signed;
use std::convert::TryFrom;

declare_id!("LearnAchievementProgram1111111111111111111111");

#[program]
pub mod solearn_learning {
    use super::*;

    /// Initialize the global learning program state
    pub fn initialize_program(
        ctx: Context<InitializeProgram>,
        token_mint: Pubkey,
        token_program: Pubkey,
    ) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.token_mint = token_mint;
        program_state.token_program = token_program;
        program_state.total_courses = 0;
        program_state.total_learners = 0;
        program_state.paused = false;
        
        msg!("Learning program initialized with token mint: {}", token_mint);
        
        Ok(())
    }

    /// Register a new course in the system
    pub fn register_course(
        ctx: Context<RegisterCourse>,
        course_id: String,
        title: String,
        description: String,
        reward_amount: u64,
        required_score: u8,
    ) -> Result<()> {
        // Validate inputs
        if course_id.len() > 20 {
            return Err(ErrorCode::CourseTitleTooLong.into());
        }
        if title.len() > 100 {
            return Err(ErrorCode::CourseTitleTooLong.into());
        }
        if description.len() > 200 {
            return Err(ErrorCode::CourseDescriptionTooLong.into());
        }
        if required_score > 100 {
            return Err(ErrorCode::InvalidRequiredScore.into());
        }

        // Initialize course data
        let course = &mut ctx.accounts.course;
        course.authority = ctx.accounts.authority.key();
        course.course_id = course_id;
        course.title = title;
        course.description = description;
        course.reward_amount = reward_amount;
        course.required_score = required_score;
        course.active = true;
        course.completed_count = 0;
        course.created_at = Clock::get()?.unix_timestamp;

        // Update program state
        let program_state = &mut ctx.accounts.program_state;
        program_state.total_courses += 1;

        msg!("Course registered: {}", course.title);
        
        Ok(())
    }

    /// Register a new learner in the system
    pub fn register_learner(
        ctx: Context<RegisterLearner>,
        learner_name: String,
    ) -> Result<()> {
        if learner_name.len() > 50 {
            return Err(ErrorCode::LearnerNameTooLong.into());
        }

        let learner = &mut ctx.accounts.learner;
        learner.wallet = ctx.accounts.wallet.key();
        learner.name = learner_name;
        learner.total_xp = 0;
        learner.courses_completed = 0;
        learner.created_at = Clock::get()?.unix_timestamp;
        learner.last_activity = Clock::get()?.unix_timestamp;

        // Update program state
        let program_state = &mut ctx.accounts.program_state;
        program_state.total_learners += 1;

        msg!("Learner registered: {}", learner.name);
        
        Ok(())
    }

    /// Record completion of a course by a learner and distribute rewards
    pub fn complete_course(
        ctx: Context<CompleteCourse>,
        score: u8,
        evidence_hash: String,
    ) -> Result<()> {
        // Check program is not paused
        let program_state = &mut ctx.accounts.program_state;
        if program_state.paused {
            return Err(ErrorCode::ProgramPaused.into());
        }

        // Check course is active
        let course = &mut ctx.accounts.course;
        if !course.active {
            return Err(ErrorCode::CourseInactive.into());
        }

        // Check learner achieved required score
        if score < course.required_score {
            return Err(ErrorCode::ScoreTooLow.into());
        }

        // Check if learner has already completed this course
        let completion = &mut ctx.accounts.course_completion;
        if completion.completed {
            return Err(ErrorCode::CourseAlreadyCompleted.into());
        }

        // Calculate XP based on score (higher score = more XP)
        let xp_earned = u64::from(score).saturating_mul(10); // 10 XP per point

        // Update learner stats
        let learner = &mut ctx.accounts.learner;
        learner.total_xp = learner.total_xp.saturating_add(xp_earned);
        learner.courses_completed = learner.courses_completed.saturating_add(1);
        learner.last_activity = Clock::get()?.unix_timestamp;

        // Update course stats
        course.completed_count = course.completed_count.saturating_add(1);

        // Record completion
        completion.learner = learner.wallet;
        completion.course = course.key();
        completion.completed = true;
        completion.score = score;
        completion.evidence_hash = evidence_hash;
        completion.completed_at = Clock::get()?.unix_timestamp;
        completion.xp_earned = xp_earned;
        completion.tokens_earned = course.reward_amount;

        msg!(
            "Course completed: {} by {}. Score: {}, XP earned: {}",
            course.title,
            learner.name,
            score,
            xp_earned
        );

        // Call the token program to mint reward tokens to the learner
        // Transfer tokens from the program's token account to the learner's wallet
        let token_program = ctx.accounts.program_state.token_program;
        let token_mint = ctx.accounts.program_state.token_mint;
        
        // Create the token accounts if they don't exist
        let seeds = &[
            b"program_authority",
            &[ctx.bumps.program_state],
        ];
        let signer = &[&seeds[..]];
        
        // Mint tokens to the learner's wallet
        let cpi_accounts = MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.learner_token_account.to_account_info(),
            authority: ctx.accounts.program_state.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::mint_to(cpi_ctx, course.reward_amount)?;
        
        msg!(
            "Minted {} tokens to learner {}",
            course.reward_amount,
            learner.wallet
        );
        
        Ok(())
    }

    /// Update course details
    pub fn update_course(
        ctx: Context<UpdateCourse>,
        title: Option<String>,
        description: Option<String>,
        reward_amount: Option<u64>,
        required_score: Option<u8>,
        active: Option<bool>,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course;

        // Update course title if provided
        if let Some(new_title) = title {
            if new_title.len() > 100 {
                return Err(ErrorCode::CourseTitleTooLong.into());
            }
            course.title = new_title;
        }

        // Update course description if provided
        if let Some(new_description) = description {
            if new_description.len() > 200 {
                return Err(ErrorCode::CourseDescriptionTooLong.into());
            }
            course.description = new_description;
        }

        // Update reward amount if provided
        if let Some(new_reward) = reward_amount {
            course.reward_amount = new_reward;
        }

        // Update required score if provided
        if let Some(new_score) = required_score {
            if new_score > 100 {
                return Err(ErrorCode::InvalidRequiredScore.into());
            }
            course.required_score = new_score;
        }

        // Update active status if provided
        if let Some(new_active) = active {
            course.active = new_active;
        }

        msg!("Course updated: {}", course.title);
        
        Ok(())
    }

    /// Update program configuration
    pub fn update_program_config(
        ctx: Context<UpdateProgramConfig>,
        new_authority: Option<Pubkey>,
        pause_program: Option<bool>,
    ) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;

        // Update authority if provided
        if let Some(authority) = new_authority {
            program_state.authority = authority;
            msg!("Updated program authority to: {}", authority);
        }

        // Update pause state if provided
        if let Some(pause) = pause_program {
            program_state.paused = pause;
            msg!("Program is now {}", if pause { "paused" } else { "active" });
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProgram<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProgramState::LEN
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RegisterCourse<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + Course::LEN,
        seeds = [b"course", course_id.as_bytes()],
        bump,
    )]
    pub course: Account<'info, Course>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterLearner<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = wallet,
        space = 8 + Learner::LEN,
        seeds = [b"learner", wallet.key().as_ref()],
        bump,
    )]
    pub learner: Account<'info, Learner>,
    
    #[account(mut)]
    pub wallet: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteCourse<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        constraint = course.active @ ErrorCode::CourseInactive,
    )]
    pub course: Account<'info, Course>,
    
    #[account(
        mut,
        seeds = [b"learner", wallet.key().as_ref()],
        bump,
        constraint = learner.wallet == wallet.key() @ ErrorCode::Unauthorized,
    )]
    pub learner: Account<'info, Learner>,
    
    #[account(
        init_if_needed,
        payer = wallet,
        space = 8 + CourseCompletion::LEN,
        seeds = [b"completion", course.key().as_ref(), wallet.key().as_ref()],
        bump,
    )]
    pub course_completion: Account<'info, CourseCompletion>,
    
    #[account(mut)]
    pub wallet: Signer<'info>,
    
    // Token program accounts
    #[account(
        mut,
        address = program_state.token_mint,
    )]
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        constraint = learner_token_account.owner == wallet.key(),
        constraint = learner_token_account.mint == token_mint.key(),
    )]
    pub learner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        address = program_state.token_program,
    )]
    pub token_program: Program<'info, Token>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCourse<'info> {
    #[account(
        mut,
        constraint = course.authority == authority.key() @ ErrorCode::Unauthorized,
    )]
    pub course: Account<'info, Course>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateProgramConfig<'info> {
    #[account(
        mut,
        constraint = program_state.authority == authority.key() @ ErrorCode::Unauthorized,
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct ProgramState {
    pub authority: Pubkey,             // 32 bytes
    pub token_mint: Pubkey,            // 32 bytes
    pub token_program: Pubkey,         // 32 bytes
    pub total_courses: u64,            // 8 bytes
    pub total_learners: u64,           // 8 bytes
    pub paused: bool,                  // 1 byte
}

impl ProgramState {
    pub const LEN: usize = 32 + 32 + 32 + 8 + 8 + 1;
}

#[account]
#[derive(Default)]
pub struct Course {
    pub authority: Pubkey,             // 32 bytes
    pub course_id: String,             // 4 + 20 = 24 bytes
    pub title: String,                 // 4 + 100 = 104 bytes
    pub description: String,           // 4 + 200 = 204 bytes
    pub reward_amount: u64,            // 8 bytes
    pub required_score: u8,            // 1 byte
    pub active: bool,                  // 1 byte
    pub completed_count: u64,          // 8 bytes
    pub created_at: i64,               // 8 bytes
}

impl Course {
    pub const LEN: usize = 32 + 24 + 104 + 204 + 8 + 1 + 1 + 8 + 8;
}

#[account]
#[derive(Default)]
pub struct Learner {
    pub wallet: Pubkey,                // 32 bytes
    pub name: String,                  // 4 + 50 = 54 bytes
    pub total_xp: u64,                 // 8 bytes
    pub courses_completed: u64,        // 8 bytes
    pub created_at: i64,               // 8 bytes
    pub last_activity: i64,            // 8 bytes
}

impl Learner {
    pub const LEN: usize = 32 + 54 + 8 + 8 + 8 + 8;
}

#[account]
#[derive(Default)]
pub struct CourseCompletion {
    pub learner: Pubkey,               // 32 bytes
    pub course: Pubkey,                // 32 bytes
    pub completed: bool,               // 1 byte
    pub score: u8,                     // 1 byte
    pub evidence_hash: String,         // 4 + 64 = 68 bytes
    pub completed_at: i64,             // 8 bytes
    pub xp_earned: u64,                // 8 bytes
    pub tokens_earned: u64,            // 8 bytes
}

impl CourseCompletion {
    pub const LEN: usize = 32 + 32 + 1 + 1 + 68 + 8 + 8 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Course title too long")]
    CourseTitleTooLong,
    
    #[msg("Course description too long")]
    CourseDescriptionTooLong,
    
    #[msg("Learner name too long")]
    LearnerNameTooLong,
    
    #[msg("Invalid required score (must be 0-100)")]
    InvalidRequiredScore,
    
    #[msg("Course is inactive")]
    CourseInactive,
    
    #[msg("Score too low to pass course")]
    ScoreTooLow,
    
    #[msg("Course already completed by this learner")]
    CourseAlreadyCompleted,
    
    #[msg("Program is paused")]
    ProgramPaused,
} 