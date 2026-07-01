export type WalletStatus = 'active' | 'inactive' | 'pending';

export interface Wallet {
  id: string;
  name: string;
  network: string;
  address: string;
  balance: number;
  usdValue: number;
  status: WalletStatus;
  assetSymbol: string;
}
