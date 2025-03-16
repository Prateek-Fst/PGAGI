import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherData, ForecastData } from '@/types/weather';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org/data/2.5/' }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, { q: string }>({
      query: (params) =>
        `weather?${new URLSearchParams(params).toString()}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`,
    }),
    getForecast: builder.query<ForecastData, { q: string }>({
      query: (params) =>
        `forecast?${new URLSearchParams(params).toString()}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`,
    }),
  }),
});

export const { useGetCurrentWeatherQuery, useGetForecastQuery } = weatherApi;