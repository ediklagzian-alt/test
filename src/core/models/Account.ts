import { Client } from './Client';

export abstract class Account {
  public id: string;
  public balance: number = 0;
  public owner: Client;
  public createdAt: Date;
  protected bankDoubtfulLimit: number = 50000;

  constructor(id: string, owner: Client) {
    this.id = id;
    this.owner = owner;
    this.createdAt = new Date();
  }

  abstract withdraw(amount: number): boolean;
  abstract transfer(amount: number, target: Account): boolean;

  deposit(amount: number) {
    if (amount <= 0) return;
    this.balance += amount;
  }

  protected checkDoubtfulLimit(amount: number): boolean {
    if (amount <= 0) return false;
    if (this.owner.isDoubtful && amount > this.bankDoubtfulLimit) {
      return false; // Запрещено для сомнительных счетов
    }
    return true;
  }

  abstract getType(): string;
}

export class DebitAccount extends Account {
  withdraw(amount: number): boolean {
    if (!this.checkDoubtfulLimit(amount)) return false;
    if (this.balance < amount) return false;
    this.balance -= amount;
    return true;
  }

  transfer(amount: number, target: Account): boolean {
    if (!this.checkDoubtfulLimit(amount)) return false;
    if (this.balance < amount) return false;
    this.balance -= amount;
    target.deposit(amount);
    return true;
  }

  getType(): string { return 'Дебетовый'; }
}

export class DepositAccount extends Account {
  public lockUntil: Date;

  constructor(id: string, owner: Client, lockPeriodMonths: number = 12) {
    super(id, owner);
    const date = new Date();
    date.setMonth(date.getMonth() + lockPeriodMonths);
    this.lockUntil = date;
  }

  withdraw(amount: number): boolean {
    if (new Date() < this.lockUntil) return false; // Срок не вышел
    if (!this.checkDoubtfulLimit(amount)) return false;
    if (this.balance < amount) return false;
    this.balance -= amount;
    return true;
  }

  transfer(amount: number, target: Account): boolean {
    if (new Date() < this.lockUntil) return false; // Срок не вышел
    if (!this.checkDoubtfulLimit(amount)) return false;
    if (this.balance < amount) return false;
    this.balance -= amount;
    target.deposit(amount);
    return true;
  }

  getType(): string { return 'Депозит'; }
}

export class CreditAccount extends Account {
  public creditLimit: number;
  public commission: number;

  constructor(id: string, owner: Client, limit: number = -100000, commission: number = 500) {
    super(id, owner);
    this.creditLimit = limit;
    this.commission = commission;
  }

  withdraw(amount: number): boolean {
    if (!this.checkDoubtfulLimit(amount)) return false;
    const futureBalance = this.balance - amount;
    if (futureBalance < this.creditLimit) return false;
    
    this.balance = futureBalance;
    if (this.balance < 0) {
        this.balance -= this.commission;
    }
    return true;
  }

  transfer(amount: number, target: Account): boolean {
    if (!this.checkDoubtfulLimit(amount)) return false;
    const futureBalance = this.balance - amount;
    if (futureBalance < this.creditLimit) return false;

    this.balance = futureBalance;
    if (this.balance < 0) {
        this.balance -= this.commission;
    }
    target.deposit(amount);
    return true;
  }

  getType(): string { return 'Кредитный'; }
}
