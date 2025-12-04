
// Network configuration
const NETWORK = 'testnet'; // Options: 'devnet', 'testnet', 'mainnet-beta'

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

module.exports = {
    NETWORK,
    CLUSTER_ENDPOINTS,
    TOKEN_CONFIG,
    getClusterEndpoint: () => CLUSTER_ENDPOINTS[NETWORK]
};
