import { Client, ClientData } from './models/Client';
import { Account, DebitAccount, DepositAccount, CreditAccount } from './models/Account';
import { BankTransaction, TransactionType, ITransaction } from './models/Transaction';

export class BankSystem {
  private clients: Client[] = [];
  private accounts: Account[] = [];
  private transactions: ITransaction[] = [];
  private static instance: BankSystem;

  private constructor() {
    // Создаем системный счет для тестов
    const systemClient = new Client({ firstName: 'Система', lastName: 'Vadim-Bank' });
    const systemAcc = new DebitAccount('1111111111111111', systemClient);
    systemAcc.deposit(1000000);
    this.accounts.push(systemAcc);
  }

  public static getInstance(): BankSystem {
    if (!BankSystem.instance) {
      BankSystem.instance = new BankSystem();
    }
    return BankSystem.instance;
  }

  createClient(data: ClientData): Client {
    const client = new Client(data);
    this.clients.push(client);
    return client;
  }

  createAccount(type: 'debit' | 'deposit' | 'credit', owner: Client): Account {
    const id = (Math.floor(Math.random() * 9000000000000000) + 1000000000000000).toString();
    let account: Account;

    switch (type) {
      case 'debit':
        account = new DebitAccount(id, owner);
        break;
      case 'deposit':
        account = new DepositAccount(id, owner);
        break;
      case 'credit':
        account = new CreditAccount(id, owner);
        break;
    }

    this.accounts.push(account);
    return account;
  }

  private sanitizeId(id: string): string {
    return id.replace(/\s/g, '');
  }

  getAccount(id: string): Account | undefined {
    return this.accounts.find(a => a.id === this.sanitizeId(id));
  }

  getClientAccounts(client: Client): Account[] {
    return this.accounts.filter(a => a.owner === client);
  }

  executeTransaction(type: TransactionType, sourceId: string, amount: number, targetId?: string): boolean {
    if (amount <= 0) return false;
    
    const source = this.getAccount(sourceId);
    if (!source) return false;

    let success = false;
    let target: Account | undefined;

    switch (type) {
      case TransactionType.Deposit:
        source.deposit(amount);
        success = true;
        break;
      case TransactionType.Withdraw:
        // Проверка баланса уже есть внутри source.withdraw, 
        // но здесь мы получаем результат (true/false)
        success = source.withdraw(amount);
        break;
      case TransactionType.Transfer:
        target = targetId ? this.getAccount(targetId) : undefined;
        if (target && target.id !== source.id) {
          success = source.transfer(amount, target);
        }
        break;
    }

    if (success) {
      const transaction = new BankTransaction(type, amount, source, target);
      this.transactions.push(transaction);
    }

    return success;
  }

  getTransactions(accountId?: string): ITransaction[] {
    if (!accountId) return this.transactions;
    return this.transactions.filter(t => t.sourceId === accountId || t.targetId === accountId);
  }

  undoTransaction(transactionId: string): boolean {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status === 'undone') return false;
    
    transaction.undo();
    return true;
  }
}
