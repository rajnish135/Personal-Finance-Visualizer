import { TransactionsProvider } from '@/context/TransactionsContext';
import { BudgetProvider } from '@/context/BudgetContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finance Visualizer',
  description: 'Track your personal finances',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} app-bg-gradient`}>
        <TransactionsProvider>
          <BudgetProvider>
            {children}
          </BudgetProvider>
        </TransactionsProvider>
      </body>
    </html>
  );
}