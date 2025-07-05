export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description?: string;
  type: 'income' | 'expense';
  category: string;
}

export type NewTransaction = Omit<Transaction, '_id' | 'date'>;