const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');
const { NETWORK, TEST_WALLETS } = require('./config');

const WALLET_DIR = path.join(__dirname, '../../deployment');

function createWallet() {
    const keypair = Keypair.generate();
    console.log('New wallet created:');
    console.log('Public Key:', keypair.publicKey.toString());
    return keypair;
}

// Create a wallet from predefined test wallet data
function createFixedWallet(walletType = 'payer') {
    if (!TEST_WALLETS[walletType]) {
        throw new Error(`Unknown wallet type: ${walletType}. Available: ${Object.keys(TEST_WALLETS).join(', ')}`);
    }
    
    const walletData = TEST_WALLETS[walletType];
    const keypair = Keypair.fromSecretKey(Uint8Array.from(walletData.secretKey));
    
    console.log(`Using fixed ${walletType} wallet (${NETWORK}):`);
    console.log('Public Key:', keypair.publicKey.toString());
    
    return keypair;
}

function saveWallet(keypair, filename) {
    if (!fs.existsSync(WALLET_DIR)) {
        fs.mkdirSync(WALLET_DIR, { recursive: true });
    }
    
    const filepath = path.join(WALLET_DIR, filename);
    
    const secretKeyArray = Array.from(keypair.secretKey);
    
    fs.writeFileSync(filepath, JSON.stringify(secretKeyArray));
    console.log(`Wallet saved to: ${filepath}`);
}

function loadWallet(filename) {
    const filepath = path.join(WALLET_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
        throw new Error(`Wallet file not found: ${filepath}`);
    }
    
    const secretKeyArray = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
    console.log('Wallet loaded:');
    console.log('Public Key:', keypair.publicKey.toString());
    
    return keypair;
}

function getOrCreateWallet(filename) {
    const filepath = path.join(WALLET_DIR, filename);
    
    // Use fixed wallets for devnet/testnet
    if (NETWORK === 'devnet' || NETWORK === 'testnet') {
        console.log(`📌 Using fixed test wallet for ${NETWORK} (consistent across runs)`);
        
        // Determine wallet type based on filename
        let walletType = 'payer';
        if (filename.includes('recipient') || filename.includes('receiver')) {
            walletType = 'recipient';
        }
        
        const wallet = createFixedWallet(walletType);
        
        // Save the fixed wallet to file if it doesn't exist (for consistency with existing code)
        if (!fs.existsSync(filepath)) {
            saveWallet(wallet, filename);
            console.log('💾 Fixed wallet saved to file for reference');
        }
        
        return wallet;
    }
    
    // For mainnet, use the original behavior (load or create new)
    if (fs.existsSync(filepath)) {
        return loadWallet(filename);
    } else {
        console.log('⚠️  Creating new wallet for MAINNET - make sure this is intentional!');
        const wallet = createWallet();
        saveWallet(wallet, filename);
        return wallet;
    }
}

module.exports = {
    createWallet,
    saveWallet,
    loadWallet,
    getOrCreateWallet,
    createFixedWallet
};
