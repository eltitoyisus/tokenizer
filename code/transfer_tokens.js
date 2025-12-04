
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


async function transferTokens(senderWalletFile, recipientAddress, amount) {
    try {
        console.log('=== Token42 Transfer Process ===\n');
        
        const connection = getConnection();
        
        console.log('Loading token mint address...');
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        
        if (!fs.existsSync(mintAddressFile)) {
            throw new Error('Token mint address not found. Please run create_token.js first.');
        }
        
        const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
        const mintAddress = new PublicKey(mintData.mintAddress);
        console.log(`Token Mint: ${mintAddress.toString()}`);
        
        // Load the sender's wallet
        console.log('\nLoading sender wallet...');
        const sender = loadWallet(senderWalletFile);
        
        console.log('\nPreparing transfer...');
        const recipientPublicKey = new PublicKey(recipientAddress);
        console.log(`From: ${sender.publicKey.toString()}`);
        console.log(`To: ${recipientPublicKey.toString()}`);
        console.log(`Amount: ${amount} ${TOKEN_CONFIG.symbol}`);
        
        // Get sender's token account
        console.log('\nGetting sender token account...');
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            sender,
            mintAddress,
            sender.publicKey
        );
        
        console.log(`Sender Token Account: ${senderTokenAccount.address.toString()}`);
        
        // Check sender's balance
        const senderAccountInfo = await getAccount(connection, senderTokenAccount.address);
        const senderBalance = Number(senderAccountInfo.amount) / (10 ** TOKEN_CONFIG.decimals);
        console.log(`Sender Balance: ${senderBalance} ${TOKEN_CONFIG.symbol}`);
        
        if (senderBalance < amount) {
            throw new Error(`Insufficient balance. You have ${senderBalance} ${TOKEN_CONFIG.symbol} but trying to send ${amount} ${TOKEN_CONFIG.symbol}`);
        }
        
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
        
        // Log of the transaction
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
