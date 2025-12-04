const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const WALLET_DIR = path.join(__dirname, '../../deployment');

function createWallet() {
    const keypair = Keypair.generate();
    console.log('New wallet created:');
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
    
    if (fs.existsSync(filepath)) {
        return loadWallet(filename);
    } else {
        const wallet = createWallet();
        saveWallet(wallet, filename);
        return wallet;
    }
}

module.exports = {
    createWallet,
    saveWallet,
    loadWallet,
    getOrCreateWallet
};
