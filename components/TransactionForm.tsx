"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { incomeCategories, expenseCategories } from '@/constants/categories';
import { useTransactions } from '@/context/TransactionsContext';
import { useBudgets } from '@/context/BudgetContext';
import { toast } from 'sonner';
import type { NewTransaction } from '@/types';

interface TransactionFormProps {
  initialData?: NewTransaction & { _id?: string };
  onCancel?: () => void;
}

export default function TransactionForm({ initialData, onCancel }: TransactionFormProps) {
  const { addTransaction, updateTransaction, refreshTransactions } = useTransactions();
  const { refreshBudgets } = useBudgets();
  const [formData, setFormData] = useState({
    amount: initialData?.amount?.toString() || '',
    description: initialData?.description || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData?._id;

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.type || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    
    const transactionData: NewTransaction = {
      amount: parseFloat(formData.amount),
      description: formData.description || undefined,
      type: formData.type as 'income' | 'expense',
      category: formData.category
    };

    try {
      if (isEditing && initialData?._id) {
        await updateTransaction(initialData._id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      setFormData({
        amount: '',
        description: '',
        type: 'expense',
        category: '',
      });

      // Refresh all data
      refreshTransactions();
      refreshBudgets();

      if (onCancel) onCancel();
    } 
    catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} transaction:`, error);
    } 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type*</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({
              ...formData,
              type: value as 'income' | 'expense',
              category: ''
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category*</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            disabled={!formData.type}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {currentCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="amount">Amount*</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">↻</span>
              {isEditing ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            isEditing ? 'Update Transaction' : 'Add Transaction'
          )}
        </Button>
        {isEditing && (
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}