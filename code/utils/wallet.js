/**
 * Wallet utility functions for managing Solana keypairs
 * Handles wallet creation, loading, and saving operations
 */

const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Directory to store wallet keypairs
const WALLET_DIR = path.join(__dirname, '../../deployment');

/**
 * Creates a new Solana keypair (wallet)
 * @returns {Keypair} New Solana keypair
 */
function createWallet() {
    const keypair = Keypair.generate();
    console.log('New wallet created:');
    console.log('Public Key:', keypair.publicKey.toString());
    return keypair;
}

/**
 * Saves a keypair to a JSON file
 * @param {Keypair} keypair - The keypair to save
 * @param {string} filename - Name of the file to save to
 */
function saveWallet(keypair, filename) {
    // Ensure the wallet directory exists
    if (!fs.existsSync(WALLET_DIR)) {
        fs.mkdirSync(WALLET_DIR, { recursive: true });
    }
    
    const filepath = path.join(WALLET_DIR, filename);
    
    // Convert keypair to saveable format (array of bytes)
    const secretKeyArray = Array.from(keypair.secretKey);
    
    // Save to file
    fs.writeFileSync(filepath, JSON.stringify(secretKeyArray));
    console.log(`Wallet saved to: ${filepath}`);
}

/**
 * Loads a keypair from a JSON file
 * @param {string} filename - Name of the file to load from
 * @returns {Keypair} The loaded keypair
 */
function loadWallet(filename) {
    const filepath = path.join(WALLET_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
        throw new Error(`Wallet file not found: ${filepath}`);
    }
    
    // Read and parse the file
    const secretKeyArray = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    
    // Create keypair from secret key
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
    console.log('Wallet loaded:');
    console.log('Public Key:', keypair.publicKey.toString());
    
    return keypair;
}

/**
 * Gets a wallet, creating it if it doesn't exist
 * @param {string} filename - Name of the wallet file
 * @returns {Keypair} The wallet keypair
 */
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
