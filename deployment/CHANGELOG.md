# 🎯 Resumen: Wallets Fijas y Balance Mejorado

## ✅ Cambios Implementados

### 1. **Wallets Fijas de Prueba**
El proyecto ahora usa wallets fijas para devnet/testnet que NO cambian entre ejecuciones:

- **Wallet Payer (Principal)**: `JD346pPJM3WGCxu8i8H1XKMXWqW43UBcHNUSXRs8r16x`
- **Wallet Recipient (Secundaria)**: `45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B`

### 2. **Comando get_balance.js Mejorado**
Ahora puedes ver el balance de TODAS las wallets con un solo comando:

```bash
# Ver balance de TODAS las wallets (sin argumentos)
node code/get_balance.js

# Ver balance de una wallet específica
node code/get_balance.js <DIRECCION>
```

## 📋 Para Empezar a Usar

### Paso 1: Fondear las Wallets (una sola vez)

Usa el faucet web manual porque el automático tiene límite de rate:

1. Ve a: **https://faucet.solana.com/**
2. Selecciona **"Devnet"**
3. Fondea la wallet principal:
   - Pega: `JD346pPJM3WGCxu8i8H1XKMXWqW43UBcHNUSXRs8r16x`
   - Solicita 2 SOL
4. (Opcional) Fondea la wallet secundaria:
   - Pega: `45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B`
   - Solicita 1 SOL

### Paso 2: Verificar Fondeo

```bash
node code/get_balance.js
```

Deberías ver algo como:
```
╔═══════════════════════════════════════════════╗
║      Balances de Wallets de Prueba           ║
╚═══════════════════════════════════════════════╝

──────────────────────────────────────────────────
🔑 Payer (Principal)
──────────────────────────────────────────────────
Dirección: JD346pPJM3WGCxu8i8H1XKMXWqW43UBcHNUSXRs8r16x

💰 SOL Balance: 2.000000000 SOL
ℹ️  Token aún no creado

──────────────────────────────────────────────────
📥 Recipient (Secundaria)
──────────────────────────────────────────────────
Dirección: 45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B

💰 SOL Balance: 1.000000000 SOL
ℹ️  Token aún no creado
```

### Paso 3: Crear y Usar el Token

```bash
# 1. Crear token (usa wallet payer automáticamente)
node code/create_token.js

# 2. Verificar balances de nuevo
node code/get_balance.js

# 3. Mintear tokens a la wallet principal
node code/mint_tokens.js JD346pPJM3WGCxu8i8H1XKMXWqW43UBcHNUSXRs8r16x 1000

# 4. Mintear tokens a la wallet secundaria
node code/mint_tokens.js 45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B 500

# 5. Ver balances actualizados
node code/get_balance.js

# 6. Transferir entre wallets
node code/transfer_tokens.js payer-wallet.json 45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B 100
```

## 🔧 Archivos Modificados

1. **`code/utils/config.js`**
   - Agregadas wallets fijas en `TEST_WALLETS`
   
2. **`code/utils/wallet.js`**
   - Modificado `getOrCreateWallet()` para usar wallets fijas en devnet/testnet
   - Agregada función `createFixedWallet()`

3. **`code/get_balance.js`**
   - Agregada función `showAllTestWallets()` 
   - Ahora muestra TODAS las wallets cuando se ejecuta sin argumentos

4. **`deployment/scripts/fund_wallets.js`**
   - Actualizado para usar las direcciones del config dinámicamente

5. **Documentación actualizada**:
   - `README.md`
   - `documentation/usage.md`
   - `deployment/TEST_WALLETS.md`
   - `deployment/FUND_WALLETS.md`

## 🌟 Beneficios

✅ **Sin crear wallets nuevas cada vez** - Wallets consistentes  
✅ **Ver todo de un vistazo** - `node code/get_balance.js` muestra todo  
✅ **Fondeo una sola vez** - Reutiliza las mismas wallets  
✅ **Direcciones conocidas** - Fácil de recordar y documentar  
✅ **Testeo simplificado** - Mismo ambiente cada vez  

## ⚠️ Seguridad

- ✅ Wallets públicas en el código - **SOLO para devnet/testnet**
- ✅ Para mainnet, el sistema crea wallets únicas automáticamente
- ✅ No uses estas wallets con fondos reales

## 🔗 Enlaces Útiles

- **Faucet Solana**: https://faucet.solana.com/
- **Explorer Payer**: https://explorer.solana.com/address/JD346pPJM3WGCxu8i8H1XKMXWqW43UBcHNUSXRs8r16x?cluster=devnet
- **Explorer Recipient**: https://explorer.solana.com/address/45dJW7NG4TSSnG58Xp3XwskxWgryPBDpZTpLBbQPqU1B?cluster=devnet

---

*Última actualización: Diciembre 4, 2025*
