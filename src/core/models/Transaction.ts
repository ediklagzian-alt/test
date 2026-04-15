import { Account } from './Account';

export enum TransactionType {
  Deposit = 'Пополнение',
  Withdraw = 'Снятие',
  Transfer = 'Перевод',
}

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  sourceId: string;
  targetId?: string;
  date: Date;
  status: 'active' | 'undone';
  undo(): void;
}

export class BankTransaction implements ITransaction {
  public id: string;
  public date: Date;
  public status: 'active' | 'undone' = 'active';

  constructor(
    public type: TransactionType,
    public amount: number,
    public sourceAccount: Account,
    public targetAccount?: Account
  ) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.date = new Date();
  }

  get sourceId(): string {
    return this.sourceAccount.id;
  }

  get targetId(): string | undefined {
    return this.targetAccount?.id;
  }

  undo(): void {
    if (this.status === 'undone') return;

    switch (this.type) {
      case TransactionType.Deposit:
        this.sourceAccount.balance -= this.amount;
        break;
      case TransactionType.Withdraw:
        this.sourceAccount.balance += this.amount;
        break;
      case TransactionType.Transfer:
        if (this.targetAccount) {
          this.sourceAccount.balance += this.amount;
          this.targetAccount.balance -= this.amount;
        }
        break;
    }

    this.status = 'undone';
  }
}
