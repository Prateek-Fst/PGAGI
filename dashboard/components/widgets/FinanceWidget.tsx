'use client';
import { useGetStockDataQuery } from '@/store/api/financeApi';
import Card from '@/components/ui/Card';

export default function FinanceWidget() {
  const { data, error, isLoading } = useGetStockDataQuery({
    function: 'TIME_SERIES_DAILY',
    symbol: 'AAPL',
  });

  if (isLoading) return <Card title="Finance - AAPL"><div>Loading...</div></Card>;
  if (error) return <Card title="Finance - AAPL"><div className="text-red-500">Error: {(error as any).message}</div></Card>;

  const timeSeries = data?.['Time Series (Daily)'];
  const dates = timeSeries ? Object.keys(timeSeries) : [];
  const latest = timeSeries?.[dates[0]];
  const previous = timeSeries?.[dates[1]];

  const currentPrice = parseFloat(latest?.['4. close'] || '0');
  const previousClose = parseFloat(previous?.['4. close'] || '0');
  const high = parseFloat(latest?.['2. high'] || '0');
  const low = parseFloat(latest?.['3. low'] || '0');
  const volume = parseInt(latest?.['5. volume'] || '0', 10);
  const changePercent = previousClose ? ((currentPrice - previousClose) / previousClose * 100).toFixed(2) : '0';
  const trend = currentPrice > previousClose ? 'up' : 'down';

  return (
    <Card title="Finance - AAPL">
      <div className="text-gray-900 dark:text-white space-y-2">
        <p>Price: ${currentPrice.toFixed(2)}</p>
        <p>High: ${high.toFixed(2)}</p>
        <p>Low: ${low.toFixed(2)}</p>
        <p>Volume: {volume.toLocaleString()}</p>
        <p>
          Change: {changePercent}%{' '}
          <span className={`trend-arrow ${trend}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        </p>
      </div>
    </Card>
  );
}