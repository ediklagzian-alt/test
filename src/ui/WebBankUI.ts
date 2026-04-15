import { IBankUI } from '../core/IBankUI';
import { Account } from '../core/models/Account';
import { ITransaction } from '../core/models/Transaction';

export class WebBankUI implements IBankUI {
  private setBalance: (balance: number) => void;
  private setAccountsList: (accounts: Account[]) => void;
  private setTransactionsList: (txs: ITransaction[]) => void;
  private notify: (msg: string, type: 'success' | 'error') => void;

  constructor(
    setBalance: (balance: number) => void,
    setAccountsList: (accounts: Account[]) => void,
    setTransactionsList: (txs: ITransaction[]) => void,
    notify: (msg: string, type: 'success' | 'error') => void
  ) {
    this.setBalance = setBalance;
    this.setAccountsList = setAccountsList;
    this.setTransactionsList = setTransactionsList;
    this.notify = notify;
  }

  updateBalance(balance: number): void {
    this.setBalance(balance);
  }

  updateAccounts(accounts: Account[]): void {
    this.setAccountsList(accounts);
  }

  updateTransactions(transactions: ITransaction[]): void {
    this.setTransactionsList(transactions);
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.notify(message, type);
  }
}
