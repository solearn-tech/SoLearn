# SoLearn - Decentralized Learning Platform on Solana

<div align="center">
  <img src="assets/images/logo.svg" alt="SoLearn Logo" width="200" />
  <h1>SoLearn</h1>
  <p>Decentralized Learning Platform on Solana</p>
  <p><i>Learn to Earn on Solana - Earn rewards while learning</i></p>
</div>

## Project Links

- **Website**: [solearn.co](https://solearn.co)
- **GitHub**: [github.com/solearn-tech/SoLearn](https://github.com/solearn-tech/SoLearn)
- **Twitter**: Coming soon

## Project Introduction

SoLearn is an innovative decentralized learning platform built on the Solana blockchain. The platform adopts a "Learn-to-Earn" model, incentivizing users to learn blockchain and Web3-related knowledge through token rewards. Our mission is to lower the barrier to entry for blockchain technology and promote broader Web3 education through economic incentives.

### Key Features

- **Token Rewards**: Earn $LEARN tokens after completing courses and quizzes
- **Achievement NFTs**: Receive unique learning achievement NFTs to certify your skills
- **Quality Content**: Carefully curated Web3 and blockchain courses
- **Interactive Learning**: Immersive learning experience with real-time feedback
- **Decentralized Governance**: Community participation in course review and platform development

## Quick Start

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- Solana CLI (for blockchain interaction and testing)
- Phantom or other Solana wallets

### Installation Steps

1. Clone the project

```bash
git clone https://github.com/solearn-tech/SoLearn.git
cd SoLearn
```

2. Install dependencies

```bash
# Install root directory dependencies
yarn install

# Install frontend dependencies
cd apps/web
yarn install

# Install backend dependencies
cd ../api
yarn install
```

3. Set up environment variables

```bash
# Frontend environment variables
cp apps/web/.env.example apps/web/.env.local

# Backend environment variables
cp apps/api/.env.example apps/api/.env
```

4. Start development servers

```bash
# Start frontend
cd apps/web
yarn dev

# Start backend (new terminal)
cd apps/api
yarn dev
```

Now, you can visit http://localhost:3000 in your browser to view the SoLearn frontend application.

## Project Structure

```
SoLearn/
├── apps/                   # Applications
│   ├── web/                # Frontend Web app (Next.js)
│   │   ├── public/         # Static assets
│   │   ├── src/
│   │   │   ├── components/ # UI components
│   │   │   ├── contexts/   # React contexts for state
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── pages/      # Next.js pages
│   │   │   ├── services/   # API service calls
│   │   │   ├── store/      # Global state management
│   │   │   ├── styles/     # CSS and styling
│   │   │   ├── types/      # TypeScript definitions
│   │   │   └── utils/      # Utility functions
│   │   └── tests/          # Frontend tests
│   │
│   └── api/                # Backend API service (Express)
│       ├── src/
│       │   ├── controllers/# Request handlers
│       │   ├── middleware/ # Express middleware
│       │   ├── models/     # Data models
│       │   ├── routes/     # API routes
│       │   ├── services/   # Business logic
│       │   └── utils/      # Utility functions
│       └── tests/          # Backend tests
│
├── contracts/              # Solana smart contracts
│   ├── learn-token/        # $LEARN token contract
│   │   ├── programs/       # Anchor programs
│   │   └── tests/          # Contract tests
│   │
│   └── achievements/       # Learning achievement NFT contract
│       ├── programs/       # Anchor programs
│       └── tests/          # Contract tests
│
├── sdk/                    # JavaScript SDK
│   ├── src/                # SDK source code
│   │   ├── contracts/      # Contract interaction
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   └── tests/              # SDK tests
│
├── shared/                 # Shared utilities and types
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Shared utilities
│
├── docs/                   # Documentation
├── scripts/                # Deployment and test scripts
└── assets/                 # Project assets
    └── images/             # Images including logo
```

## Technical Architecture

### System Overview

SoLearn implements a full-stack decentralized application architecture with the following key components:

![SoLearn Architecture](assets/images/architecture.png)

### Key Components

#### Frontend (Next.js)
- **Server-side rendering** for improved SEO and performance
- **React Context API** for state management
- **Wallet adapter integration** for seamless Solana wallet connections
- **TailwindCSS** for responsive and customizable UI components
- **TypeScript** for type safety and better developer experience

#### Backend (Express)
- **RESTful API design** with proper versioning
- **JWT-based authentication** with wallet signature verification
- **MongoDB** for flexible data storage
- **Rate limiting and security middleware** for protection against attacks
- **Modular architecture** for maintainability and scalability

#### Smart Contracts (Anchor/Solana)
- **SPL Token implementation** for $LEARN tokens
- **Metaplex integration** for NFT achievement issuance
- **On-chain verification** of learning achievements
- **Governance mechanisms** for platform development
- **Program Derived Addresses (PDAs)** for secure data storage

### Data Flow

1. **User Authentication Flow**:
   - User connects wallet through frontend wallet adapter
   - Backend verifies wallet signature for authentication
   - JWT token issued for subsequent authenticated requests
   - User profile created/retrieved from database

2. **Learning Flow**:
   - User browses and enrolls in courses
   - Progress tracked in database as user completes lessons
   - Quiz results validated and stored
   - Achievement criteria checked upon completion

3. **Reward Distribution Flow**:
   - Backend triggers reward distribution upon achievement completion
   - Smart contract verifies achievement criteria on-chain
   - Tokens transferred to user's wallet
   - NFT achievement minted and transferred to user

4. **Content Management Flow**:
   - Content creators submit courses through creator portal
   - Review process conducted by governance participants
   - Approved content stored on IPFS/Arweave
   - Content metadata and references stored on-chain

### Security Considerations

- **Wallet signature verification** for all authenticated actions
- **Program Derived Addresses (PDAs)** for secure storage of user data
- **Rate limiting** to prevent abuse
- **Input validation and sanitization** at all entry points
- **Multiple environment configurations** for development, testing, and production
- **Secure API endpoints** with proper authorization checks

### Deployment Architecture

- **Frontend**: Vercel/Netlify for global CDN distribution
- **Backend**: Containerized deployment on cloud providers
- **Contracts**: Deployed on Solana mainnet with testnet staging
- **CI/CD pipeline** for automated testing and deployment

## Core Components Implementation

### Wallet Integration

The wallet integration is implemented using Solana wallet adapter, which provides a unified interface for connecting to various Solana wallets:

```typescript
// WalletContext.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Usage in components
const { publicKey, signMessage, connected } = useWallet();
```

### Token Rewards System

The token rewards system uses Solana Program Library (SPL) tokens with custom distribution logic:

```rust
// learn_token/programs/learn_token/src/lib.rs
#[program]
pub mod learn_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize token mint and distribution parameters
        Ok(())
    }

    pub fn reward_user(ctx: Context<RewardUser>, amount: u64) -> Result<()> {
        // Verify achievement and distribute tokens
        Ok(())
    }
}
```

### Achievement NFT System

Achievement NFTs are implemented using Metaplex standards:

```rust
// achievements/programs/achievements/src/lib.rs
#[program]
pub mod achievements {
    use super::*;

    pub fn mint_achievement(
        ctx: Context<MintAchievement>,
        metadata_uri: String,
        achievement_type: String,
    ) -> Result<()> {
        // Create and mint NFT to user
        Ok(())
    }
}
```

### Course Progress Tracking

Course progress is tracked using a combination of database storage and on-chain verification:

```typescript
// Backend progress tracking
async function updateProgress(userId: string, courseId: string, lessonId: string, completed: boolean) {
  // Update progress in database
  // If course completed, trigger achievement verification
}

// On-chain verification
async function verifyCompletion(wallet: PublicKey, courseId: string) {
  // Verify course completion on-chain
  // Trigger token rewards and NFT minting
}
```

## Feature Overview

### User Experience

- **Course Browsing**: Explore a rich catalog of blockchain and Web3 courses
- **Learning Paths**: Customized learning paths based on your skill level and interests
- **Interactive Quizzes**: Validate your knowledge through practical quizzes
- **Progress Tracking**: Track your learning progress and achievements in real-time
- **Token Rewards**: Earn $LEARN tokens by completing learning tasks
- **NFT Certification**: Obtain unique NFT certificates representing your skills

### Technical Architecture

- **Frontend**: Responsive user interface built with Next.js and TailwindCSS
- **Backend**: Express-based API service handling user authentication and course management
- **Blockchain**: Solana smart contracts managing token rewards and achievement NFTs
- **Storage**: Course content stored on IPFS/Arweave, ensuring persistence and decentralization
- **Authentication**: Wallet-based authentication supporting multiple Solana wallets

## Development Guide

### Frontend Development

The frontend is built using the Next.js framework and TailwindCSS.

```bash
cd apps/web
yarn dev
```

Main files and directories:
- `pages/`: Application routes and pages
- `components/`: Reusable UI components
- `contexts/`: React Context for state management
- `hooks/`: Custom React Hooks
- `styles/`: Global styles and TailwindCSS configuration
- `public/`: Static assets

### Backend Development

The backend API is built using Express.

```bash
cd apps/api
yarn dev
```

Main files and directories:
- `src/routes/`: API route definitions
- `src/controllers/`: Request handling logic
- `src/models/`: Data models
- `src/middleware/`: Middleware functions
- `src/services/`: Business logic

### Contract Development

Smart contracts are developed using the Anchor framework.

```bash
cd contracts/learn-token
anchor build
anchor test
```

## Contribution Guidelines

We welcome community contributions! If you want to participate in SoLearn development, please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code complies with our coding standards and includes appropriate tests.

## Roadmap

### Short-term Goals (1-3 months)
- Refine course creation and playback functionality
- Optimize user experience and mobile adaptation
- Improve wallet integration and token reward mechanisms
- Release public beta version

### Medium-term Goals (3-6 months)
- Launch creator portal allowing content creators to publish courses
- Implement community governance features
- Expand course categories and learning paths
- Establish partnerships to grow the ecosystem

### Long-term Goals (6-12 months)
- Implement fully decentralized storage
- Launch multi-chain support
- Establish complete token economic model
- Expand to other educational domains

## License

MIT 