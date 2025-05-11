import { ReactNode } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Dropdown, DropdownItem } from '@components/common/Dropdown';
import { BankAccountNamingScheme, TransactionCategoryNamingScheme, TransactionNamingScheme } from '@wl-apps/types';
import { BankAccountsPage, TransactionCategoriesPage, TransactionsPage } from '@pages/PF';
import DashboardPage from './DashboardPage';

const PFLayout = ({ children }: { children: ReactNode }) => {
  const SettingsTrigger = (
    <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
      Settings
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">PF Manager</h1>
              </div>
              <div className="ml-6 flex space-x-4 items-center">
                <Link
                  to="/pf/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                
                <Dropdown trigger={SettingsTrigger}>
                  <Link to="/pf/bank-accounts">
                    <DropdownItem>{BankAccountNamingScheme.PLURAL}</DropdownItem>
                  </Link>
                  <Link to="/pf/transaction-categories">
                    <DropdownItem>{TransactionCategoryNamingScheme.PLURAL}</DropdownItem>
                  </Link>
                  <Link to="/pf/transactions">
                    <DropdownItem>{TransactionNamingScheme.PLURAL}</DropdownItem>
                  </Link>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export const PFPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PFLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-6">PF Manager</h2>
            </div>
          </PFLayout>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <PFLayout>
            <DashboardPage />
          </PFLayout>
        } 
      />
      <Route 
        path="/bank-accounts" 
        element={
          <PFLayout>
            <BankAccountsPage />
          </PFLayout>
        } 
      />
      <Route 
        path="/transaction-categories" 
        element={
          <PFLayout>
            <TransactionCategoriesPage />
          </PFLayout>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <PFLayout>
            <TransactionsPage />
          </PFLayout>
        } 
      />
    </Routes>
  );
};

export default PFPage;