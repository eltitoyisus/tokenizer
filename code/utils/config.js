
// Network configuration
const NETWORK = 'devnet'; // Options: 'devnet', 'testnet', 'mainnet-beta'

// Solana cluster endpoints
const CLUSTER_ENDPOINTS = {
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://api.testnet.solana.com',
    'mainnet-beta': 'https://api.mainnet-beta.solana.com'
};

// Token metadata
// Token name must include "42"
const TOKEN_CONFIG = {
    name: 'Token42',
    symbol: 'TK42',
    decimals: 9,
    description: 'A custom SPL token created for the 42 Tokenizer project'
};

// Fixed test wallets for devnet/testnet
// These wallets are pre-generated and will be used consistently for testing
// WARNING: Only use these on devnet/testnet - NEVER on mainnet!
const TEST_WALLETS = {
    // Main payer/authority wallet for devnet
    payer: {
        secretKey: [146,198,143,19,181,66,127,236,68,16,248,160,144,142,132,16,100,163,197,134,185,23,65,238,204,95,118,145,186,134,149,167,255,171,248,36,77,247,232,23,24,9,68,130,169,153,34,28,69,153,95,250,126,151,71,157,96,235,151,7,175,126,99,177],
        publicKey: 'JD346pPJM3WGCxu8i8H1XKMXWqW43UBcHNUSXRs8r16x'
    },
    // Secondary test wallet for receiving/testing transfers
    recipient: {
        secretKey: [218,115,146,80,226,174,155,26,43,148,162,196,245,231,63,202,102,86,176,204,154,100,244,61,201,198,94,231,142,165,89,218,45,194,110,56,10,22,157,233,76,239,28,170,136,72,85,62,68,119,201,238,216,104,226,138,37,137,5,215,210,7,169,150],
        publicKey: '45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B'
    }
};

module.exports = {
    NETWORK,
    CLUSTER_ENDPOINTS,
    TOKEN_CONFIG,
    TEST_WALLETS,
    getClusterEndpoint: () => CLUSTER_ENDPOINTS[NETWORK]
};
