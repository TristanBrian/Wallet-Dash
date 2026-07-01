export type TransactionType = 'buy' | 'sell' | 'transfer' | 'swap';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  date: string;
  asset: string;
  network: string;
  type: TransactionType;
  amount: number;
  fee: number;
  status: TransactionStatus;
  hash: string;
}

export interface TransactionFilters {
  asset?: string;
  type?: TransactionType | '';
  status?: TransactionStatus | '';
  search?: string;
}
