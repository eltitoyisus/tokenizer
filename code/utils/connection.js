
const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { getClusterEndpoint, NETWORK } = require('./config');

function getConnection() {
    const endpoint = getClusterEndpoint();
    
    const connection = new Connection(endpoint, 'confirmed');
    
    console.log(`Connected to Solana ${NETWORK} network`);
    console.log(`Endpoint: ${endpoint}`);
    
    return connection;
}

function getEndpoint() {
    return getClusterEndpoint();
}

module.exports = {
    getConnection,
    getEndpoint
};
