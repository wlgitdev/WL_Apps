import { TransactionForecast, BankAccount, BankAccountNamingScheme } from '@wl-apps/types';
import { useState, useEffect } from 'react';
import { bankAccountApi } from "@api/PF/bankAccount";
import { ForecastChart } from '@components/PF/ForecastChart';
import { DynamicList, ListSchema } from '@wl-apps/schema-to-ui';

export const DashboardPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [forecast, setForecast] = useState<TransactionForecast[]>();

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

  const accountListSchema: ListSchema<BankAccount> = {
    columns: {
      name: {
        label: 'Name',
        field: 'name',
        type: 'text',
        sortable: true,
        filterable: true
      },
      balance: {
        label: 'Balance',
        field: 'balance',
        type: 'number',
        sortable: true,
      },
    },
    options: {
      selection: {
        enabled: true,
        type: 'single',
        onSelect: (rows) => {
          if (rows[0]?.recordId) {
            setSelectedAccount(rows[0].recordId);
          }
        },
      },
      pagination: {
        enabled: false,
      },
    },
  };

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
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">{BankAccountNamingScheme.PLURAL}</h2>
              <DynamicList<BankAccount>
                schema={accountListSchema}
                queryKey={['bankAccounts']}
                queryFn={bankAccountApi.getAll}
                initialRowSelection={selectedAccount ? { [selectedAccount]: true } : {}}
            />
            </div>
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