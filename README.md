# Solearn - Decentralized Learning Platform on Solana

<div align="center">
  <img src="assets/images/solearn_logo.png" alt="Solearn Logo" width="200" />
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Website](https://img.shields.io/badge/Website-solearn.co-blue)](https://www.solearn.co/)
  [![Twitter](https://img.shields.io/badge/Twitter-@SOLEARN_AI_-blue)](https://x.com/SOLEARN_AI_)
</div>

## 🔑 Overview

Solearn is a groundbreaking decentralized learning platform built on the Solana blockchain that implements a **"Learn-to-Earn"** model. The platform incentivizes users to learn blockchain and Web3-related knowledge through token rewards, making education both engaging and financially rewarding. Our mission is to lower the barrier to entry for blockchain technology and promote broader Web3 education through economic incentives.

### Key Features

- **Token Rewards**: Earn $LEARN tokens for completing courses and quizzes
- **Achievement NFTs**: Receive unique NFT certificates confirming your skills
- **Interactive Learning**: Immersive experience with video content, quizzes, and coding challenges
- **Personalized Paths**: Customized learning journeys based on your interests and skill level
- **Community Engagement**: Discussion forums, learning guilds, and collaborative projects
- **Decentralized Governance**: Community participation in course review and platform development

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- Solana CLI (for blockchain interaction and testing)
- Phantom or other Solana wallets

### Installation

```bash
# Clone the repository
git clone https://github.com/solearn-tech/SoLearn.git
cd SoLearn

# Install dependencies
yarn install

# Install frontend dependencies
cd apps/web
yarn install

# Install backend dependencies
cd ../api
yarn install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start development servers
# Frontend
cd apps/web
yarn dev

# Backend (in a new terminal)
cd apps/api
yarn dev
```

Visit http://localhost:3000 in your browser to view the application.

## 🏗️ Architecture

Solearn implements a comprehensive full-stack decentralized application architecture with several key components working together:

<div align="center">
  <img src="assets/images/architecture.png" alt="Solearn Technical Architecture" width="800">
</div>

### System Components

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Frontend  │     │  Admin Portal   │     │   Mobile Apps   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────┬───────┴───────────────┬───────┘
                         │                       │
                         ▼                       ▼
              ┌─────────────────────┐   ┌─────────────────────┐
              │    API Gateway     │   │   Authentication    │
              └─────────┬─────────-┘   └─────────┬─────────-─┘
                        │                        │
         ┌──────────────┴────────────────┬──────┴──────────────┐
         │                               │                     │
         ▼                               ▼                     ▼
┌─────────────────┐           ┌─────────────────┐    ┌─────────────────┐
│  User Service   │           │ Learning Service│    │ Community Service│
└─────────────────┘           └─────────────────┘    └─────────────────┘
         │                               │                     │
         └───────────────┬───────────────┴─────────────┬──────┘
                         │                             │
                         ▼                             ▼
              ┌─────────────────────┐       ┌─────────────────────┐
              │  MongoDB Database   │       │   Solana Blockchain │
              └─────────────────────┘       └─────────────────────┘
```

### Frontend Layer
- **Next.js React Application**
  - Server-side rendering for SEO optimization
  - React Context API for state management
  - Responsive design with TailwindCSS
  - TypeScript for type safety
  - Wallet adapter integration for Solana wallets

### Backend Layer
- **Express API Service**
  - RESTful API with versioning
  - JWT-based authentication with wallet signatures
  - MongoDB for flexible data storage
  - Rate limiting and security middleware
  - Modular architecture for maintainability

### Blockchain Layer
- **Solana Smart Contracts**
  - SPL Token implementation for $LEARN tokens
  - Metaplex integration for NFT achievement issuance
  - On-chain verification of learning achievements
  - Governance mechanisms for platform development
  - Program Derived Addresses (PDAs) for secure data storage

### Storage Layer
- **Hybrid Storage Solution**
  - MongoDB for user data and learning progress
  - IPFS/Arweave for immutable course content
  - Solana blockchain for token transactions and achievements
  - CDN for static assets and media content

## 💻 Data Flow

Solearn implements several key data flows that enable seamless interaction between the frontend, backend, and blockchain layers:

### 1. Authentication Flow

```
┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐
│           │      │           │      │           │      │           │
│   User    │──1──▶│ Frontend  │──2──▶│  Backend  │──3──▶│  Solana   │
│           │      │           │      │           │      │  Wallet   │
│           │◀─8───│           │◀─7───│           │◀─4───│           │
└───────────┘      └───────────┘      └───────────┘      └───────────┘
                         │                  ▲                  │
                         │                  │                  │
                         │                  6                  │
                         │                  │                  │
                         │            ┌───────────┐            │
                         └────5──────▶│ Database  │◀────4──────┘
                                      │           │
                                      └───────────┘
```

1. User connects wallet to frontend
2. Frontend requests authentication from backend
3. Backend requests wallet signature for authentication challenge
4. Wallet provides signed message
5. Backend verifies signature and creates user profile in database
6. Backend retrieves user data
7. Backend issues JWT token for session
8. Frontend stores JWT for subsequent API calls

### 2. Learning Flow

```
┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐
│           │      │           │      │           │      │           │
│   User    │──1──▶│ Frontend  │──2──▶│  Backend  │──3──▶│ Database  │
│           │      │           │      │           │      │           │
│           │◀─8───│           │◀─7───│           │◀─4───│           │
└───────────┘      └───────────┘      └───────────┘      └───────────┘
                                           │                   
                                           │                   
                                           5                   
                                           │                   
                                           ▼                   
                                      ┌───────────┐            
                                      │  Solana   │            
                                      │ Blockchain│            
                                      │           │            
                                      └───────────┘            
```

1. User accesses course content through frontend
2. Frontend tracks progress and sends to backend API
3. Backend stores learning progress in database
4. Database confirms storage of progress data
5. Backend checks achievement criteria on blockchain
6. If criteria met, backend triggers token rewards
7. Backend sends updated progress to frontend
8. Frontend displays updated progress and rewards to user

### 3. Reward Distribution Flow

```
┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐
│           │      │           │      │           │      │           │
│   User    │──1──▶│ Frontend  │──2──▶│  Backend  │──3──▶│  Smart    │
│           │      │           │      │           │      │ Contracts │
│           │◀─8───│           │◀─7───│           │◀─4───│           │
└───────────┘      └───────────┘      └───────────┘      └───────────┘
                                           │                  │
                                           │                  │
                                           │                  5
                                           │                  │
                                           │                  ▼
                                           │            ┌───────────┐
                                           └─────6─────▶│ Database  │
                                                        │           │
                                                        └───────────┘
```

1. User completes achievement criteria (course, quiz, etc.)
2. Frontend notifies backend of completion
3. Backend triggers reward distribution via smart contract
4. Smart contract verifies achievement criteria
5. Smart contract mints/transfers tokens and NFTs to user wallet
6. Backend records reward distribution in database
7. Backend confirms successful distribution to frontend
8. Frontend displays reward notification to user

## 💰 Token Economics

The $LEARN token is the native utility token of the Solearn platform:

### Token Distribution

| Allocation | Percentage | Amount | Purpose |
|------------|------------|--------|---------|
| Initial Token Sale | 15% | 150,000,000 | Initial liquidity and early adopters |
| Team & Advisors | 25% | 250,000,000 | Team incentives and advisors compensation |
| Ecosystem Fund | 20% | 200,000,000 | Ecosystem development and partnerships |
| Learning Mining Rewards | 30% | 300,000,000 | User rewards for learning activities |
| Liquidity Provision Incentives | 5% | 50,000,000 | DEX liquidity incentives |
| Strategic Partners & Investors | 5% | 50,000,000 | Strategic partnerships and investments |

### Token Utility
- **Learning Activities**: Rewards for course completion and achievements
- **Governance**: Voting rights for platform development decisions
- **Premium Features**: Access to exclusive content and features
- **Creator Incentives**: Rewards for content creators and educators
- **Staking**: Earning additional rewards through token staking
- **Community Participation**: Incentives for community contribution

## 🧩 Core Components

### 1. User Authentication

Solearn uses Solana wallet-based authentication with JWT tokens:

```typescript
// Implementation of wallet authentication
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// In component
const { publicKey, signMessage, connected } = useWallet();

// Request signature for authentication
const message = `Login to Solearn: ${Date.now()}`;
const signature = await signMessage(new TextEncoder().encode(message));

// Verify on backend and receive JWT token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ 
    publicKey: publicKey.toString(),
    message,
    signature: bs58.encode(signature)
  })
});
```

### 2. Token Reward System

The token reward system is implemented using Solana's SPL token standard:

```rust
// Token distribution program
#[program]
pub mod learn_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize token mint and distribution parameters
        Ok(())
    }

    pub fn reward_user(
        ctx: Context<RewardUser>, 
        amount: u64,
        achievement_id: String
    ) -> Result<()> {
        // Verify achievement completion
        let user = &ctx.accounts.user;
        let achievement = &ctx.accounts.achievement;
        
        // Validate completion requirements
        require!(
            achievement.is_completed_by(user.key()),
            LearnTokenError::AchievementNotCompleted
        );
        
        // Transfer tokens to user
        token::transfer(
            ctx.accounts.transfer_context(),
            amount
        )?;
        
        // Record distribution in ledger
        ctx.accounts.distribution_record.record(
            user.key(),
            achievement_id,
            amount,
            Clock::get()?.slot
        )?;
        
        Ok(())
    }
}
```

### 3. NFT Achievement System

The achievement system uses Metaplex NFTs to certify learning accomplishments:

```rust
#[program]
pub mod achievements {
    use super::*;

    pub fn mint_achievement(
        ctx: Context<MintAchievement>,
        metadata_uri: String,
        achievement_type: String,
    ) -> Result<()> {
        // Create metadata for the achievement NFT
        let metadata = &mut ctx.accounts.metadata;
        
        // Set certificate metadata
        metadata.name = format!("Solearn: {}", achievement_type);
        metadata.symbol = "LEARN-CERT".to_string();
        metadata.uri = metadata_uri;
        
        // Mint the NFT to the user
        token::mint_to(
            ctx.accounts.mint_to_context(),
            1
        )?;
        
        // Record the achievement
        ctx.accounts.achievement_record.record(
            ctx.accounts.user.key(),
            achievement_type,
            Clock::get()?.slot
        )?;
        
        Ok(())
    }
}
```

### 4. Learning Progress Tracking

Progress tracking combines database storage with blockchain verification:

```typescript
// Backend progress tracking service
async function updateProgress(userId: string, courseId: string, lessonId: string, completed: boolean) {
  // Update progress in database
  await Progress.findOneAndUpdate(
    { userId, courseId },
    { 
      $set: { [`lessons.${lessonId}.completed`]: completed },
      $inc: { completedLessons: completed ? 1 : -1 }
    },
    { upsert: true }
  );
  
  // Check if course is completed
  const progress = await Progress.findOne({ userId, courseId });
  const course = await Course.findById(courseId);
  
  if (progress.completedLessons === course.totalLessons) {
    // Trigger achievement verification
    await verifyCompletion(userId, courseId);
  }
}

// On-chain verification
async function verifyCompletion(userId: string, courseId: string) {
  const user = await User.findById(userId);
  const wallet = new PublicKey(user.walletAddress);
  
  // Call smart contract to verify completion and issue rewards
  const transaction = new Transaction().add(
    await program.methods.verifyCourseCompletion(courseId)
      .accounts({
        user: wallet,
        course: coursePDA,
        rewardMint: rewardTokenMint,
        userTokenAccount: userTokenAccount,
        // ...other accounts
      })
      .instruction()
  );
  
  // Send transaction to network
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [adminKeypair]
  );
  
  // Record completion in database
  await Completion.create({
    userId,
    courseId,
    transactionSignature: signature,
    completedAt: new Date(),
  });
}
```

## 📅 Roadmap and Development Status

### Phase 1: Foundation (Completed)
- ✅ Platform architecture design
- ✅ Smart contract development for token and NFT systems
- ✅ User authentication and wallet integration
- ✅ Core frontend and backend infrastructure

### Phase 2: Core Features (Current)
- ✅ Course creation and learning system
- ✅ Progress tracking and achievement system
- ✅ Token reward distribution mechanism
- 🔄 Community discussion and engagement features
- 🔄 Mobile-responsive design optimization

### Phase 3: Expansion (Upcoming)
- ⏳ Creator portal for community content creation
- ⏳ Governance system implementation
- ⏳ Advanced learning analytics
- ⏳ Learning guilds and team challenges
- ⏳ Enhanced gamification elements

### Phase 4: Ecosystem Growth (Future)
- ⏳ Multi-chain support
- ⏳ Partnership integrations
- ⏳ Advanced AI-powered learning recommendations
- ⏳ Decentralized storage for all course content
- ⏳ Enterprise solutions for Web3 workforce training

## 📁 Project Structure

The Solearn project is organized into several key directories:

- **apps/** - Contains all application code
  - **web/** - Main web application frontend (React)
  - **admin/** - Administrative dashboard
  - **backend/** - API server and backend services

- **contracts/** - Solana smart contracts
  - **learning/** - Learning module and reward distribution contracts
  - **token/** - LEARN token implementation
  - **governance/** - DAO governance contracts

- **scripts/** - Utility scripts for development and deployment
  - Scripts for setup, deployment, and maintenance

- **docs/** - Project documentation
  - API specifications, architecture diagrams, and guides

- **assets/** - Static assets including images and design files

- **shared/** - Shared utilities and types used across applications

## 🛠️ Development Guide

### Frontend Development (Next.js)

```bash
cd apps/web
yarn dev
```

### Backend Development (Express)

```bash
cd apps/api
yarn dev
```

### Smart Contract Development (Anchor)

```bash
cd contracts/learn-token
anchor build
anchor test
```

### Internationalization

SoLearn is fully internationalized and supports multiple languages. The platform is designed with English as the primary language, with plans to add support for additional languages in the future.

#### Internationalization Scripts

The project includes several utility scripts in the `scripts/` directory to help with internationalization:

- `detect_chinese.sh` - Scans the codebase for any Chinese characters
- `replace_chinese.sh` - Replaces Chinese text with English equivalents using a translation mapping
- `deep_replace_chinese.sh` - Advanced script for handling complex Chinese text replacement

These scripts are used during development to ensure consistent language usage across the codebase.

## 🤝 Contributing

We welcome community contributions! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code complies with our coding standards and includes appropriate tests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Website: [solearn.co](https://www.solearn.co/)
- GitHub: [github.com/solearn-tech](https://github.com/solearn-tech)
- Twitter: [@SOLEARN_AI_](https://x.com/SOLEARN_AI_)
- Email: contact@solearn.co

---

Built with ❤️ by the Solearn Team