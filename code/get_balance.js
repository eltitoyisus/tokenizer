
const {
    getAccount,
    getAssociatedTokenAddress
} = require('@solana/spl-token');
const { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getConnection } = require('./utils/connection');
const { TOKEN_CONFIG, TEST_WALLETS } = require('./utils/config');
const fs = require('fs');
const path = require('path');

async function getBalance(walletAddress, showSOL = true) {
    try {
        console.log('=== Token42 Balance Checker ===\n');
        
        // Connect to the SOL network
        const connection = getConnection();
        
        // Parse the wallet
        const walletPublicKey = new PublicKey(walletAddress);
        console.log(`Checking balance for: ${walletPublicKey.toString()}\n`);

        if (showSOL) {
            console.log('--- SOL Balance ---');
            const solBalance = await connection.getBalance(walletPublicKey);
            const solBalanceInSOL = solBalance / LAMPORTS_PER_SOL;
            console.log(`SOL: ${solBalanceInSOL.toFixed(9)} SOL`);
            console.log('');
        }
        
        console.log('--- Token42 Balance ---');
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        
        if (!fs.existsSync(mintAddressFile)) {
            throw new Error('Token mint address not found. Please run create_token.js first.');
        }
        
        const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
        const mintAddress = new PublicKey(mintData.mintAddress);
        console.log(`Token: ${TOKEN_CONFIG.name} (${TOKEN_CONFIG.symbol})`);
        console.log(`Mint Address: ${mintAddress.toString()}`);
        
        const associatedTokenAddress = await getAssociatedTokenAddress(
            mintAddress,
            walletPublicKey
        );
        
        console.log(`Token Account: ${associatedTokenAddress.toString()}`);
        
        // Get acc info
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

async function showAllTestWallets() {
    try {
        console.log('╔═══════════════════════════════════════════════╗');
        console.log('║      Balances de Wallets de Prueba           ║');
        console.log('╚═══════════════════════════════════════════════╝\n');
        
        const connection = getConnection();
        
        // Load mint address if exists
        const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
        let mintAddress = null;
        let tokenExists = false;
        
        if (fs.existsSync(mintAddressFile)) {
            const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
            mintAddress = new PublicKey(mintData.mintAddress);
            tokenExists = true;
        }
        
        const walletNames = {
            'payer': '🔑 Payer (Principal)',
            'recipient': '📥 Recipient (Secundaria)'
        };
        
        for (const [key, name] of Object.entries(walletNames)) {
            const wallet = TEST_WALLETS[key];
            const publicKey = new PublicKey(wallet.publicKey);
            
            console.log('─'.repeat(50));
            console.log(name);
            console.log('─'.repeat(50));
            console.log(`Dirección: ${wallet.publicKey}\n`);
            
            // Get SOL balance
            const solBalance = await connection.getBalance(publicKey);
            const solBalanceInSOL = solBalance / LAMPORTS_PER_SOL;
            console.log(`💰 SOL Balance: ${solBalanceInSOL.toFixed(9)} SOL`);
            
            // Get Token balance if token exists
            if (tokenExists) {
                try {
                    const associatedTokenAddress = await getAssociatedTokenAddress(
                        mintAddress,
                        publicKey
                    );
                    
                    const tokenAccount = await getAccount(connection, associatedTokenAddress);
                    const balance = Number(tokenAccount.amount) / (10 ** TOKEN_CONFIG.decimals);
                    
                    console.log(`🪙  ${TOKEN_CONFIG.symbol} Balance: ${balance} ${TOKEN_CONFIG.symbol}`);
                } catch (error) {
                    if (error.message.includes('could not find')) {
                        console.log(`🪙  ${TOKEN_CONFIG.symbol} Balance: 0 ${TOKEN_CONFIG.symbol} (cuenta no creada)`);
                    } else {
                        console.log(`⚠️  Error obteniendo balance de ${TOKEN_CONFIG.symbol}`);
                    }
                }
            } else {
                console.log(`ℹ️  Token aún no creado - ejecuta: node code/create_token.js`);
            }
            
            console.log('');
        }
        
        console.log('═'.repeat(50));
        console.log('✅ Verificación completada\n');
        
        if (tokenExists) {
            console.log('📊 Comandos útiles:');
            console.log(`   node code/mint_tokens.js ${TEST_WALLETS.payer.publicKey} 1000`);
            console.log(`   node code/transfer_tokens.js payer-wallet.json ${TEST_WALLETS.recipient.publicKey} 100\n`);
        }
        
    } catch (error) {
        console.error('\n❌ Error mostrando balances:');
        console.error(error.message);
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    
    // Si no hay argumentos o se pasa --all sin dirección, mostrar todas las wallets de prueba
    if (args.length === 0 || (args.length === 1 && args[0] === '--wallets')) {
        showAllTestWallets();
    } else if (args.length >= 1) {
        const walletAddress = args[0];
        const showAll = args.includes('--all');
        
        if (showAll) {
            getAllTokenAccounts(walletAddress);
        } else {
            getBalance(walletAddress);
        }
    }
}

module.exports = { getBalance, getAllTokenAccounts, showAllTestWallets };
