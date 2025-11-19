/**
 * Configuration file for the Token42 project
 * Contains network endpoints and token metadata
 */

// Network configuration
// Use devnet for testing (free testnet tokens available)
// Use mainnet-beta for production deployment
const NETWORK = 'testnet'; // Options: 'devnet', 'testnet', 'mainnet-beta'

// Solana cluster endpoints
const CLUSTER_ENDPOINTS = {
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://api.testnet.solana.com',
    'mainnet-beta': 'https://api.mainnet-beta.solana.com'
};

// Token metadata
// Token name must include "42" as per project requirements
const TOKEN_CONFIG = {
    name: 'Token42',
    symbol: 'TK42',
    decimals: 9, // Standard Solana token decimals
    description: 'A custom SPL token created for the 42 Tokenizer project'
};

// Export configuration
module.exports = {
    NETWORK,
    CLUSTER_ENDPOINTS,
    TOKEN_CONFIG,
    // Helper function to get the current cluster endpoint
    getClusterEndpoint: () => CLUSTER_ENDPOINTS[NETWORK]
};
