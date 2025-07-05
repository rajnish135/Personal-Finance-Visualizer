"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TransactionForm from './TransactionForm';
import { useTransactions } from '@/context/TransactionsContext';
import { incomeCategories, expenseCategories } from '@/constants/categories';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [editingId, setEditingId] = useState<string | null>(null);

  const getCategoryLabel = (categoryValue: string) => {
    const allCategories = [...incomeCategories, ...expenseCategories];
    const found = allCategories.find(c => c.value === categoryValue);
    return found ? found.label : categoryValue;
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });
      deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="p-4 border rounded">
              {editingId === transaction._id ? (
                <TransactionForm
                  initialData={transaction}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getCategoryLabel(transaction.category)}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(transaction._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(transaction._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}