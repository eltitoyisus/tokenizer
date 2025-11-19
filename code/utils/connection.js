/**
 * Connection utility for Solana blockchain
 * Provides a configured connection instance to the Solana network
 */

const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { getClusterEndpoint, NETWORK } = require('./config');

/**
 * Creates and returns a connection to the Solana cluster
 * @returns {Connection} Configured Solana connection instance
 */
function getConnection() {
    // Get the endpoint for the configured network
    const endpoint = getClusterEndpoint();
    
    // Create connection with commitment level 'confirmed'
    // This ensures transactions are confirmed before returning
    const connection = new Connection(endpoint, 'confirmed');
    
    console.log(`Connected to Solana ${NETWORK} network`);
    console.log(`Endpoint: ${endpoint}`);
    
    return connection;
}

/**
 * Gets the current connection endpoint URL
 * @returns {string} The cluster endpoint URL
 */
function getEndpoint() {
    return getClusterEndpoint();
}

module.exports = {
    getConnection,
    getEndpoint
};
