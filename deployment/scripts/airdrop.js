
const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getConnection } = require('../../code/utils/connection');
const { NETWORK } = require('../../code/utils/config');

async function requestAirdrop(address, amount = 2) {
    try {
        console.log('=== SOL Airdrop Request ===\n');
        
        // Check if we're on a testnet
        if (NETWORK === 'mainnet-beta') {
            console.log('❌ Airdrops are not available on mainnet!');
            console.log('Please switch to devnet or testnet in config.js');
            return;
        }
        
        const connection = getConnection();
        const publicKey = new PublicKey(address);
        
        console.log(`Requesting ${amount} SOL for: ${publicKey.toString()}`);
        console.log(`Network: ${NETWORK}\n`);
        
        // Check current balance
        const balanceBefore = await connection.getBalance(publicKey);
        console.log(`Current balance: ${balanceBefore / LAMPORTS_PER_SOL} SOL`);
        
        // Request airdrop
        console.log('\nRequesting airdrop...');
        const signature = await connection.requestAirdrop(
            publicKey,
            amount * LAMPORTS_PER_SOL
        );
        
        console.log(`Airdrop signature: ${signature}`);
        
        // Wait for confirmation
        console.log('Waiting for confirmation...');
        await connection.confirmTransaction(signature);
        
        // Check new balance
        const balanceAfter = await connection.getBalance(publicKey);
        console.log('\n✅ Airdrop successful!');
        console.log(`New balance: ${balanceAfter / LAMPORTS_PER_SOL} SOL`);
        console.log(`Received: ${(balanceAfter - balanceBefore) / LAMPORTS_PER_SOL} SOL`);
        
    } catch (error) {
        console.error('\n❌ Error requesting airdrop:');
        console.error(error.message);
        
        if (error.message.includes('429')) {
            console.log('\nRate limit exceeded. Please try again later or use:');
            console.log('https://faucet.solana.com/');
        }
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log('Usage: node airdrop.js <wallet_address> [amount]');
        console.log('Example: node airdrop.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 2');
        console.log('\nDefault amount is 2 SOL');
        process.exit(1);
    }
    
    const address = args[0];
    const amount = args[1] ? parseFloat(args[1]) : 2;
    
    if (isNaN(amount) || amount <= 0) {
        console.error('Amount must be a positive number');
        process.exit(1);
    }
    
    requestAirdrop(address, amount);
}

module.exports = { requestAirdrop };
