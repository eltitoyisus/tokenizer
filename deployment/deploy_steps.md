# Token42 Deployment Guide

This document provides step-by-step instructions for deploying your Token42 SPL token on the Solana blockchain.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Deployment Process](#deployment-process)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying your token, ensure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- Basic understanding of blockchain and tokens
- A text editor or IDE

## Installation

1. **Clone or download the repository**
   ```bash
   cd tokenizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   node -v
   npm -v
   ```

---

## Configuration

### 1. Network Selection

Edit `code/utils/config.js` to select your target network:

```javascript
const NETWORK = 'devnet'; // Options: 'devnet', 'testnet', 'mainnet-beta'
```

- **devnet**: For development and testing (recommended to start)
- **testnet**: For pre-production testing
- **mainnet-beta**: For production deployment (requires real SOL)

### 2. Token Metadata

In the same config file, customize your token:

```javascript
const TOKEN_CONFIG = {
    name: 'Token42',        // Your token name (must include "42")
    symbol: 'TK42',         // Your token ticker (3-5 characters)
    decimals: 9,            // Number of decimal places
    description: '...'      // Token description
};
```

**Important**: Token name must include "42" as per project requirements.

---

## Deployment Process

### Step 1: Create Your Wallet

The wallet creation is handled automatically when you run the token creation script. It will:
- Generate a new Solana keypair
- Save it to `deployment/payer-wallet.json`
- Display the public address

### Step 2: Fund Your Wallet (Devnet/Testnet Only)

**Option A: Using the airdrop script**
```bash
node deployment/scripts/airdrop.js <YOUR_WALLET_ADDRESS> 2
```

**Option B: Using Solana Web Faucet**
Visit: [https://faucet.solana.com/](https://faucet.solana.com/)
- Select the appropriate network (devnet/testnet)
- Enter your wallet address
- Request SOL

**Option C: Using CLI**
```bash
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
```

### Step 3: Create Your Token

Run the token creation script:

```bash
node code/create_token.js
```

**What happens:**
1. Loads or creates your payer wallet
2. Checks SOL balance for fees
3. Creates the token mint on Solana
4. Saves mint address to `deployment/token_mint_address.json`
5. Displays token information and explorer links

**Expected output:**
```
=== Token42 Creation Process ===

Setting up payer wallet...
New wallet created:
Public Key: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

✅ Token created successfully!
Token Mint Address: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

### Step 4: View Deployment Info

```bash
node deployment/testnet_mint_addr.js
```

This displays:
- Token metadata
- Mint address
- Network information
- Explorer links
- Quick action commands

---

## Testing

### 1. Mint Tokens

Create tokens and assign them to an address:

```bash
node code/mint_tokens.js <DESTINATION_ADDRESS> <AMOUNT>
```

Example:
```bash
node code/mint_tokens.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000
```

### 2. Check Balances

View token balance for any address:

```bash
node code/get_balance.js <WALLET_ADDRESS>
```

View all token accounts:
```bash
node code/get_balance.js <WALLET_ADDRESS> --all
```

### 3. Transfer Tokens

Send tokens between accounts:

```bash
node code/transfer_tokens.js <SENDER_WALLET_FILE> <RECIPIENT_ADDRESS> <AMOUNT>
```

Example:
```bash
node code/transfer_tokens.js payer-wallet.json 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin 100
```

---

## Production Deployment

### Mainnet Deployment Checklist

⚠️ **WARNING**: Mainnet deployment uses real SOL. Proceed with caution!

1. **Update Configuration**
   - Set `NETWORK = 'mainnet-beta'` in `code/utils/config.js`

2. **Secure Your Wallet**
   - Backup `deployment/payer-wallet.json` securely
   - Never share your private key
   - Consider using a hardware wallet for large amounts

3. **Fund Your Wallet**
   - Purchase SOL from an exchange
   - Transfer to your wallet address
   - Ensure sufficient balance for:
     - Token creation: ~0.01 SOL
     - Account creation: ~0.002 SOL per account
     - Transaction fees: ~0.000005 SOL per transaction

4. **Deploy Token**
   ```bash
   node code/create_token.js
   ```

5. **Verify on Explorer**
   - Visit [Solana Explorer](https://explorer.solana.com/)
   - Search for your mint address
   - Verify all details are correct

6. **Register Token (Optional)**
   - Submit to [Solana Token List](https://github.com/solana-labs/token-list)
   - Add logo and metadata
   - Improve discoverability

---

## Troubleshooting

### Common Issues

**Issue: "insufficient funds for transaction"**
- Solution: Add more SOL to your wallet using the faucet or by purchasing

**Issue: "Token mint address not found"**
- Solution: Run `create_token.js` first to create your token

**Issue: "could not find account"**
- Solution: The address hasn't received tokens yet (balance is 0)

**Issue: "Airdrop rate limit exceeded"**
- Solution: Wait a few minutes or use the web faucet at faucet.solana.com

**Issue: "Network timeout"**
- Solution: Check internet connection, try a different RPC endpoint

### Getting Help

- Check the [Solana Documentation](https://docs.solana.com/)
- Visit [Solana StackExchange](https://solana.stackexchange.com/)
- Review transaction logs in `deployment/transaction_logs/`

---

## Next Steps

After successful deployment:

1. **Document your token**
   - Update README.md with deployment details
   - Add smart contract address
   - Include network information

2. **Test thoroughly**
   - Perform multiple transactions
   - Test with different wallets
   - Verify all features work as expected

3. **Monitor your token**
   - Check explorer regularly
   - Review transaction logs
   - Monitor for any issues

4. **Share your work**
   - Update your Git repository
   - Add blockchain explorer links
   - Consider creating a demo video

---

## Important Notes

- **Never commit private keys to Git**: The `.gitignore` should exclude wallet files
- **Testnet tokens have no value**: Always test on devnet/testnet before mainnet
- **Transaction fees**: Keep extra SOL in your wallet for fees
- **Irreversible transactions**: Double-check all addresses before sending

---

## Support

For project-specific issues, refer to:
- `documentation/usage.md` - Detailed usage instructions
- `README.md` - Project overview and design decisions
- Transaction logs in `deployment/transaction_logs/`
