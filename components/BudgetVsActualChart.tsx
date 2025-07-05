"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionsContext';
import { useBudgets } from '@/context/BudgetContext';
import { expenseCategories } from '@/constants/categories';

export default function BudgetVsActualChart() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Calculate actual expenses by category for current month
  const actualExpenses = transactions
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

  // Merge with budget data for current month
  const chartData = expenseCategories.map(category => {
    const budget = budgets.find(b => 
      b.category === category.value && 
      b.month === currentMonth && 
      b.year === currentYear
    );
    const actual = actualExpenses[category.value] || 0;
    
    return {
      name: category.label,
      budget: budget?.amount || 0,
      actual,
      difference: (budget?.amount || 0) - actual
    };
  }).filter(item => item.budget > 0); // Only show categories with budgets

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual ({currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value}`, 
                    name === 'budget' ? 'Income' : 
                    name === 'actual' ? 'Expenses' : 'Remaining'
                  ]}
                />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Income" />
                <Bar dataKey="actual" fill="#82ca9d" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : 
          (
            <p className="text-center text-gray-500">
              No budget data available for {currentDate.toLocaleString('default', { month: 'long' })}. Set budgets to see comparison.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}