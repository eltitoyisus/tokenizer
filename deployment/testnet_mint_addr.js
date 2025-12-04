
const fs = require('fs');
const path = require('path');

function displayMintInfo() {
    const mintAddressFile = path.join(__dirname, 'token_mint_address.json');
    
    if (!fs.existsSync(mintAddressFile)) {
        console.log('❌ Token mint address not found.');
        console.log('Please run create_token.js first to deploy your token.');
        return;
    }
    
    const mintData = JSON.parse(fs.readFileSync(mintAddressFile, 'utf-8'));
    
    console.log('=== Token42 Deployment Information ===\n');
    console.log(`Token Name: ${mintData.tokenName}`);
    console.log(`Token Symbol: ${mintData.tokenSymbol}`);
    console.log(`Decimals: ${mintData.decimals}`);
    console.log(`\nNetwork: ${mintData.network}`);
    console.log(`\n🔑 Mint Address: ${mintData.mintAddress}`);
    console.log(`Mint Authority: ${mintData.mintAuthority}`);
    console.log(`Freeze Authority: ${mintData.freezeAuthority}`);
    console.log(`\nCreated: ${new Date(mintData.createdAt).toLocaleString()}`);
    
    const explorerUrl = `https://explorer.solana.com/address/${mintData.mintAddress}?cluster=${mintData.network}`;
    const solscanUrl = mintData.network === 'mainnet-beta' 
        ? `https://solscan.io/token/${mintData.mintAddress}`
        : `https://solscan.io/token/${mintData.mintAddress}?cluster=${mintData.network}`;
    
    console.log('\n=== Blockchain Explorers ===');
    console.log(`Solana Explorer: ${explorerUrl}`);
    console.log(`Solscan: ${solscanUrl}`);
    
    console.log('\n=== Quick Actions ===');
    console.log(`Mint tokens: node code/mint_tokens.js <address> <amount>`);
    console.log(`Check balance: node code/get_balance.js <address>`);
    console.log(`Transfer: node code/transfer_tokens.js <wallet_file> <to_address> <amount>`);
}

if (require.main === module) {
    displayMintInfo();
}

module.exports = { displayMintInfo };
