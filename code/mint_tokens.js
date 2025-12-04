
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

async function mintTokens(destinationAddress, amount) {
    try {
        console.log('=== Token42 Minting Process ===\n');
        
        const connection = getConnection();
        
        // Load the token mint address
        console.log('\nLoading token mint address...');
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        
        if (!fs.existsSync(mintAddressFile)) {
            throw new Error('Token mint address not found. Please run create_token.js first.');
        }
        
        const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
        const mintAddress = new PublicKey(mintData.mintAddress);
        console.log(`Token Mint: ${mintAddress.toString()}`);
        
        // Load the mint authority wallet
        console.log('\nLoading mint authority wallet...');
        const mintAuthority = loadWallet('payer-wallet.json');
        
        // Verify the mint authority
        const mintInfo = await getMint(connection, mintAddress);
        if (!mintInfo.mintAuthority.equals(mintAuthority.publicKey)) {
            throw new Error('Loaded wallet is not the mint authority for this token!');
        }
        
        console.log('\nPreparing to mint tokens...');
        const destinationPublicKey = new PublicKey(destinationAddress);
        console.log(`Destination: ${destinationPublicKey.toString()}`);
        
        console.log('\nGetting or creating associated token account...');
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            mintAuthority,              // Payer for creating the account if needed
            mintAddress,                // Token mint address
            destinationPublicKey        // Owner of the token account
        );
        
        console.log(`Token Account: ${tokenAccount.address.toString()}`);
        
        // Step 7: Calculate amount in smallest units
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
        
        // Verify the new supply
        const updatedMintInfo = await getMint(connection, mintAddress);
        const totalSupply = Number(updatedMintInfo.supply) / (10 ** TOKEN_CONFIG.decimals);
        console.log(`\nTotal token supply: ${totalSupply} ${TOKEN_CONFIG.symbol}`);
        
        // Log of the transaction
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

if (require.main === module) {
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
