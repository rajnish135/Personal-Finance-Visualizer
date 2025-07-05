"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

interface BudgetContextType {
  budgets: Budget[];
  fetchBudgets: () => Promise<void>;
  setBudget: (category: string, amount: number) => Promise<Budget>;
  deleteBudget: (id: string) => Promise<void>;
  refreshBudgets: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      const res = await fetch('/api/budgets');
      if (!res.ok) throw new Error('Failed to fetch budgets');
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budgets');
    }
  }, []);

  const refreshBudgets = useCallback(() => {
    setRefreshTrigger(prev => !prev);
  }, []);

  const setBudget = useCallback(async (category: string, amount: number) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, amount }),
      });
      
      if (!response.ok) throw new Error('Failed to set budget');
      
      const newBudget = await response.json();
      setBudgets(prev => {
        const existing = prev.find(b => b.category === category);
        return existing
          ? prev.map(b => b.category === category ? newBudget : b)
          : [...prev, newBudget];
      });
      toast.success('Budget set successfully');
      return newBudget;
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error('Failed to set budget');
      throw error;
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete budget');
      
      setBudgets(prev => prev.filter(b => b._id !== id));
      toast.success('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets, refreshTrigger]);

  return (
    <BudgetContext.Provider value={{ 
      budgets, 
      fetchBudgets, 
      setBudget,
      deleteBudget,
      refreshBudgets
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}