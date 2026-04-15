import { Account } from './models/Account';
import { ITransaction } from './models/Transaction';

export interface IBankUI {
  updateBalance(balance: number): void;
  updateAccounts(accounts: Account[]): void;
  updateTransactions(transactions: ITransaction[]): void;
  showMessage(message: string, type: 'success' | 'error'): void;
}
