import "dotenv/config";

export const config = {
  hdWalletMnemonic: process.env.HD_WALLET_MNEMONIC,
  rpcProviderUrl: process.env.RPC_PROVIDER_URL,
  oracleContractAddress: process.env.ORACLE_CONTRACT_ADDRESS,
  walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
};
