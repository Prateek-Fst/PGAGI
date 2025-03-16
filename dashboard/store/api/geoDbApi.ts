import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CitySuggestion {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const geoDbApi = createApi({
  reducerPath: 'geoDbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://wft-geo-db.p.rapidapi.com/v1/geo/',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', process.env.NEXT_PUBLIC_GEODB_API_KEY || '');
      headers.set('X-RapidAPI-Host', 'wft-geo-db.p.rapidapi.com');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCitySuggestions: builder.query<{ data: CitySuggestion[] }, { prefix: string }>({
      query: ({ prefix }) =>
        `cities?namePrefix=${prefix}&limit=5&sort=-population`,
    }),
  }),
});

export const { useGetCitySuggestionsQuery } = geoDbApi;