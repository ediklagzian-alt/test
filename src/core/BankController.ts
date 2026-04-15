import { Client } from './models/Client';
import { Account } from './models/Account';
import { IBankUI } from './IBankUI';

export class BankController {
  private system: any; // We'll use the singleton BankSystem.getInstance()
  private ui: IBankUI;
  private currentClient: Client | null = null;
  private currentAccount: Account | null = null;

  constructor(ui: IBankUI, system: any) {
    this.ui = ui;
    this.system = system;
  }

  setClient(client: Client) {
    this.currentClient = client;
    this.refreshUI();
  }

  setAccount(account: Account) {
    this.currentAccount = account;
    this.refreshUI();
  }

  refreshUI() {
    if (!this.currentClient) return;

    const accounts = this.system.getClientAccounts(this.currentClient);
    this.ui.updateAccounts(accounts);

    if (this.currentAccount) {
      this.ui.updateBalance(this.currentAccount.balance);
      const txs = this.system.getTransactions(this.currentAccount.id);
      this.ui.updateTransactions(txs);
    }
  }

  transfer(targetId: string, amount: number): boolean {
    if (!this.currentAccount) return false;
    const sanitizedTargetId = targetId.replace(/\s/g, '');

    if (sanitizedTargetId === this.currentAccount.id) {
        this.ui.showMessage('Нельзя перевести на тот же счет', 'error');
        return false;
    }
    
    const target = this.system.getAccount(sanitizedTargetId);
    if (!target) {
        this.ui.showMessage(`Счет ${targetId} не найден`, 'error');
        return false;
    }

    const success = this.system.executeTransaction('Перевод', this.currentAccount.id, amount, sanitizedTargetId);
    if (success) {
      this.ui.showMessage(`Перевод ${amount} ₽ выполнен`, 'success');
      this.refreshUI();
      return true;
    } else {
      this.ui.showMessage('Ошибка: недостаточно средств или превышен лимит сомнительного счета', 'error');
      return false;
    }
  }

  deposit(amount: number): boolean {
    if (!this.currentAccount) return false;
    if (amount <= 0) {
        this.ui.showMessage('Сумма должна быть больше 0', 'error');
        return false;
    }
    const success = this.system.executeTransaction('Пополнение', this.currentAccount.id, amount);
    if (success) {
      this.ui.showMessage(`Счет пополнен на ${amount} ₽`, 'success');
      this.refreshUI();
      return true;
    }
    return false;
  }

  withdraw(amount: number): boolean {
    if (!this.currentAccount) return false;
    if (amount <= 0) {
        this.ui.showMessage('Сумма должна быть больше 0', 'error');
        return false;
    }
    const success = this.system.executeTransaction('Снятие', this.currentAccount.id, amount);
    if (success) {
      this.ui.showMessage(`Снятие ${amount} ₽ выполнено`, 'success');
      this.refreshUI();
      return true;
    } else {
      this.ui.showMessage('Ошибка: недостаточно средств или лимит превышен', 'error');
      return false;
    }
  }

  undo(txId: string) {
    const success = this.system.undoTransaction(txId);
    if (success) {
      this.ui.showMessage('Транзакция отменена', 'success');
      this.refreshUI();
    } else {
      this.ui.showMessage('Не удалось отменить транзакцию', 'error');
    }
  }
}
