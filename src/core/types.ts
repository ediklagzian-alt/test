export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
  date: Date;
  description: string;
  from?: string;
  to?: string;
}

export interface UserAccount {
  id: string;
  ownerName: string;
  balance: number;
  transactions: Transaction[];
  accountNumber: string;
}

export type BankOperationResult = {
  success: boolean;
  message: string;
  data?: any;
};
