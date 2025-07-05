import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import SummaryCards from '@/components/SummaryCards';
import BudgetVsActualChart from '@/components/BudgetVsActualChart';
import BudgetManager from '@/components/BudgetManager';
import SpendingInsights from '@/components/SpendingInsights';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      
      <h1 className="text-3xl font-bold mb-8">Personal Finance Visualizer</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <BudgetManager />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <TransactionList />
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <SummaryCards />
          <SpendingInsights />
          <MonthlyExpensesChart />
          <CategoryPieChart />
          <BudgetVsActualChart />
        </div>
      </div>
    </main>
  );
}