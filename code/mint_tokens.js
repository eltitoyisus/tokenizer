/**
 * Token Minting Script for Token42
 * 
 * This script mints (creates) new tokens and adds them to a specified account.
 * Only the mint authority can mint new tokens.
 * 
 * Process:
 * 1. Load the token mint address
 * 2. Load the mint authority wallet
 * 3. Create or get an associated token account for the recipient
 * 4. Mint the specified amount of tokens to the account
 */

const {
    getOrCreateAssociatedTokenAccount,
    mintTo,
    getMint
} = require('@solana/spl-token');
const { PublicKey } = require('@solana/web3.js');
const { getConnection } = require('./utils/connection');
const { loadWallet } = require('./utils/wallet');
const { TOKEN_CONFIG } = require('./utils/config');
const fs = require('fs');
const path = require('path');

/**
 * Mints tokens to a specified address
 * @param {string} destinationAddress - Public key of the account to receive tokens
 * @param {number} amount - Amount of tokens to mint (in whole tokens, not smallest units)
 */
async function mintTokens(destinationAddress, amount) {
    try {
        console.log('=== Token42 Minting Process ===\n');
        
        // Step 1: Get connection to Solana network
        const connection = getConnection();
        
        // Step 2: Load the token mint address
        console.log('\nLoading token mint address...');
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        
        if (!fs.existsSync(mintAddressFile)) {
            throw new Error('Token mint address not found. Please run create_token.js first.');
        }
        
        const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
        const mintAddress = new PublicKey(mintData.mintAddress);
        console.log(`Token Mint: ${mintAddress.toString()}`);
        
        // Step 3: Load the mint authority wallet
        console.log('\nLoading mint authority wallet...');
        const mintAuthority = loadWallet('payer-wallet.json');
        
        // Step 4: Verify the mint authority
        const mintInfo = await getMint(connection, mintAddress);
        if (!mintInfo.mintAuthority.equals(mintAuthority.publicKey)) {
            throw new Error('Loaded wallet is not the mint authority for this token!');
        }
        
        // Step 5: Parse and validate destination address
        console.log('\nPreparing to mint tokens...');
        const destinationPublicKey = new PublicKey(destinationAddress);
        console.log(`Destination: ${destinationPublicKey.toString()}`);
        
        // Step 6: Get or create the associated token account for the destination
        // This is the account that will hold the tokens for the destination wallet
        console.log('\nGetting or creating associated token account...');
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            mintAuthority,              // Payer for creating the account if needed
            mintAddress,                // Token mint address
            destinationPublicKey        // Owner of the token account
        );
        
        console.log(`Token Account: ${tokenAccount.address.toString()}`);
        
        // Step 7: Calculate amount in smallest units
        // For example, if decimals = 9 and amount = 100, we mint 100 * 10^9 units
        const mintAmount = BigInt(amount) * BigInt(10 ** TOKEN_CONFIG.decimals);
        console.log(`\nMinting ${amount} ${TOKEN_CONFIG.symbol} tokens...`);
        console.log(`(${mintAmount.toString()} smallest units)`);
        
        // Step 8: Mint the tokens
        const signature = await mintTo(
            connection,
            mintAuthority,              // Payer for the transaction
            mintAddress,                // Token mint address
            tokenAccount.address,       // Destination token account
            mintAuthority,              // Mint authority
            mintAmount                  // Amount to mint (in smallest units)
        );
        
        console.log('\n✅ Tokens minted successfully!');
        console.log(`Transaction signature: ${signature}`);
        console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=${require('./utils/config').NETWORK}`);
        
        // Step 9: Verify the new supply
        const updatedMintInfo = await getMint(connection, mintAddress);
        const totalSupply = Number(updatedMintInfo.supply) / (10 ** TOKEN_CONFIG.decimals);
        console.log(`\nTotal token supply: ${totalSupply} ${TOKEN_CONFIG.symbol}`);
        
        // Step 10: Log the transaction
        logTransaction({
            type: 'MINT',
            signature,
            destination: destinationPublicKey.toString(),
            amount,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('\n❌ Error minting tokens:');
        console.error(error.message);
    }
}

/**
 * Logs transaction to a file
 * @param {Object} transaction - Transaction details
 */
function logTransaction(transaction) {
    const logDir = path.join(__dirname, '../deployment/transaction_logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, 'mint_log.json');
    let logs = [];
    
    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    }
    
    logs.push(transaction);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

// Run the script if executed directly
if (require.main === module) {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node mint_tokens.js <destination_address> <amount>');
        console.log('Example: node mint_tokens.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000');
        process.exit(1);
    }
    
    const destinationAddress = args[0];
    const amount = parseInt(args[1]);
    
    if (isNaN(amount) || amount <= 0) {
        console.error('Amount must be a positive number');
        process.exit(1);
    }
    
    mintTokens(destinationAddress, amount);
}

module.exports = { mintTokens };
