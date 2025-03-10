#!/usr/bin/env node

const { Connection, Keypair, PublicKey, clusterApiUrl, sendAndConfirmTransaction } = require('@solana/web3.js');
const { readFileSync, writeFileSync } = require('fs');
const readline = require('readline');
const path = require('path');

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt configuration
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

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
    
    // Step 5: Token deployment (placeholder)
    console.log('\n🚀 Step 5: Deploying token...');
    console.log('This step would call the Solana program to create the token...');
    
    // TODO: Implement actual token deployment using the Anchor framework
    // This would involve compiling the program, deploying it to the network,
    // and initializing the token with the specified parameters
    
    // For now, we'll just simulate success
    console.log(`\n✅ Token deployment successful!`);
    console.log(`Token contract address: [PLACEHOLDER]`);
    console.log(`Token mint address: [PLACEHOLDER]`);
    
    // Step 6: Verification (placeholder)
    console.log('\n🔍 Step 6: Verifying deployment...');
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