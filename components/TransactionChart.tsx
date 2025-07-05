"use client";

interface ChartData {
  name: string;
  total: number;
}

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/context/TransactionsContext';
import { useEffect, useState } from 'react';

export default function TransactionChart() {
  const { transactions } = useTransactions();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Process transactions into chart data format
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).getMonth();
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    }, {} as Record<number, number>);

    const data = Object.entries(monthlyData).map(([month, total]) => ({
      name: new Date(0, parseInt(month)).toLocaleString('default', { month: 'short' }),
      total
    }));

    setChartData(data);
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}