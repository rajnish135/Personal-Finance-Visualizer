"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionsContext';
import { useBudgets } from '@/context/BudgetContext';
import { useEffect, useState } from 'react';
import { expenseCategories } from '@/constants/categories';

interface SpendingData {
  monthlyExpenses: number;
  totalBudget: number;
  utilization: number;
  mostSpentCategory?: {
    name: string;
    amount: number;
  };
}

export default function SpendingInsights() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const [spendingData, setSpendingData] = useState<SpendingData>({
    monthlyExpenses: 0,
    totalBudget: 0,
    utilization: 0
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Calculate monthly expenses for current month
    const monthlyExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (
          t.type === 'expense' && 
          tDate.getMonth() + 1 === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total budget for current month
    const totalBudget = budgets
      .filter(b => b.month === currentMonth && b.year === currentYear)
      .reduce((sum, b) => sum + b.amount, 0);

    // Calculate budget utilization
    const utilization = totalBudget > 0 ? (monthlyExpenses / totalBudget) * 100 : 0;

    // Find most spent category (current month only)
    const categorySpending = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (
          t.type === 'expense' && 
          tDate.getMonth() + 1 === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const mostSpentCategoryEntry = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])[0];

    const mostSpentCategory = mostSpentCategoryEntry ? {
      name: expenseCategories.find(c => c.value === mostSpentCategoryEntry[0])?.label || mostSpentCategoryEntry[0],
      amount: mostSpentCategoryEntry[1]
    } : undefined;

    setSpendingData({
      monthlyExpenses,
      totalBudget,
      utilization,
      mostSpentCategory
    });
  }, [transactions, budgets]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">This Month's Spending</h3>
          <p className="text-2xl font-bold mt-2">
            ${spendingData.monthlyExpenses.toFixed(2)}
          </p>
          {spendingData.totalBudget > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Budget Utilization</span>
                <span>{spendingData.utilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className={`h-2.5 rounded-full ${
                    spendingData.utilization > 90 ? 'bg-red-500' : 
                    spendingData.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, spendingData.utilization)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                ${spendingData.monthlyExpenses.toFixed(2)} of ${spendingData.totalBudget.toFixed(2)} spent
              </p>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium">Top Category This Month</h3>
          {spendingData.mostSpentCategory ? (
            <>
              <p className="text-xl font-medium mt-2">
                {spendingData.mostSpentCategory.name}
              </p>
              <p className="text-red-600">
                ${spendingData.mostSpentCategory.amount.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-gray-500 mt-2">No spending data this month</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}