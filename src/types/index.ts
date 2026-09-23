export type TransactionType = "INCOME" | "EXPENSE";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface DashboardData {
  user: User;
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
}

export interface TransactionFilters {
  type?: TransactionType | "ALL";
  startDate?: Date;
  endDate?: Date;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  language: "id" | "en";
}
