const { 
	Token,
	TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const { LAMPORTS_PER_SOL, Keypair } = require('@solana/web3.js');
const { getConnection } = require('./utils/connection');
const { getOrCreateWallet, saveWallet } = require('./utils/wallet');
const { TOKEN_CONFIG } = require('./utils/config');
const fs = require('fs');
const path = require('path');

async function createToken() {
	try {
		
		const connection = getConnection();

		console.log('\nSetting up payer wallet...');
		const payer = getOrCreateWallet('payer-wallet.json');
		
		console.log('\nChecking wallet balance...');
		const balance = await connection.getBalance(payer.publicKey);
		const balanceInSOL = balance / LAMPORTS_PER_SOL;
		console.log(`Current balance: ${balanceInSOL} SOL`);
		
		if (balance === 0) {
			console.log('\n⚠️ Insufficient balance!');
			console.log('Please fund your wallet with devnet SOL from:');
			console.log('https://faucet.solana.com/');
			console.log(`Wallet address: ${payer.publicKey.toString()}`);
			return;
		}
		
		console.log('\nCreating token mint...');
		console.log(`Token name: ${TOKEN_CONFIG.name}`);
		console.log(`Token symbol: ${TOKEN_CONFIG.symbol}`);
		console.log(`Decimals: ${TOKEN_CONFIG.decimals}`);
		
		// Create a new token mint
		const mintKeypair = Keypair.generate();
		const token = await Token.createMint(
			connection,
			payer,                          // Payer for the transaction
			payer.publicKey,                // Mint authority (can mint new tokens)
			payer.publicKey,                // Freeze authority (can freeze token accounts)
			TOKEN_CONFIG.decimals,          // Number of decimals
			TOKEN_PROGRAM_ID
		);
		
		console.log('\n✅ Token created successfully!');
		console.log(`Token Mint Address: ${token.publicKey.toString()}`);
		
		console.log('\nVerifying token mint...');
		const mintInfo = await token.getMintInfo();
		console.log(`Mint Authority: ${mintInfo.mintAuthority.toString()}`);
		console.log(`Freeze Authority: ${mintInfo.freezeAuthority ? mintInfo.freezeAuthority.toString() : 'None'}`);
		console.log(`Decimals: ${mintInfo.decimals}`);
		console.log(`Current Supply: ${mintInfo.supply.toString()}`);
		
		const mintAddressFile = path.join(__dirname, '../deployment/token_mint_address.json');
		const mintData = {
			mintAddress: token.publicKey.toString(),
			network: require('./utils/config').NETWORK,
			tokenName: TOKEN_CONFIG.name,
			tokenSymbol: TOKEN_CONFIG.symbol,
			decimals: TOKEN_CONFIG.decimals,
			mintAuthority: payer.publicKey.toString(),
			freezeAuthority: payer.publicKey.toString(),
			createdAt: new Date().toISOString()
		};
		
		fs.writeFileSync(mintAddressFile, JSON.stringify(mintData, null, 2));
		console.log(`\nMint address saved to: ${mintAddressFile}`);
		
		console.log('\n=== Next Steps ===');
		console.log('1. Use mint_tokens.js to mint tokens to an account');
		console.log('2. Use get_balance.js to check token balances');
		console.log('3. Use transfer_tokens.js to transfer tokens between accounts');
		console.log('\nYour token is now live on Solana ' + require('./utils/config').NETWORK + '!');
		
	} catch (error) {
		console.error('\n❌ Error creating token:');
		console.error(error.message);
		
		if (error.message.includes('insufficient')) {
			console.log('\nYour wallet needs more SOL for transaction fees.');
			console.log('Get free devnet SOL from: https://faucet.solana.com/');
		}
	}
}

if (require.main === module) {
	createToken();
}

module.exports = { createToken };
