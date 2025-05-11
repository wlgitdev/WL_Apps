import { TransactionForecast, BankAccount, BankAccountNamingScheme } from '@wl-apps/types';
import { useState, useEffect, useCallback } from 'react';
import { bankAccountApi } from "@api/PF/bankAccount";
import { ForecastChart } from '@components/PF/ForecastChart';

const BankAccountList: React.FC<{
  selectedAccount?: string;
  onSelect: (accountId: string) => void;
}> = ({ selectedAccount, onSelect }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const data = await bankAccountApi.getAll();
      setAccounts(data);
      // Select first account by default if none selected

      const selection = data[0] || {} as BankAccount; 
      if (!selectedAccount && data.length > 0 && selection.recordId) {
        onSelect(selection.recordId);
      }
    };
    fetchAccounts();
  }, [selectedAccount, onSelect]);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">{BankAccountNamingScheme.PLURAL}</h2>
      <div className="space-y-2">
        {accounts.map((account) => (
          <button
            key={account.recordId}
            onClick={() => account.recordId && onSelect(account.recordId)}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${selectedAccount === account.recordId
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
          >
            <div className="font-medium">{account.name || `Account ${account.recordId}`} ({account.balance})</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [forecast, setForecast] = useState<TransactionForecast[]>();

  const handleAccountSelect = useCallback((accountId: string) => {
    setSelectedAccount(accountId);
  }, []);

  // Set default end date to end of next month
  useEffect(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 2, 0); // Last day of next month
    setEndDate(date.toISOString().split('T')[0]);
  }, []);

  // Fetch forecast data when account or end date changes
  useEffect(() => {
    const fetchForecast = async () => {
      if (!selectedAccount || !endDate) return;

      const data = await bankAccountApi.generateForecast(
        selectedAccount,
        new Date(),
        new Date(endDate)
      );

      setForecast(data);
    };

    fetchForecast();
  }, [selectedAccount, endDate]);

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Date Picker Header */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-4">
            <label className="font-medium">Forecast End Date:</label>
            <input
              type="date"
              value={endDate || ''}
              min={today}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-4 gap-6">
          {/* Account List */}
          <div className="col-span-1">
            <BankAccountList
              selectedAccount={selectedAccount}
              onSelect={handleAccountSelect}
            />
          </div>

          {/* Chart */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            {forecast ? (
              <ForecastChart data={forecast} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Select an account to view forecast
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;