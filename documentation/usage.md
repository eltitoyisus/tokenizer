# Token42 Usage Documentation

Complete guide for using the Token42 SPL token system on Solana blockchain.

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Getting Started](#getting-started)
4. [Core Operations](#core-operations)
5. [Advanced Features](#advanced-features)
6. [Security Considerations](#security-considerations)
7. [API Reference](#api-reference)

---

## Introduction

Token42 is a standard SPL (Solana Program Library) token implementation on the Solana blockchain. SPL tokens are the Solana equivalent of:
- ERC-20 tokens on Ethereum
- BEP-20 tokens on Binance Smart Chain
- TRC-20 tokens on TRON

### Why Solana?

**Advantages:**
- **High Performance**: 65,000+ TPS (transactions per second)
- **Low Fees**: Typically $0.00025 per transaction
- **Fast Confirmation**: ~400ms block times
- **Scalability**: Can handle millions of users
- **Eco-Friendly**: Proof-of-Stake consensus

---

## System Architecture

### Components

```
tokenizer/
├── code/                          # Core functionality
│   ├── create_token.js           # Token deployment
│   ├── mint_tokens.js            # Token minting
│   ├── get_balance.js            # Balance queries
│   ├── transfer_tokens.js        # Token transfers
│   └── utils/                    # Utility modules
│       ├── config.js             # Configuration
│       ├── connection.js         # Network connection
│       └── wallet.js             # Wallet management
├── deployment/                    # Deployment assets
│   ├── token_mint_address.json   # Deployed token info
│   ├── payer-wallet.json         # Authority wallet
│   ├── testnet_mint_addr.js      # Info display
│   ├── scripts/
│   │   └── airdrop.js            # SOL faucet
│   └── transaction_logs/         # Transaction history
└── documentation/                 # Documentation
    └── usage.md                  # This file
```

### Key Concepts

**1. Mint Account**
- Master account that controls the token
- Has authority to create new tokens
- Stores token metadata (decimals, supply)

**2. Token Account**
- Associated account that holds tokens for a wallet
- One per wallet per token type
- Automatically created when needed

**3. Mint Authority**
- Wallet that can mint new tokens
- Can be transferred or revoked
- Default: creator wallet

**4. Freeze Authority**
- Wallet that can freeze token accounts
- Security feature for compliance
- Can be set to null to disable

---

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Verify installation
node code/create_token.js --help
```

### Initial Setup

1. **Configure Network**
   
   Edit `code/utils/config.js`:
   ```javascript
   const NETWORK = 'devnet'; // or 'testnet', 'mainnet-beta'
   ```

2. **Customize Token**
   
   ```javascript
   const TOKEN_CONFIG = {
       name: 'Token42',
       symbol: 'TK42',
       decimals: 9
   };
   ```

3. **Get SOL for Fees**
   
   Devnet/Testnet:
   ```bash
   # After first run, you'll get a wallet address
   node deployment/scripts/airdrop.js <YOUR_ADDRESS> 2
   ```

---

## Core Operations

### 1. Creating a Token

**Command:**
```bash
node code/create_token.js
```

**Process:**
1. Creates/loads payer wallet
2. Checks SOL balance
3. Creates token mint on blockchain
4. Saves mint address locally
5. Displays deployment info

**Output Files:**
- `deployment/payer-wallet.json` - Authority wallet
- `deployment/token_mint_address.json` - Token information

**Example Output:**
```
=== Token42 Creation Process ===

✅ Token created successfully!
Token Mint Address: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

Next Steps:
1. Use mint_tokens.js to mint tokens to an account
2. Use get_balance.js to check token balances
3. Use transfer_tokens.js to transfer tokens
```

---

### 2. Minting Tokens

**Command:**
```bash
node code/mint_tokens.js <DESTINATION_ADDRESS> <AMOUNT>
```

**Parameters:**
- `DESTINATION_ADDRESS`: Solana wallet public key
- `AMOUNT`: Number of tokens (whole units)

**Examples:**
```bash
# Mint 1000 tokens
node code/mint_tokens.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000

# Mint 500 tokens to another address
node code/mint_tokens.js 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin 500
```

**What Happens:**
1. Loads token mint address
2. Verifies mint authority
3. Creates token account if needed
4. Mints tokens to account
5. Logs transaction

**Transaction Log:**
Stored in `deployment/transaction_logs/mint_log.json`

---

### 3. Checking Balances

**Command:**
```bash
node code/get_balance.js <WALLET_ADDRESS> [--all]
```

**Parameters:**
- `WALLET_ADDRESS`: Solana wallet public key
- `--all`: (Optional) Show all token accounts

**Examples:**
```bash
# Check Token42 balance
node code/get_balance.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# Check all tokens
node code/get_balance.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU --all
```

**Output:**
```
=== Token42 Balance Checker ===

--- SOL Balance ---
SOL: 1.234567890 SOL

--- Token42 Balance ---
Token: Token42 (TK42)
✅ Balance: 1000 TK42

--- Account Details ---
Owner: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Is Frozen: No
```

---

### 4. Transferring Tokens

**Command:**
```bash
node code/transfer_tokens.js <SENDER_WALLET_FILE> <RECIPIENT_ADDRESS> <AMOUNT>
```

**Parameters:**
- `SENDER_WALLET_FILE`: Wallet filename (in deployment folder)
- `RECIPIENT_ADDRESS`: Recipient's public key
- `AMOUNT`: Number of tokens to send

**Examples:**
```bash
# Transfer 100 tokens
node code/transfer_tokens.js payer-wallet.json 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin 100
```

**Process:**
1. Loads sender wallet
2. Checks balance
3. Creates recipient account if needed
4. Executes transfer
5. Verifies completion
6. Logs transaction

**Requirements:**
- Sender must have sufficient tokens
- Sender must have SOL for fees
- Sender wallet file must exist

---

## Advanced Features

### Viewing Deployment Info

```bash
node deployment/testnet_mint_addr.js
```

Shows:
- Token metadata
- Mint address
- Explorer links
- Quick commands

### Requesting Airdrops (Testnet Only)

```bash
node deployment/scripts/airdrop.js <ADDRESS> <AMOUNT_IN_SOL>
```

Example:
```bash
node deployment/scripts/airdrop.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 2
```

### Transaction Logs

All transactions are logged to:
- `deployment/transaction_logs/mint_log.json` - Minting operations
- `deployment/transaction_logs/transfer_log.json` - Transfer operations

**Log Format:**
```json
{
  "type": "MINT",
  "signature": "5j7s...",
  "destination": "7xKX...",
  "amount": 1000,
  "timestamp": "2025-11-08T12:34:56.789Z"
}
```

---

## Security Considerations

### Wallet Security

**DO:**
- ✅ Backup wallet files securely
- ✅ Use hardware wallets for mainnet
- ✅ Keep private keys encrypted
- ✅ Test on devnet first

**DON'T:**
- ❌ Commit wallet files to Git
- ❌ Share private keys
- ❌ Use same wallet for dev and production
- ❌ Store large amounts in hot wallets

### Authority Management

**Mint Authority:**
- Controls who can create new tokens
- Can be transferred to another wallet
- Can be revoked (set to null) for fixed supply

**Freeze Authority:**
- Can freeze/unfreeze token accounts
- Useful for regulatory compliance
- Can be revoked if not needed

**Example - Transfer Authority:**
```javascript
// In code, you can transfer authority using:
await setAuthority(
    connection,
    payer,
    mint,
    currentAuthority,
    AuthorityType.MintTokens,
    newAuthority
);
```

### Best Practices

1. **Test Everything**
   - Always test on devnet first
   - Verify all transactions
   - Test edge cases

2. **Monitor Transactions**
   - Check explorer regularly
   - Review transaction logs
   - Watch for anomalies

3. **Backup Critical Data**
   - Wallet files
   - Mint addresses
   - Configuration

4. **Use Environment Variables**
   - For sensitive data
   - For different networks
   - For API keys

---

## API Reference

### Programmatic Usage

All scripts can be imported as modules:

```javascript
// Import functions
const { createToken } = require('./code/create_token');
const { mintTokens } = require('./code/mint_tokens');
const { getBalance } = require('./code/get_balance');
const { transferTokens } = require('./code/transfer_tokens');

// Use in your code
async function myTokenApp() {
    await createToken();
    await mintTokens('7xKXtg...', 1000);
    const balance = await getBalance('7xKXtg...');
    await transferTokens('wallet.json', '9xQeW...', 100);
}
```

### Utility Functions

```javascript
const { getConnection } = require('./code/utils/connection');
const { createWallet, loadWallet } = require('./code/utils/wallet');
const { TOKEN_CONFIG } = require('./code/utils/config');

// Get connection
const connection = getConnection();

// Create new wallet
const newWallet = createWallet();

// Load existing wallet
const wallet = loadWallet('my-wallet.json');

// Access config
console.log(TOKEN_CONFIG.symbol); // 'TK42'
```

---

## Troubleshooting

### Common Errors

**Error: "insufficient funds"**
```
Solution: Get more SOL
→ node deployment/scripts/airdrop.js <ADDRESS> 2
```

**Error: "Token mint address not found"**
```
Solution: Create token first
→ node code/create_token.js
```

**Error: "Insufficient balance"**
```
Solution: Mint more tokens or check balance
→ node code/mint_tokens.js <ADDRESS> <AMOUNT>
→ node code/get_balance.js <ADDRESS>
```

### Getting Help

1. Check transaction logs
2. View on Solana Explorer
3. Review configuration
4. Test with small amounts first

---

## Additional Resources

- **Solana Documentation**: https://docs.solana.com/
- **SPL Token Program**: https://spl.solana.com/token
- **Solana Cookbook**: https://solanacookbook.com/
- **Solana Explorer**: https://explorer.solana.com/
- **Web3.js Docs**: https://solana-labs.github.io/solana-web3.js/

---

## Support

For issues or questions:
1. Review this documentation
2. Check `deployment/deploy_steps.md`
3. Examine transaction logs
4. Test on devnet first

---

*Last updated: November 2025*
