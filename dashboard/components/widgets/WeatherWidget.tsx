'use client';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useGetCurrentWeatherQuery } from '@/store/api/weatherApi';
import Card from '@/components/ui/Card';
import sunnyAnimation from '@/public/animations/sunny.json';
import rainAnimation from '@/public/animations/rain.json';

export default function WeatherWidget() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, error, isLoading } = useGetCurrentWeatherQuery({ q: 'Delhi' });

  if (isLoading) return <Card title="Weather - Delhi"><div>Loading...</div></Card>;
  if (error) return <Card title="Weather - Delhi"><div className="text-red-500">Error: {(error as any).message}</div></Card>;

  const weatherCondition = data?.weather[0]?.main;
  const description = data?.weather[0]?.description; 

  return (
    <Card title="Weather - Delhi">
      {isClient && weatherCondition === 'Clear' && (
        <Lottie animationData={sunnyAnimation} loop={true} style={{ height: 100 }} />
      )}
      {isClient && (weatherCondition === 'Clouds' || weatherCondition === 'Rain') && (
        <Lottie animationData={rainAnimation} loop={true} style={{ height: 100 }} />
      )}
      {isClient && !['Clear', 'Clouds', 'Rain'].includes(weatherCondition || '') && (
        <Lottie animationData={sunnyAnimation} loop={true} style={{ height: 100 }} />
      )}
      <p className="text-gray-900 dark:text-white">
        Temperature: {data?.main.temp ? `${data.main.temp}°C` : 'N/A'}
      </p>
      {description && ( // Add this block
        <p className="text-gray-900 dark:text-white">
          {description.charAt(0).toUpperCase() + description.slice(1)}
        </p>
      )}
    </Card>
  );
}