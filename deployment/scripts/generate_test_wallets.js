const { Keypair } = require('@solana/web3.js');

// Generate two new keypairs for testing
const payer = Keypair.generate();
const recipient = Keypair.generate();

console.log('=== Generated Test Wallets ===\n');

console.log('PAYER WALLET:');
console.log('PublicKey:', payer.publicKey.toString());
console.log('SecretKey:', JSON.stringify(Array.from(payer.secretKey)));
console.log('');

console.log('RECIPIENT WALLET:');
console.log('PublicKey:', recipient.publicKey.toString());
console.log('SecretKey:', JSON.stringify(Array.from(recipient.secretKey)));
console.log('');

console.log('Copy these values to code/utils/config.js in the TEST_WALLETS constant');
