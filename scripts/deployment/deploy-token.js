#!/usr/bin/env node

const { Connection, Keypair, PublicKey, clusterApiUrl, sendAndConfirmTransaction } = require('@solana/web3.js');
const { readFileSync, writeFileSync } = require('fs');
const readline = require('readline');
const path = require('path');
const anchor = require('@project-serum/anchor');
const spl = require('@solana/spl-token');

// Metaplex token metadata program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt configuration
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Helper function to derive metadata account address
async function getMetadataAddress(mint) {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
}

// Program
async function main() {
  console.log('\x1b[36m%s\x1b[0m', '🚀 SoLearn Token Deployment Script 🚀');
  console.log('=========================================');
  
  try {
    // Step 1: Select network
    console.log('\n📡 Step 1: Select Solana Network');
    console.log('1. Devnet');
    console.log('2. Testnet');
    console.log('3. Mainnet-Beta');
    console.log('4. Localhost');
    
    const networkChoice = await prompt('Enter your choice (1-4): ');
    let endpoint;
    let network;
    
    switch (networkChoice) {
      case '1':
        endpoint = clusterApiUrl('devnet');
        network = 'devnet';
        break;
      case '2':
        endpoint = clusterApiUrl('testnet');
        network = 'testnet';
        break;
      case '3':
        endpoint = clusterApiUrl('mainnet-beta');
        network = 'mainnet-beta';
        break;
      case '4':
        endpoint = 'http://localhost:8899';
        network = 'localhost';
        break;
      default:
        throw new Error('Invalid network selection');
    }
    
    console.log(`\n🌐 Selected network: ${network}`);
    
    // Step 2: Setup wallet
    console.log('\n💰 Step 2: Setup Wallet');
    
    const useExistingKeyfile = await prompt('Do you want to use an existing keypair file? (y/n): ');
    let keypair;
    
    if (useExistingKeyfile.toLowerCase() === 'y') {
      const keypairPath = await prompt('Enter the path to your keypair file: ');
      const keypairData = JSON.parse(readFileSync(keypairPath, 'utf-8'));
      keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    } else {
      console.log('Generating new keypair...');
      keypair = Keypair.generate();
      const keypairPath = path.join(process.cwd(), `solearn-token-${network}-keypair.json`);
      writeFileSync(keypairPath, JSON.stringify(Array.from(keypair.secretKey)));
      console.log(`New keypair generated and saved to: ${keypairPath}`);
    }
    
    console.log(`Wallet public key: ${keypair.publicKey.toString()}`);
    
    // Step 3: Connect to network
    console.log('\n🔌 Step 3: Connecting to Solana network...');
    const connection = new Connection(endpoint, 'confirmed');
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`Connected to ${network}`);
    console.log(`Wallet balance: ${balance / 1e9} SOL`);
    
    if (balance < 1000000000 && network !== 'localhost') {
      // 1 SOL in lamports = 1,000,000,000
      console.log(`\n⚠️  Warning: Your wallet has less than 1 SOL. This may not be enough for deployment.`);
      if (network === 'devnet') {
        const airdrop = await prompt('Would you like to request a SOL airdrop? (y/n): ');
        if (airdrop.toLowerCase() === 'y') {
          console.log('Requesting airdrop...');
          await connection.requestAirdrop(keypair.publicKey, 1000000000);
          console.log('Airdrop received!');
        }
      }
    }
    
    // Step 4: Token configuration
    console.log('\n⚙️  Step 4: Token Configuration');
    const tokenName = await prompt('Enter token name (default: SoLearn): ') || 'SoLearn';
    const tokenSymbol = await prompt('Enter token symbol (default: LEARN): ') || 'LEARN';
    const tokenDecimals = parseInt(await prompt('Enter token decimals (default: 9): ') || '9');
    const tokenSupply = await prompt('Enter total token supply (default: 1000000000): ') || '1000000000';
    
    console.log('\nToken configuration:');
    console.log(`- Name: ${tokenName}`);
    console.log(`- Symbol: ${tokenSymbol}`);
    console.log(`- Decimals: ${tokenDecimals}`);
    console.log(`- Total Supply: ${tokenSupply}`);
    
    const confirmConfig = await prompt('\nConfirm these settings? (y/n): ');
    if (confirmConfig.toLowerCase() !== 'y') {
      throw new Error('Deployment cancelled');
    }
    
    // Step 5: Token deployment
    console.log('\n🚀 Step 5: Deploying token...');
    
    try {
      // Load Anchor workspace
      const provider = anchor.AnchorProvider.env();
      anchor.setProvider(provider);
      
      // Get the token program from the workspace
      const tokenProgram = anchor.workspace.SolearnToken;
      
      // Generate a new keypair for the token mint
      const mintKeypair = anchor.web3.Keypair.generate();
      console.log(`Generated mint keypair: ${mintKeypair.publicKey.toString()}`);
      
      // Create token mint account
      const decimals = tokenDecimals;
      const mintRent = await provider.connection.getMinimumBalanceForRentExemption(
        spl.MintLayout.span
      );
      
      console.log(`Creating token mint account...`);
      const createMintAccountIx = anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: mintRent,
        space: spl.MintLayout.span,
        programId: spl.TOKEN_PROGRAM_ID,
      });
      
      // Initialize mint instruction
      const initMintIx = spl.createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        provider.wallet.publicKey,
        provider.wallet.publicKey,
        spl.TOKEN_PROGRAM_ID
      );
      
      // Create token metadata
      const metadataAddress = await getMetadataAddress(mintKeypair.publicKey);
      
      const createMetadataIx = await tokenProgram.methods
        .createMetadata(
          tokenName,
          tokenSymbol,
          tokenConfig.uri,
        )
        .accounts({
          metadata: metadataAddress,
          mint: mintKeypair.publicKey,
          mintAuthority: provider.wallet.publicKey,
          payer: provider.wallet.publicKey,
          updateAuthority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction();
      
      // Send transaction with all instructions
      const tx = new anchor.web3.Transaction();
      tx.add(createMintAccountIx, initMintIx, createMetadataIx);
      
      const txSignature = await provider.sendAndConfirm(tx, [mintKeypair]);
      
      console.log(`\n✅ Token deployment successful!`);
      console.log(`Transaction signature: ${txSignature}`);
      console.log(`Token contract address: ${tokenProgram.programId.toString()}`);
      console.log(`Token mint address: ${mintKeypair.publicKey.toString()}`);
      
      // Create initial supply if specified
      if (tokenSupply > 0) {
        console.log(`\nMinting initial supply of ${tokenSupply} tokens...`);
        
        // Create a token account for the deployer
        const deployerTokenAccount = await spl.getAssociatedTokenAddress(
          mintKeypair.publicKey,
          provider.wallet.publicKey
        );
        
        // Check if the account exists, if not create it
        const tokenAccountInfo = await provider.connection.getAccountInfo(deployerTokenAccount);
        
        let createAtaIx;
        if (!tokenAccountInfo) {
          createAtaIx = spl.createAssociatedTokenAccountInstruction(
            provider.wallet.publicKey,
            deployerTokenAccount,
            provider.wallet.publicKey,
            mintKeypair.publicKey,
            spl.TOKEN_PROGRAM_ID,
            spl.ASSOCIATED_TOKEN_PROGRAM_ID
          );
        }
        
        // Create mint instruction
        const mintToIx = spl.createMintToInstruction(
          mintKeypair.publicKey,
          deployerTokenAccount,
          provider.wallet.publicKey,
          tokenSupply * (10 ** decimals)
        );
        
        // Send transaction
        const mintTx = new anchor.web3.Transaction();
        if (createAtaIx) {
          mintTx.add(createAtaIx);
        }
        mintTx.add(mintToIx);
        
        const mintTxSignature = await provider.sendAndConfirm(mintTx, []);
        console.log(`Initial supply minted successfully!`);
        console.log(`Transaction signature: ${mintTxSignature}`);
      }
    } catch (error) {
      console.error(`Error deploying token:`, error);
      throw error;
    }
    
    // Step 6: Verification
    console.log('\n🔍 Step 6: Verifying deployment...');
    
    try {
      // Verify the token exists on-chain
      const connection = new anchor.web3.Connection(networkConfig.rpcUrl);
      const mintInfo = await connection.getParsedAccountInfo(mintKeypair.publicKey);
      
      if (mintInfo && mintInfo.value) {
        console.log(`Token verified on-chain!`);
        console.log(`Token mint info:`, JSON.stringify(mintInfo.value.data.parsed, null, 2));
      } else {
        console.error(`Token verification failed: Could not find token mint on-chain`);
      }
    } catch (error) {
      console.error(`Error verifying token:`, error);
    }
    
    console.log('Verification complete!');
    
    // Step 7: Next steps
    console.log('\n🎬 Next Steps:');
    console.log('1. Setup liquidity pool (e.g., on Raydium or Orca)');
    console.log('2. List token on pump.fun');
    console.log('3. Update frontend with token addresses');
    console.log('4. Initialize learning program with token addresses');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run main function
main()
  .then(() => {
    console.log('\n✨ Deployment script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }); 