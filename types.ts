
export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: string;
  userId: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  amount: number;
  type: CategoryType;
  categoryId: string;
  categoryName: string;
  date: string;
  note: string;
}

export interface AppState {
  accounts: BankAccount[];
  transactions: Transaction[];
  isDemoMode: boolean;
}
