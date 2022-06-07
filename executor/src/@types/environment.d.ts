declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HD_WALLET_MNEMONIC: string;
      RPC_PROVIDER_URL: string;
      ORACLE_CONTRACT_ADDRESS: string;
      WALLET_PRIVATE_KEY: string;
    }
  }
}

export {};
