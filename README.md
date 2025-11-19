# Token42 - Solana SPL Token Project

A complete implementation of a custom SPL token on the Solana blockchain, created as part of the 42 School Tokenizer project in partnership with BNB Chain.

## 🔗 Smart Contract Information

**Network:** Solana Devnet (for testing)  
**Token Name:** Token42  
**Token Symbol:** TK42  
**Decimals:** 9  
**Token Standard:** SPL Token (Solana Program Library)

> **Note:** After deployment, the mint address and explorer links will be displayed and saved in `deployment/token_mint_address.json`

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Why Solana?](#-why-solana)
- [Design Decisions](#-design-decisions)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Security](#-security)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

Token42 is a fully functional cryptocurrency token built on the Solana blockchain. This project demonstrates:

- Creating custom tokens using Solana's SPL Token standard
- Managing token supply through minting operations
- Implementing secure wallet management
- Handling token transfers between accounts
- Proper transaction logging and monitoring

The project fulfills all requirements of the 42 School Tokenizer assignment, including:
- ✅ Token name containing "42"
- ✅ Clean, well-commented code
- ✅ Comprehensive documentation
- ✅ Deployment on public blockchain (testnet)
- ✅ Blockchain explorer integration
- ✅ Security best practices

---

## 🚀 Why Solana?

### Technical Reasons

I chose Solana over other blockchain platforms (Ethereum, BSC, etc.) for several compelling reasons:

#### 1. **Performance & Scalability**
- **Transaction Speed**: 65,000+ TPS vs Ethereum's ~15 TPS
- **Block Time**: ~400ms vs Ethereum's ~13 seconds
- **No Network Congestion**: Consistent performance even under load

#### 2. **Cost Efficiency**
- **Transaction Fees**: ~$0.00025 per transaction
- **Token Creation**: ~0.01 SOL (~$0.50 at current prices)
- **Account Creation**: ~0.002 SOL per token account
- Compare to Ethereum: $5-50 in gas fees per transaction

#### 3. **Developer Experience**
- **Modern Tech Stack**: Rust and JavaScript/TypeScript
- **Rich Ecosystem**: Mature libraries (@solana/web3.js, @solana/spl-token)
- **Excellent Documentation**: Comprehensive guides and examples
- **Testing Infrastructure**: Free devnet with faucets

#### 4. **SPL Token Standard**
- **Battle-Tested**: Industry standard for Solana tokens
- **Feature-Rich**: Built-in support for minting, burning, freezing
- **Interoperability**: Works with all Solana wallets and DEXs
- **Similar to ERC-20**: Familiar patterns for Web3 developers

### Comparison with Alternatives

| Feature | Solana | Ethereum | BSC |
|---------|--------|----------|-----|
| TPS | 65,000+ | ~15 | ~160 |
| Block Time | 400ms | 13s | 3s |
| Avg Fee | $0.00025 | $5-50 | $0.05-0.50 |
| Token Standard | SPL | ERC-20 | BEP-20 |
| Language | Rust/JS | Solidity | Solidity |
| Testnet Faucet | Free, instant | Limited | Available |

---

## 🏗️ Design Decisions

### Architecture Choices

#### 1. **Modular Code Structure**

**Decision**: Separate utilities, core operations, and deployment scripts

**Reasoning**:
- **Maintainability**: Easy to locate and modify specific functionality
- **Reusability**: Utility modules can be used across multiple scripts
- **Testing**: Individual components can be tested in isolation
- **Clarity**: Clear separation of concerns

**Implementation**:
```
code/
  ├── utils/          # Reusable utilities
  ├── *.js           # Main operations (create, mint, transfer)
deployment/
  ├── scripts/       # Helper scripts
  └── *.json        # Configuration and data
```

#### 2. **Configuration Management**

**Decision**: Centralized configuration in `config.js`

**Reasoning**:
- Single source of truth for network and token settings
- Easy switching between devnet/testnet/mainnet
- Prevents hardcoded values scattered across codebase
- Simplifies deployment to different environments

**Benefits**:
- Change network with one line
- Update token metadata in one place
- Environment-specific configurations

#### 3. **Wallet Management**

**Decision**: File-based wallet storage with JSON format

**Reasoning**:
- **Compatibility**: Standard format used by Solana CLI
- **Portability**: Easy to import into wallets (Phantom, Solflare)
- **Simplicity**: No database required
- **Security**: Can be easily encrypted or moved to secure storage

**Security Considerations**:
- Files excluded from Git via .gitignore
- Clear documentation on backup procedures
- Easy migration to hardware wallets for production

#### 4. **Error Handling**

**Decision**: Comprehensive try-catch blocks with user-friendly messages

**Reasoning**:
- **User Experience**: Clear error messages guide users to solutions
- **Debugging**: Detailed error context for troubleshooting
- **Graceful Degradation**: Failures don't crash the application
- **Educational**: Errors teach users about blockchain concepts

**Example**:
```javascript
if (balance === 0) {
    console.log('⚠️  WARNING: Wallet has no SOL!');
    console.log('Get free SOL from: https://faucet.solana.com/');
    console.log(`Your address: ${address}`);
    return;
}
```

#### 5. **Transaction Logging**

**Decision**: JSON-based transaction logs with detailed metadata

**Reasoning**:
- **Auditability**: Complete history of all operations
- **Analytics**: Can analyze token usage patterns
- **Recovery**: Helps recover from errors or disputes
- **Compliance**: May be required for regulatory purposes

**Log Contents**:
- Transaction type and signature
- Sender and recipient addresses
- Amount and timestamp
- All stored in structured JSON format

#### 6. **Decimal Precision**

**Decision**: 9 decimals (Solana standard)

**Reasoning**:
- **Consistency**: Matches SOL's precision
- **Flexibility**: Allows for micro-transactions
- **Standard**: Expected by Solana ecosystem tools
- **Future-Proof**: Can represent very small values

**Calculation**:
```
1 token = 1,000,000,000 base units
0.000000001 tokens = 1 base unit (smallest transferable amount)
```

### Technology Stack Rationale

#### JavaScript/Node.js

**Why not other languages?**

- **Accessibility**: Most developers know JavaScript
- **Ecosystem**: Rich npm package ecosystem
- **Official Support**: Solana provides first-class JS libraries
- **Rapid Development**: Quick prototyping and iteration
- **Web Integration**: Easy to build web interfaces later

**Alternatives Considered**:
- **Rust**: More performant but steeper learning curve
- **Python**: Good libraries but slower performance
- **TypeScript**: Would add type safety (could be future enhancement)

#### SPL Token vs Native Program

**Decision**: Use SPL Token standard rather than custom program

**Reasoning**:
- **Security**: Battle-tested, audited code
- **Compatibility**: Works with all Solana infrastructure
- **Development Speed**: Pre-built functionality
- **Community Support**: Extensive documentation and help
- **Best Practices**: Industry-standard patterns

---

## ✨ Features

### Core Functionality

- **Token Creation**: Deploy new SPL tokens with custom metadata
- **Minting**: Create and distribute tokens to addresses
- **Transfers**: Send tokens between Solana wallets
- **Balance Checking**: Query token holdings for any address
- **Transaction Logging**: Complete audit trail of operations

### Developer Features

- **Network Flexibility**: Switch between devnet/testnet/mainnet
- **Wallet Management**: Automated wallet creation and loading
- **Error Handling**: Comprehensive error messages and recovery
- **Explorer Integration**: Direct links to blockchain explorers
- **Modular Design**: Reusable components and utilities

### Security Features

- **Authority Control**: Configurable mint and freeze authorities
- **Input Validation**: All user inputs are validated
- **Balance Verification**: Checks before transfers
- **Transaction Confirmation**: Waits for blockchain confirmation
- **Private Key Security**: Wallet files excluded from version control

---

## 📁 Project Structure

```
tokenizer/
│
├── README.md                      # This file - project overview
├── package.json                   # Node.js dependencies
│
├── code/                          # Main source code
│   ├── create_token.js           # Create new SPL token
│   ├── mint_tokens.js            # Mint tokens to accounts
│   ├── get_balance.js            # Check token balances
│   ├── transfer_tokens.js        # Transfer tokens
│   │
│   └── utils/                    # Utility modules
│       ├── config.js             # Network and token configuration
│       ├── connection.js         # Solana connection manager
│       └── wallet.js             # Wallet operations
│
├── deployment/                    # Deployment artifacts
│   ├── deploy_steps.md           # Detailed deployment guide
│   ├── token_mint_address.json   # Deployed token info (generated)
│   ├── payer-wallet.json         # Authority wallet (generated)
│   │
│   ├── scripts/                  # Deployment helper scripts
│   │   └── airdrop.js            # Request testnet SOL
│   │
│   └── transaction_logs/         # Transaction history (generated)
│       ├── mint_log.json
│       └── transfer_log.json
│
└── documentation/                 # Project documentation
    └── usage.md                  # Detailed usage guide
```

---

## 🔧 Installation

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn**
- Basic command line knowledge

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/eltitoyisus/tokenizer.git
   cd tokenizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   node code/create_token.js
   ```

---

## 🚀 Quick Start

### Step 1: Get Testnet SOL

After running the create script, you'll get a wallet address. Fund it with devnet SOL:

```bash
# Option 1: Use the airdrop script
node deployment/scripts/airdrop.js <YOUR_WALLET_ADDRESS> 2

# Option 2: Use the web faucet
# Visit: https://faucet.solana.com/
```

### Step 2: Create Your Token

```bash
node code/create_token.js
```

This will:
- Create a wallet (if doesn't exist)
- Deploy your token to Solana
- Save the mint address
- Display explorer links

### Step 3: Mint Some Tokens

```bash
node code/mint_tokens.js <YOUR_WALLET_ADDRESS> 1000
```

### Step 4: Check Balance

```bash
node code/get_balance.js <YOUR_WALLET_ADDRESS>
```

### Step 5: Transfer Tokens

```bash
node code/transfer_tokens.js payer-wallet.json <RECIPIENT_ADDRESS> 100
```

---

## 📖 Usage

### Creating a Token

```bash
node code/create_token.js
```

**What it does:**
1. Creates/loads payer wallet
2. Checks SOL balance for fees
3. Creates token mint on Solana
4. Saves deployment info
5. Displays next steps

### Minting Tokens

```bash
node code/mint_tokens.js <DESTINATION_ADDRESS> <AMOUNT>
```

**Example:**
```bash
node code/mint_tokens.js 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000
```

### Checking Balances

```bash
# Check Token42 balance
node code/get_balance.js <WALLET_ADDRESS>

# Check all token accounts
node code/get_balance.js <WALLET_ADDRESS> --all
```

### Transferring Tokens

```bash
node code/transfer_tokens.js <SENDER_WALLET_FILE> <RECIPIENT_ADDRESS> <AMOUNT>
```

**Example:**
```bash
node code/transfer_tokens.js payer-wallet.json 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin 100
```

### View Deployment Info

```bash
node deployment/testnet_mint_addr.js
```

---

## 🔒 Security

### Wallet Security

- **Never commit wallet files to Git** - Included in .gitignore
- **Backup your wallets securely** - Store encrypted copies
- **Use hardware wallets for mainnet** - Ledger, Phantom with hardware
- **Separate dev and production wallets** - Different wallets for testing

### Authority Management

- **Mint Authority**: Controls token creation
- **Freeze Authority**: Can freeze accounts
- **Transfer Authority**: Can be transferred to multisig
- **Revoke Authority**: Can be set to null for fixed supply

### Best Practices

1. Always test on devnet first
2. Verify all addresses before transactions
3. Keep small amounts in hot wallets
4. Monitor transactions on explorer
5. Review transaction logs regularly

---

## 📚 Documentation

- **[Usage Guide](documentation/usage.md)** - Comprehensive usage documentation
- **[Deployment Guide](deployment/deploy_steps.md)** - Step-by-step deployment instructions
- **Transaction Logs** - `deployment/transaction_logs/`

### External Resources

- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Guide](https://spl.solana.com/token)
- [Solana Cookbook](https://solanacookbook.com/)
- [Web3.js API Reference](https://solana-labs.github.io/solana-web3.js/)

---

## 🧪 Testing

### Devnet Testing

```bash
# 1. Ensure devnet is configured
# Check code/utils/config.js: NETWORK = 'devnet'

# 2. Get testnet SOL
node deployment/scripts/airdrop.js <YOUR_ADDRESS> 2

# 3. Create token
node code/create_token.js

# 4. Test minting
node code/mint_tokens.js <ADDRESS> 1000

# 5. Test transfers
node code/transfer_tokens.js payer-wallet.json <OTHER_ADDRESS> 100

# 6. Verify on explorer
node deployment/testnet_mint_addr.js
```

---

## 🎓 Educational Value

This project demonstrates understanding of:

### Blockchain Concepts
- Token standards and ERC-20/BEP-20/SPL equivalents
- Wallet management and key pairs
- Transaction signing and verification
- Block explorers and transaction tracking

### Solana-Specific Knowledge
- SPL Token Program architecture
- Associated Token Accounts
- Program Derived Addresses (PDAs)
- Solana's account model

### Software Engineering
- Modular code organization
- Error handling and user feedback
- Configuration management
- Documentation best practices
- Security considerations

---

## 🤝 Contributing

This is an educational project for 42 School. However, suggestions and improvements are welcome!

### Future Enhancements

Potential additions:
- [ ] TypeScript migration for type safety
- [ ] Web interface for token operations
- [ ] Multisig authority implementation (bonus)
- [ ] Token metadata with Metaplex
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Docker containerization

---

## 📝 License

This project is created for educational purposes as part of the 42 School curriculum.

---

## 👨‍💻 Author

**Jesus** (eltitoyisus)
- GitHub: [@eltitoyisus](https://github.com/eltitoyisus)

---

## 🙏 Acknowledgments

- **42 School** - For the project assignment and learning opportunity
- **BNB Chain** - For partnership and educational resources
- **Solana Foundation** - For excellent documentation and tools
- **Solana Community** - For support and resources

---

## 📞 Support

For issues or questions:
1. Check the [Usage Guide](documentation/usage.md)
2. Review [Deployment Steps](deployment/deploy_steps.md)
3. Examine transaction logs in `deployment/transaction_logs/`
4. Visit [Solana StackExchange](https://solana.stackexchange.com/)

---

**Note**: This token is deployed on testnet for educational purposes. Always test thoroughly before deploying to mainnet with real value.

*Built with ❤️ for Web3 education*
