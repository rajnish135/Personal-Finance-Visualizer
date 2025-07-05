"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionsContext';

export default function MonthlyExpensesChart() {
  const { transactions } = useTransactions();

  const data = transactions.reduce((acc: Record<string, {income: number, expenses: number}>, t) => {
    const date = new Date(t.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      acc[monthYear].income += t.amount;
    } else {
      acc[monthYear].expenses += t.amount;
    }
    return acc;
  }, {});

  const chartData = Object.keys(data)
    .sort()
    .map(key => ({
      month: new Date(key).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: data[key].income,
      expenses: data[key].expenses,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, name === 'income' ? 'Income' : 'Expenses']}
                />
                <Bar dataKey="income" fill="#4ade80" name="Income" />
                <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}