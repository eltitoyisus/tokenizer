/**
 * Token Balance Checker for Token42
 * 
 * This script checks the token balance for a specified wallet address.
 * It can also display SOL balance and all token accounts.
 * 
 * Process:
 * 1. Load the token mint address
 * 2. Get the associated token account for the wallet
 * 3. Display the token balance
 */

const {
    getAccount,
    getAssociatedTokenAddress
} = require('@solana/spl-token');
const { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getConnection } = require('./utils/connection');
const { TOKEN_CONFIG } = require('./utils/config');
const fs = require('fs');
const path = require('path');

/**
 * Gets the token balance for a specified address
 * @param {string} walletAddress - Public key of the wallet to check
 * @param {boolean} showSOL - Whether to also show SOL balance
 */
async function getBalance(walletAddress, showSOL = true) {
    try {
        console.log('=== Token42 Balance Checker ===\n');
        
        // Step 1: Get connection to Solana network
        const connection = getConnection();
        
        // Step 2: Parse the wallet address
        const walletPublicKey = new PublicKey(walletAddress);
        console.log(`Checking balance for: ${walletPublicKey.toString()}\n`);
        
        // Step 3: Show SOL balance if requested
        if (showSOL) {
            console.log('--- SOL Balance ---');
            const solBalance = await connection.getBalance(walletPublicKey);
            const solBalanceInSOL = solBalance / LAMPORTS_PER_SOL;
            console.log(`SOL: ${solBalanceInSOL.toFixed(9)} SOL`);
            console.log('');
        }
        
        // Step 4: Load the token mint address
        console.log('--- Token42 Balance ---');
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        
        if (!fs.existsSync(mintAddressFile)) {
            throw new Error('Token mint address not found. Please run create_token.js first.');
        }
        
        const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
        const mintAddress = new PublicKey(mintData.mintAddress);
        console.log(`Token: ${TOKEN_CONFIG.name} (${TOKEN_CONFIG.symbol})`);
        console.log(`Mint Address: ${mintAddress.toString()}`);
        
        // Step 5: Get the associated token account address
        const associatedTokenAddress = await getAssociatedTokenAddress(
            mintAddress,
            walletPublicKey
        );
        
        console.log(`Token Account: ${associatedTokenAddress.toString()}`);
        
        // Step 6: Try to get the account info
        try {
            const tokenAccount = await getAccount(connection, associatedTokenAddress);
            
            // Calculate balance in human-readable format
            const balance = Number(tokenAccount.amount) / (10 ** TOKEN_CONFIG.decimals);
            
            console.log(`\n✅ Balance: ${balance} ${TOKEN_CONFIG.symbol}`);
            
            // Show additional account details
            console.log('\n--- Account Details ---');
            console.log(`Owner: ${tokenAccount.owner.toString()}`);
            console.log(`Mint: ${tokenAccount.mint.toString()}`);
            console.log(`Delegate: ${tokenAccount.delegate ? tokenAccount.delegate.toString() : 'None'}`);
            console.log(`Is Frozen: ${tokenAccount.isFrozen ? 'Yes' : 'No'}`);
            
            return balance;
            
        } catch (error) {
            // Account doesn't exist - means balance is 0
            if (error.message.includes('could not find')) {
                console.log(`\n✅ Balance: 0 ${TOKEN_CONFIG.symbol}`);
                console.log('(Token account not yet created for this wallet)');
                return 0;
            }
            throw error;
        }
        
    } catch (error) {
        console.error('\n❌ Error checking balance:');
        console.error(error.message);
    }
}

/**
 * Gets all token accounts for a wallet
 * @param {string} walletAddress - Public key of the wallet to check
 */
async function getAllTokenAccounts(walletAddress) {
    try {
        console.log('=== All Token Accounts ===\n');
        
        const connection = getConnection();
        const walletPublicKey = new PublicKey(walletAddress);
        
        // Get all token accounts owned by this wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            walletPublicKey,
            { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        );
        
        if (tokenAccounts.value.length === 0) {
            console.log('No token accounts found for this wallet.');
            return;
        }
        
        console.log(`Found ${tokenAccounts.value.length} token account(s):\n`);
        
        tokenAccounts.value.forEach((accountInfo, index) => {
            const parsedInfo = accountInfo.account.data.parsed.info;
            const balance = parsedInfo.tokenAmount.uiAmount;
            const decimals = parsedInfo.tokenAmount.decimals;
            const mint = parsedInfo.mint;
            
            console.log(`${index + 1}. Token Account: ${accountInfo.pubkey.toString()}`);
            console.log(`   Mint: ${mint}`);
            console.log(`   Balance: ${balance}`);
            console.log(`   Decimals: ${decimals}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('\n❌ Error getting token accounts:');
        console.error(error.message);
    }
}

// Run the script if executed directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log('Usage: node get_balance.js <wallet_address> [--all]');
        console.log('Examples:');
        console.log('  node get_balance.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
        console.log('  node get_balance.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --all');
        process.exit(1);
    }
    
    const walletAddress = args[0];
    const showAll = args.includes('--all');
    
    if (showAll) {
        getAllTokenAccounts(walletAddress);
    } else {
        getBalance(walletAddress);
    }
}

module.exports = { getBalance, getAllTokenAccounts };
