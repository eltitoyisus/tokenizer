# Cómo Fondear las Wallets de Prueba

Las wallets de prueba necesitan SOL para pagar las transacciones. Aquí están las formas de fondearlas:

## 🎯 Wallets a Fondear

### 1. Wallet Principal (Payer)
**Dirección**: `BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV`
- Necesita: **2 SOL** mínimo
- Uso: Crear tokens, mintear, pagar fees

### 2. Wallet Secundaria (Recipient)
**Dirección**: `9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx`
- Necesita: **1 SOL** (opcional, solo para testing)
- Uso: Recibir tokens, probar transferencias

---

## 💰 Métodos para Fondear

### Método 1: Faucet Web de Solana (RECOMENDADO)

1. **Ir al faucet oficial**:
   - Devnet: https://faucet.solana.com/
   
2. **Seleccionar la red**:
   - Elegir "Devnet" en el dropdown

3. **Pegar la dirección de la wallet**:
   ```
   BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV
   ```

4. **Confirmar CAPTCHA** y hacer clic en "Confirm Airdrop"

5. **Repetir para la segunda wallet** (opcional):
   ```
   9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx
   ```

### Método 2: Script de Airdrop (Si funciona)

```bash
# Fondear wallet principal
node deployment/scripts/airdrop.js BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV 2

# Fondear wallet secundaria
node deployment/scripts/airdrop.js 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx 1
```

**Nota**: Si el script falla con "Internal error", usa el Método 1 (Faucet Web).

### Método 3: QuickNode Faucet (Alternativa)

1. Ir a: https://faucet.quicknode.com/solana/devnet
2. Pegar la dirección: `BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV`
3. Completar verificación
4. Recibir SOL

### Método 4: Solana CLI (Si tienes instalado)

```bash
# Configurar devnet
solana config set --url devnet

# Airdrop a wallet principal
solana airdrop 2 BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV

# Airdrop a wallet secundaria
solana airdrop 1 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx
```

---

## ✅ Verificar Balance

### Usando el Script

```bash
# Verificar wallet principal
node code/get_balance.js BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV

# Verificar wallet secundaria
node code/get_balance.js 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx
```

### Usando Solana Explorer

1. **Devnet Explorer**: 
   - Payer: https://explorer.solana.com/address/BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV?cluster=devnet
   - Recipient: https://explorer.solana.com/address/9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx?cluster=devnet

2. Verás el balance en SOL en la parte superior

---

## 🔄 Problemas Comunes

### "Rate limit exceeded" o "429 Error"
**Solución**: Los faucets tienen límites. Espera unos minutos o usa otro faucet.

### "Internal error" en el script
**Solución**: Usa el faucet web (Método 1) en lugar del script.

### "Insufficient funds" al crear token
**Solución**: Necesitas al menos 0.01 SOL. Fondea más desde el faucet.

### Balance no aparece
**Solución**: Espera 30-60 segundos y vuelve a verificar. A veces la red tarda.

---

## 📊 Cuánto SOL Necesito?

| Operación | Costo Aproximado |
|-----------|------------------|
| Crear Token | ~0.002 SOL |
| Crear Token Account | ~0.00203 SOL |
| Mint Tokens | ~0.000005 SOL |
| Transfer Tokens | ~0.000005 SOL |

**Recomendado**: 2 SOL en la wallet principal es más que suficiente para todo el proyecto.

---

## 🚀 Una Vez Fondeadas

Después de fondear las wallets, puedes:

```bash
# 1. Crear tu token
node code/create_token.js

# 2. Mintear tokens
node code/mint_tokens.js BqNDcwUmtk5yCbTSwkRqjPEn7rCq52Pt8EHgwTfdhDwV 1000

# 3. Transferir tokens
node code/transfer_tokens.js payer-wallet.json 9RtdH3ZppgGXGnF88cXv9FgvP2w5jJajJ8FvdbsKBvQx 100
```

---

## ⚠️ Importante

- ✅ Estas wallets son **públicas** y solo para **devnet/testnet**
- ✅ Los fondos NO tienen valor real
- ✅ Otros pueden usar estas wallets (están en el código público)
- ✅ NUNCA uses estas wallets en mainnet

---

*Última actualización: Diciembre 2025*
