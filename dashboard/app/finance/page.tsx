'use client';
import { useState } from 'react';
import { useGetStockDataQuery, useSearchSymbolsQuery } from '@/store/api/financeApi';
import Chart from '@/components/ui/Chart';
import useDebounce from '@/hooks/useDebounce';

export default function FinancePage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [inputValue, setInputValue] = useState('AAPL');
  const [timeRange, setTimeRange] = useState('1week');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);

  const timeRangeFunctions: { [key: string]: string } = {
    '1day': 'TIME_SERIES_INTRADAY',
    '1week': 'TIME_SERIES_DAILY',
    '1month': 'TIME_SERIES_DAILY',
    '1year': 'TIME_SERIES_DAILY',
  };

  const { data: stockData, error: stockError, isLoading: stockLoading } = useGetStockDataQuery({
    function: timeRangeFunctions[timeRange],
    symbol,
    ...(timeRange === '1day' && { interval: '5min' }),
  });
  const { data: searchData, isFetching: searchFetching } = useSearchSymbolsQuery(
    { keywords: debouncedInput },
    { skip: debouncedInput.length < 2 }
  ) as any;
  

  const getChartData = () => {
    const timeSeriesMapping: { [key: string]: string } = {
      '1day': 'Time Series (5min)', // Change to match the correct API response
      '1week': 'Time Series (Daily)',
      '1month': 'Time Series (Daily)',
      '1year': 'Time Series (Daily)',
    };
  
    const timeSeriesKey = timeSeriesMapping[timeRange] || 'Time Series (Daily)';
  
    const timeSeries = (stockData as any)?.[timeSeriesKey];
    if (!timeSeries) return [];
  
    const entries = Object.entries(timeSeries);
    const sliceSize = {
      '1day': 24,
      '1week': 7,
      '1month': 30,
      '1year': 252, 
    }[timeRange];
  
    return entries.slice(0, sliceSize).map(([date, values]) => ({
      name: date,
      open: parseFloat((values as any)['1. open']),
      high: parseFloat((values as any)['2. high']),
      low: parseFloat((values as any)['3. low']),
      close: parseFloat((values as any)['4. close']),
      volume: parseInt((values as any)['5. volume'], 10),
    }));
  };
  

  const chartData = getChartData();
  const latest = chartData[0];
  const previous = chartData[1];
  const changePercent = latest && previous ? ((latest.close - previous.close) / previous.close * 100).toFixed(2) : '0';

  const handleSelectSymbol = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setInputValue(selectedSymbol);
    setShowSuggestions(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Stock Market Data</h1>

    
      <div className="relative mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        {debouncedInput.length >= 2 && searchData?.bestMatches?.length > 0 && showSuggestions && (
          <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
            {searchFetching ? (
              <li className="p-2 text-gray-500">Loading...</li>
            ) : (
              searchData.bestMatches.map((match:any) => (
                <li
                  key={match['1. symbol']}
                  onClick={() => handleSelectSymbol(match['1. symbol'])}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                >
                  {match['1. symbol']} - {match['2. name']}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

     
      <div className="mb-6 flex gap-2">
        {['1day', '1week', '1month', '1year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {range === '1day' ? '1 Day' : range === '1week' ? '1 Week' : range === '1month' ? '1 Month' : '1 Year'}
          </button>
        ))}
      </div>

      
      {stockLoading ? (
        <div>Loading...</div>
      ) : stockError ? (
        <div>Error: {(stockError as any).message}</div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div>
            <p className="text-gray-700 dark:text-gray-300">Price: ${latest?.close.toFixed(2)}</p>
            <p className="text-gray-700 dark:text-gray-300">High: ${latest?.high.toFixed(2)}</p>
            <p className="text-gray-700 dark:text-gray-300">Low: ${latest?.low.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">Volume: {latest?.volume.toLocaleString()}</p>
            <p className="text-gray-700 dark:text-gray-300">
              Change: {changePercent}%{' '}
              <span className={`trend-arrow ${latest?.close > previous?.close ? 'up' : 'down'}`}>
                {latest?.close > previous?.close ? '↑' : '↓'}
              </span>
            </p>
          </div>
        </div>
      )}

     
      <Chart
        data={chartData}
        dataKey="close"
        name="Stock Price"
        type="line" 
      />
    </div>
  );
}