import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsData } from '@/types/news';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://newsapi.org/v2/' }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<
      NewsData,
      { country: string; category?: string; page: number; pageSize: number }
    >({
      query: (params) =>
        `top-headlines?${new URLSearchParams(params as any).toString()}&apiKey=${
          process.env.NEXT_PUBLIC_NEWS_API_KEY
        }`,
    }),
  }),
});

export const { useGetTopHeadlinesQuery } = newsApi;