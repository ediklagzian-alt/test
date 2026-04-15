import { UserAccount, BankOperationResult } from './types';

/**
 * Interface for the UI implementation (Bridge Pattern)
 */
export interface IBankUI {
  render(account: UserAccount | null): void;
  showMessage(result: BankOperationResult): void;
  setController(controller: any): void;
}
