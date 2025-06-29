export interface TeacherBalance {
  totalEarnings: number;
  totalPayouts: number;
  totalRefunds: number;
  currentBalance: number;
}

export interface TeacherTransactionStudent {
  _id: string;
  user: {
    _id: string;
    fullName: string;
  };
}

export interface TeacherTransactionClass {
  _id: string;
  title: string;
}

export interface TeacherTransactionEnrollment {
  _id: string;
  student: TeacherTransactionStudent;
  class: TeacherTransactionClass;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherTransaction {
  _id: string;
  teacher: string;
  transactionType: 'earning' | 'payout' | 'refund';
  paymentType: 'card' | 'bank' | 'mobile';
  enrollments: TeacherTransactionEnrollment[];
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TeacherTransactionsQuery {
  page?: number;
  limit?: number;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionType?: 'earning' | 'payout' | 'refund';
  paymentType?: 'bank_transfer' | 'paypal' | 'check' | 'cash' | 'card';
  enrollment?: string; // MongoDB ObjectId of specific enrollment
}