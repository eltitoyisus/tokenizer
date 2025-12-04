const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Try multiple devnet endpoints
const DEVNET_ENDPOINTS = [
    'https://api.devnet.solana.com',
    'https://devnet.helius-rpc.com',
    'https://rpc.ankr.com/solana_devnet'
];

async function tryAirdrop(address, amount = 2) {
    console.log('=== Fondeando Wallets de Prueba ===\n');
    console.log(`Dirección: ${address}`);
    console.log(`Cantidad: ${amount} SOL\n`);
    
    const publicKey = new PublicKey(address);
    
    for (const endpoint of DEVNET_ENDPOINTS) {
        try {
            console.log(`Intentando con: ${endpoint}...`);
            const connection = new Connection(endpoint, 'confirmed');
            
            // Check current balance
            const balanceBefore = await connection.getBalance(publicKey);
            console.log(`Balance actual: ${balanceBefore / LAMPORTS_PER_SOL} SOL`);
            
            // Request airdrop with smaller amount first
            const airdropAmount = Math.min(amount, 1); // Max 1 SOL per request
            console.log(`Solicitando ${airdropAmount} SOL...`);
            
            const signature = await connection.requestAirdrop(
                publicKey,
                airdropAmount * LAMPORTS_PER_SOL
            );
            
            console.log(`Firma: ${signature}`);
            console.log('Esperando confirmación...');
            
            await connection.confirmTransaction(signature, 'confirmed');
            
            // Check new balance
            const balanceAfter = await connection.getBalance(publicKey);
            console.log(`\n✅ ¡Airdrop exitoso!`);
            console.log(`Nuevo balance: ${balanceAfter / LAMPORTS_PER_SOL} SOL`);
            console.log(`Recibido: ${(balanceAfter - balanceBefore) / LAMPORTS_PER_SOL} SOL\n`);
            
            // If we need more, try again
            if (amount > 1 && airdropAmount < amount) {
                console.log(`Solicitando ${amount - airdropAmount} SOL adicionales...\n`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                await tryAirdrop(address, amount - airdropAmount);
            }
            
            return true;
            
        } catch (error) {
            console.log(`❌ Falló: ${error.message}\n`);
            continue;
        }
    }
    
    console.log('\n⚠️  Todos los endpoints fallaron.');
    console.log('\n📝 Usa el faucet web manualmente:');
    console.log('1. Ve a: https://faucet.solana.com/');
    console.log('2. Selecciona "Devnet"');
    console.log(`3. Pega esta dirección: ${address}`);
    console.log('4. Completa el CAPTCHA y confirma\n');
    
    return false;
}

async function fundTestWallets() {
    const { TEST_WALLETS } = require('../../code/utils/config');
    
    const wallets = [
        {
            name: 'Payer (Principal)',
            address: TEST_WALLETS.payer.publicKey,
            amount: 2
        },
        {
            name: 'Recipient (Secundaria)',
            address: TEST_WALLETS.recipient.publicKey,
            amount: 1
        }
    ];
    
    console.log('╔═══════════════════════════════════════╗');
    console.log('║  Fondeando Wallets de Prueba (Devnet)  ║');
    console.log('╚═══════════════════════════════════════╝\n');
    
    for (const wallet of wallets) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Wallet: ${wallet.name}`);
        console.log('='.repeat(50));
        
        const success = await tryAirdrop(wallet.address, wallet.amount);
        
        if (success) {
            console.log('✅ Wallet fondeada correctamente!\n');
        } else {
            console.log('⚠️  Fondea esta wallet manualmente\n');
        }
        
        // Wait between wallets
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Proceso completado!');
    console.log('='.repeat(50));
    console.log('\nPróximos pasos:');
    console.log(`1. node code/create_token.js`);
    console.log(`2. node code/mint_tokens.js ${TEST_WALLETS.payer.publicKey} 1000`);
    console.log(`3. node code/get_balance.js\n`);
}

if (require.main === module) {
    fundTestWallets().catch(console.error);
}

module.exports = { tryAirdrop, fundTestWallets };
