import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StockData, SymbolSearchData } from '@/types/finance';

export const financeApi = createApi({
  reducerPath: 'financeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.alphavantage.co/query' }),
  endpoints: (builder) => ({
    getStockData: builder.query<StockData, { function: string; symbol: string }>({
      query: (params) =>
        `?${new URLSearchParams({
          ...params,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || '',
        }).toString()}`,
    }),
    searchSymbols: builder.query<SymbolSearchData, { keywords: string }>({
      query: ({ keywords }) =>
        `?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${
          process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || ''
        }`,
    }),
  }),
});

export const { useGetStockDataQuery, useSearchSymbolsQuery } = financeApi;