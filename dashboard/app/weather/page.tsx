'use client';
import { useState } from 'react';
import { useGetForecastQuery, useGetCurrentWeatherQuery } from '@/store/api/weatherApi';
import { useGetCitySuggestionsQuery } from '@/store/api/geoDbApi';
import Chart from '@/components/ui/Chart';
import Lottie from 'lottie-react';
import useDebounce from '@/hooks/useDebounce';
import sunnyAnimation from '@/public/animations/sunny.json';
import rainAnimation from '@/public/animations/rain.json';

export default function WeatherPage() {
  const [city, setCity] = useState('London');
  const [inputValue, setInputValue] = useState('London');
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const debouncedInput = useDebounce(inputValue, 300);

  const { data: suggestionsData, isFetching: isFetchingSuggestions } =
    useGetCitySuggestionsQuery(
      { prefix: debouncedInput },
      { skip: debouncedInput.length < 2 }
    );


  const { data: forecastData, error: forecastError, isLoading: forecastLoading } =
    useGetForecastQuery({ q: city });


  const { data: currentData, error: currentError, isLoading: currentLoading } =
    useGetCurrentWeatherQuery({ q: city });

  const chartData =
    forecastData?.list
      .slice(0, 7)
      .map((item) => ({
        name: new Date(item.dt * 1000).toLocaleDateString(),
        temperature: item.main.temp,
      })) || [];

  const weatherCondition = currentData?.weather[0]?.main;

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setInputValue(selectedCity);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
   
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>

      
      <div className="relative mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)} 
          onBlur={handleInputBlur} 
          placeholder="Search for a city..."
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        {debouncedInput.length >= 2 &&
          suggestionsData?.data.length > 0 &&
          showSuggestions && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
              {isFetchingSuggestions ? (
                <li className="p-2 text-gray-500">Loading...</li>
              ) : (
                suggestionsData.data.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSelectCity(suggestion.name)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                  >
                    {suggestion.name}, {suggestion.country}
                  </li>
                ))
              )}
            </ul>
          )}
      </div>
      <div className="mb-6">
        {currentLoading ? (
          <div>Loading current weather...</div>
        ) : currentError ? (
          <div>Error: {(currentError as any).message}</div>
        ) : (
          <div>
            {weatherCondition === 'Clouds' ? (
              <Lottie animationData={rainAnimation} loop={true} style={{ height: 100 }} />
            ) : (
              <Lottie animationData={sunnyAnimation} loop={true} style={{ height: 100 }} />
            )}
            <p className="text-gray-900 dark:text-white">
              Temperature: {currentData?.main.temp}°C
            </p>
          </div>
        )}
      </div>
      {forecastLoading ? (
        <div>Loading forecast...</div>
      ) : forecastError ? (
        <div>Error: {(forecastError as any).message}</div>
      ) : (
        <Chart data={chartData} dataKey="temperature" name="Temperature" />
      )}
    </div>
  );
}