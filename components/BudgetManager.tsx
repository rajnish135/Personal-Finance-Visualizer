"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useBudgets } from '@/context/BudgetContext';
import { useTransactions } from '@/context/TransactionsContext';
import { expenseCategories } from '@/constants/categories';
import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import type { Budget } from '@/context/BudgetContext';


export default function BudgetManager() {
  const { budgets, setBudget, deleteBudget, refreshBudgets } = useBudgets();
  const { refreshTransactions } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (budget: Budget) => {
    setEditingId(budget._id);
    setSelectedCategory(budget.category);
    setAmount(budget.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedCategory('');
    setAmount('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) {
      toast.error('Please select a category and enter an amount');
      return;
    }

    setIsLoading(true);
    try {
      await setBudget(selectedCategory, parseFloat(amount));
      toast.success(
        `${expenseCategories.find(c => c.value === selectedCategory)?.label} budget set to $${parseFloat(amount).toFixed(2)}`
      );
      setSelectedCategory('');
      setAmount('');
      setEditingId(null);
      refreshBudgets();
      refreshTransactions(); // Refresh transactions to update charts
    } 
    catch (error) {
      console.log(error)
      toast.error('Failed to set budget');
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success('Budget removed successfully');
      refreshBudgets();
      refreshTransactions(); // Refresh transactions to update charts
    } 
    catch (error) {
      console.log(error)
      toast.error('Failed to delete budget');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              disabled={!!editingId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Monthly Budget</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">↻</span>
                  {editingId ? 'Updating...' : 'Setting...'}
                </span>
              ) : (
                editingId ? 'Update Budget' : 'Set Budget'
              )}
            </Button>
            {editingId && (
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Current Budgets</h3>
          {budgets.length === 0 ? (
            <p className="text-gray-500">No budgets set for this month</p>
          ) : (
            <ul className="space-y-2">
              {budgets.map((budget) => (
                <li key={budget._id} className="flex justify-between items-center p-3 border rounded">
                  <div className="flex-1">
                    <span className="capitalize">
                      {expenseCategories.find(c => c.value === budget.category)?.label || budget.category}
                    </span>
                    <span className="block text-sm text-gray-500">
                      ${budget.amount.toFixed(2)} per month
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(budget)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(budget._id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}