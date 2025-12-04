# Fixed Test Wallets for Devnet/Testnet

This project uses **fixed predefined wallets** for devnet and testnet environments to ensure consistent testing without creating new wallets each time.

⚠️ **WARNING**: These wallets are PUBLIC and should ONLY be used on devnet/testnet. NEVER use them on mainnet!

## Available Test Wallets

### 1. Payer/Authority Wallet (Main)
- **Public Key**: `BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV`
- **Usage**: Main wallet for creating tokens, minting, and paying transaction fees
- **File**: `payer-wallet.json` (auto-generated)

### 2. Recipient Wallet (Secondary)
- **Public Key**: `9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx`
- **Usage**: Test wallet for receiving tokens and testing transfers
- **File**: `recipient-wallet.json` (optional)

## How It Works

When running on **devnet** or **testnet**:
- The system automatically uses these fixed wallets
- No new wallets are created
- Consistent addresses across all test runs
- Easy to fund once and reuse

When running on **mainnet**:
- The system will create/load unique wallets as before
- A warning is shown when creating new mainnet wallets
- Fixed test wallets are NOT used (for security)

## Getting Started

### 1. Fund the Payer Wallet

Before using the project, fund the payer wallet with devnet SOL:

```bash
# Option 1: Using the airdrop script
node deployment/scripts/airdrop.js BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV 2

# Option 2: Web faucet
# Visit: https://faucet.solana.com/
# Paste: BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV
```

### 2. (Optional) Fund the Recipient Wallet

For transfer testing:

```bash
node deployment/scripts/airdrop.js 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx 1
```

## Usage Examples

### Create Token
```bash
node code/create_token.js
# Uses: BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV
```

### Mint Tokens to Payer
```bash
node code/mint_tokens.js BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV 1000
```

### Mint Tokens to Recipient
```bash
node code/mint_tokens.js 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx 500
```

### Check Balances
```bash
# Check payer balance
node code/get_balance.js BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV

# Check recipient balance
node code/get_balance.js 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx
```

### Transfer Between Wallets
```bash
node code/transfer_tokens.js payer-wallet.json 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx 100
```

## Benefits

✅ **Consistency**: Same addresses every time
✅ **No Wallet Clutter**: Don't create dozens of test wallets
✅ **Easy Testing**: Fund once, test multiple times
✅ **Predictable**: Know your addresses in advance
✅ **Documented**: Clear public keys for easy reference

## Security Notes

🔒 These wallets are defined in the source code (`code/utils/config.js`)
🔒 They are PUBLIC - anyone can access them
🔒 Only safe for devnet/testnet where tokens have no real value
🔒 Automatically switches to secure wallets on mainnet

## Explorer Links

### Devnet
- **Payer**: https://explorer.solana.com/address/BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV?cluster=devnet
- **Recipient**: https://explorer.solana.com/address/9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx?cluster=devnet

### Testnet
- **Payer**: https://explorer.solana.com/address/BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV?cluster=testnet
- **Recipient**: https://explorer.solana.com/address/9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx?cluster=testnet

## Switching Networks

The network is configured in `code/utils/config.js`:

```javascript
const NETWORK = 'devnet'; // or 'testnet', 'mainnet-beta'
```

- **devnet/testnet**: Uses fixed wallets
- **mainnet-beta**: Creates/loads unique secure wallets

---

*Last updated: December 2025*
