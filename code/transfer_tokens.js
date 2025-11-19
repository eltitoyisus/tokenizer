/**
 * Token Transfer Script for Token42
 * 
 * This script transfers tokens from one account to another.
 * The sender must have sufficient tokens and SOL for transaction fees.
 * 
 * Process:
 * 1. Load the sender's wallet
 * 2. Load the token mint address
 * 3. Get or create token accounts for sender and recipient
 * 4. Transfer the specified amount of tokens
 */

const {
    getOrCreateAssociatedTokenAccount,
    transfer,
    getAccount
} = require('@solana/spl-token');
const { PublicKey } = require('@solana/web3.js');
const { getConnection } = require('./utils/connection');
const { loadWallet } = require('./utils/wallet');
const { TOKEN_CONFIG } = require('./utils/config');
const fs = require('fs');
const path = require('path');

/**
 * Transfers tokens from the sender to a recipient
 * @param {string} senderWalletFile - Filename of the sender's wallet
 * @param {string} recipientAddress - Public key of the recipient
 * @param {number} amount - Amount of tokens to transfer (in whole tokens)
 */
async function transferTokens(senderWalletFile, recipientAddress, amount) {
    try {
        console.log('=== Token42 Transfer Process ===\n');
        
        // Step 1: Get connection to Solana network
        const connection = getConnection();
        
        // Step 2: Load the token mint address
        console.log('Loading token mint address...');
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        
        if (!fs.existsSync(mintAddressFile)) {
            throw new Error('Token mint address not found. Please run create_token.js first.');
        }
        
        const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
        const mintAddress = new PublicKey(mintData.mintAddress);
        console.log(`Token Mint: ${mintAddress.toString()}`);
        
        // Step 3: Load the sender's wallet
        console.log('\nLoading sender wallet...');
        const sender = loadWallet(senderWalletFile);
        
        // Step 4: Parse recipient address
        console.log('\nPreparing transfer...');
        const recipientPublicKey = new PublicKey(recipientAddress);
        console.log(`From: ${sender.publicKey.toString()}`);
        console.log(`To: ${recipientPublicKey.toString()}`);
        console.log(`Amount: ${amount} ${TOKEN_CONFIG.symbol}`);
        
        // Step 5: Get the sender's token account
        console.log('\nGetting sender token account...');
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            sender,
            mintAddress,
            sender.publicKey
        );
        
        console.log(`Sender Token Account: ${senderTokenAccount.address.toString()}`);
        
        // Step 6: Check sender's balance
        const senderAccountInfo = await getAccount(connection, senderTokenAccount.address);
        const senderBalance = Number(senderAccountInfo.amount) / (10 ** TOKEN_CONFIG.decimals);
        console.log(`Sender Balance: ${senderBalance} ${TOKEN_CONFIG.symbol}`);
        
        if (senderBalance < amount) {
            throw new Error(`Insufficient balance. You have ${senderBalance} ${TOKEN_CONFIG.symbol} but trying to send ${amount} ${TOKEN_CONFIG.symbol}`);
        }
        
        // Step 7: Get or create the recipient's token account
        console.log('\nGetting or creating recipient token account...');
        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            sender,                     // Sender pays for account creation if needed
            mintAddress,
            recipientPublicKey
        );
        
        console.log(`Recipient Token Account: ${recipientTokenAccount.address.toString()}`);
        
        // Step 8: Calculate transfer amount in smallest units
        const transferAmount = BigInt(amount) * BigInt(10 ** TOKEN_CONFIG.decimals);
        console.log(`\nTransferring ${amount} ${TOKEN_CONFIG.symbol}...`);
        console.log(`(${transferAmount.toString()} smallest units)`);
        
        // Step 9: Execute the transfer
        const signature = await transfer(
            connection,
            sender,                         // Payer for the transaction
            senderTokenAccount.address,     // Source token account
            recipientTokenAccount.address,  // Destination token account
            sender,                         // Owner of the source account
            transferAmount                  // Amount to transfer (in smallest units)
        );
        
        console.log('\n✅ Transfer successful!');
        console.log(`Transaction signature: ${signature}`);
        console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=${require('./utils/config').NETWORK}`);
        
        // Step 10: Verify the transfer
        console.log('\nVerifying transfer...');
        const updatedSenderAccount = await getAccount(connection, senderTokenAccount.address);
        const updatedRecipientAccount = await getAccount(connection, recipientTokenAccount.address);
        
        const newSenderBalance = Number(updatedSenderAccount.amount) / (10 ** TOKEN_CONFIG.decimals);
        const newRecipientBalance = Number(updatedRecipientAccount.amount) / (10 ** TOKEN_CONFIG.decimals);
        
        console.log(`Sender new balance: ${newSenderBalance} ${TOKEN_CONFIG.symbol}`);
        console.log(`Recipient new balance: ${newRecipientBalance} ${TOKEN_CONFIG.symbol}`);
        
        // Step 11: Log the transaction
        logTransaction({
            type: 'TRANSFER',
            signature,
            from: sender.publicKey.toString(),
            to: recipientPublicKey.toString(),
            amount,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('\n❌ Error transferring tokens:');
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
    
    const logFile = path.join(logDir, 'transfer_log.json');
    let logs = [];
    
    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    }
    
    logs.push(transaction);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

// Run the script if executed directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log('Usage: node transfer_tokens.js <sender_wallet_file> <recipient_address> <amount>');
        console.log('Example: node transfer_tokens.js payer-wallet.json 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 100');
        console.log('\nNote: sender_wallet_file should be in the deployment folder');
        process.exit(1);
    }
    
    const senderWalletFile = args[0];
    const recipientAddress = args[1];
    const amount = parseInt(args[2]);
    
    if (isNaN(amount) || amount <= 0) {
        console.error('Amount must be a positive number');
        process.exit(1);
    }
    
    transferTokens(senderWalletFile, recipientAddress, amount);
}

module.exports = { transferTokens };
