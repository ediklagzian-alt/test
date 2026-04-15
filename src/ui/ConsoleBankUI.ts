import { IBankUI } from '../core/IBankUI';
import { Account } from '../core/models/Account';
import { ITransaction } from '../core/models/Transaction';

/**
 * Пример консольной реализации интерфейса.
 * Демонстрирует паттерн "Мост": мы можем заменить WebBankUI на ConsoleBankUI
 * без изменения логики BankController.
 */
export class ConsoleBankUI implements IBankUI {
  updateBalance(balance: number): void {
    console.log(`[Console UI] Текущий баланс: ${balance} RUB`);
  }

  updateAccounts(accounts: Account[]): void {
    console.log(`[Console UI] Список счетов обновлен. Всего счетов: ${accounts.length}`);
    accounts.forEach(acc => console.log(` - ${acc.id}: ${acc.balance} (${acc.getType()})`));
  }

  updateTransactions(transactions: ITransaction[]): void {
    console.log(`[Console UI] История транзакций обновлена (всего: ${transactions.length}).`);
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    console.log(`[Console UI] ${type.toUpperCase()}: ${message}`);
  }
}
