export interface Bank {
  _id: string;
  bankName: string;
  bankCode: string;
  branches: string[];
  country: string;
}

export interface TeacherBankAccount {
  _id: string;
  accountHolderName: string;
  maskedAccountNumber: string;
  bank: Bank;
  accountType: 'current' | 'savings' | 'business';
  isPrimary: boolean;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed' | 'rejected';
  addedDate: string;
  successfulTransactions: number;
  failedTransactions: number;
}

export interface AddBankAccountRequest {
  accountHolderName: string;
  accountNumber: string;
  bank: string; // Bank ID
  accountType: 'current' | 'savings' | 'business';
  isPrimary: boolean;
}

export interface UpdateBankAccountRequest {
  accountHolderName?: string;
  accountNumber?: string;
  bank?: string; // Bank ID
  accountType?: 'current' | 'savings' | 'business';
  isPrimary?: boolean;
  isActive?: boolean;
}