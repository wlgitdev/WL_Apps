import { TransactionForecast } from '@pf-v2/types';
import { useEffect, useRef, useState } from 'react';
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

export const ForecastChart = ({ data }: { data: TransactionForecast[] }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Transform data for Recharts
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    balance: point.balance,
    originalPoint: point
  }));

  // Get all transactions across all dates
  const allTransactions = data.flatMap(point =>
    (point.transactions || []).map(tx => ({
      ...tx,
      date: new Date(point.date).toLocaleDateString(),
      balance: point.balance
    }))
  );

  useEffect(() => {
    if (selectedDate && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedDate]);

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
                fill={
                  props.payload.date === selectedDate ? "#ff0000" : "#8884d8"
                }
                r={props.payload.date === selectedDate ? 6 : 4} // Highlight selected point
              />
            )}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 max-h-96 overflow-y-auto">
        {allTransactions.map((transaction, index) => (
          <div
            key={index}
            ref={transaction.date === selectedDate ? selectedRef : null}
            className={`
              p-3 rounded mb-2
              ${transaction.date === selectedDate ? 'ring-2 ring-blue-500' : ''}
                ${
                  transaction.direction === 'incoming'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-red-50 border-l-4 border-red-500'
                }
              `}
            onClick={() => setSelectedDate(transaction.date)}
          >
            <div className="flex justify-between">
              <div>
                <span className="text-gray-500 text-sm ml-2">
                  {transaction.date}
                </span>
                <span className="font-bold ml-2">{transaction.name}</span>
              </div>
              <div>
              <span
                className={`
                          font-bold
                  ${
                    transaction.direction === 'incoming'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                `}
              >
                {transaction.direction === 'incoming' ? '+' : '-'}
                {transaction.amount.toFixed(2)}
              </span>              
              <span className="text-gray-500 text-sm ml-2">
                {transaction.balance.toFixed(2)}
              </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastChart;
