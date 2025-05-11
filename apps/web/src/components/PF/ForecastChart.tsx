import { TransactionForecast, TransactionDirection } from '@wl-apps/types';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Dot
} from 'recharts';
import { DynamicList, ListSchema } from '@wl-apps/schema-to-ui';

interface TransactionRow {
  recordId: string;
  date: Date;
  name: string;
  amount: number;
  direction: TransactionDirection;
  balance: number;
}

export const ForecastChart = ({ data }: { data: TransactionForecast[] }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Transform data for Recharts
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    balance: point.balance,
    originalPoint: point
  }));

  // Transform transactions for DynamicList
  const allTransactions: TransactionRow[] = data.flatMap((point, index) =>
    (point.transactions || []).map((tx, txIndex) => ({
      recordId: `${index}-${txIndex}`, // Generate unique ID for each transaction
      date: new Date(point.date),
      name: tx.name,
      amount: tx.amount,
      direction: tx.direction,
      balance: point.balance
    }))
  );

  // Define ListSchema for transactions
  const transactionListSchema: ListSchema<TransactionRow> = {
    columns: {
      date: {
        label: 'Date',
        field: 'date',
        type: 'date',
        sortable: true,
        filterable: true,
        format: {
          date: {
            format: 'DD MM'
          }
        }
      },
      name: {
        label: 'Description',
        field: 'name',
        type: 'text',
        sortable: true,
        filterable: true
      },
      amount: {
        label: 'Amount',
        field: 'amount',
        type: 'number',
        sortable: true,
        filterable: true,
        format: {
          number: {
            precision: 2,
          }
        }
      },
      balance: {
        label: 'Balance',
        field: 'balance',
        type: 'number',
        sortable: true,
        format: {
          number: {
            precision: 2,
          }
        }
    }
    },
    options: {
      defaultSort:  {
        field: 'date',
        direction: 'asc'
      },
      selection: {
        enabled: true,
        type: 'single',
        onSelect: (selectedRows) => {
          if (selectedRows.length > 0 && selectedRows[0]) {
            setSelectedDate(selectedRows[0].date);
          } else {
            setSelectedDate(null);
          }
        }
      },
      pagination: {
        enabled: true,
        pageSize: 10000,

      }
    }
  };

  // Custom query function for DynamicList
  const queryFn = async () => {
    return allTransactions.map(tx => ({
      ...tx,
      className: `${
        tx.direction === 'incoming' ? 'text-green-600' : 'text-red-600'
      } ${tx.date === selectedDate ? 'bg-blue-50' : ''}`
    }));
  };

  // Add initialRowSelection prop
  const initialRowSelection = selectedDate 
    ? allTransactions
        .filter(tx => tx.date === selectedDate)
        .reduce((acc, tx) => ({ ...acc, [tx.recordId]: true }), {})
    : {};

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          onClick={e => {
            const clickedDataPoint = e?.activePayload?.[0]?.payload;
            setSelectedDate(clickedDataPoint ? clickedDataPoint.date : null);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            label={{ value: 'Balance', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload?.[0]?.payload) {
                const point = payload[0].payload;
                const value = payload[0].value;
                
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-medium">{point.date}</p>
                    <p>End of day: {typeof value === 'number' ? value.toFixed(2) : '0.00'}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            strokeWidth={2}
            dot={(props) => (
              <Dot
                {...props}
                fill={props.payload.date === selectedDate ? "#ff0000" : "#8884d8"}
                r={props.payload.date === selectedDate ? 6 : 4}
              />
            )}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <DynamicList<TransactionRow>
          schema={transactionListSchema}
          queryKey={['forecast-transactions', selectedDate, data]}
          queryFn={queryFn}
          className="w-full"
          initialRowSelection={initialRowSelection}
        />
      </div>
    </div>
  );
};

export default ForecastChart;
