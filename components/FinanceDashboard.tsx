"use client";

import TransactionForm from './TransactionForm';
import TransactionChart from './TransactionChart';
import TransactionList from './TransactionList';
import BudgetManager from './BudgetManager';

export default function FinanceDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 space-y-4">
        <TransactionForm />
        <BudgetManager />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <TransactionChart />
        <TransactionList />
      </div>
    </div>
  );
}