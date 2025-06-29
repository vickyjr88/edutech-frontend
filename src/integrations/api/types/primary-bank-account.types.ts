import type { Bank } from './bank-accounts.types';

export interface PrimaryBankAccount {
  _id: string;
  accountHolderName: string;
  maskedAccountNumber: string;
  bank: Bank;
  accountType: string;
  isPrimary: boolean;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  addedDate: string;
  successfulTransactions: number;
  failedTransactions: number;
}