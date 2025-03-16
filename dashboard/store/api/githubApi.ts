import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CommitActivity {
  week: number;
  days: number[];
  total: number;
}

export interface Contributor {
  author: { login: string; avatar_url: string };
  total: number;
  weeks: { w: number; a: number; d: number; c: number }[];
}

export interface RepoData {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export interface Commit {
  sha: string;
  commit: {
    author: { name: string; date: string };
    message: string;
  };
}

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com/',
    prepareHeaders: (headers) => {
      const token = process.env.NEXT_PUBLIC_GITHUB_API_TOKEN;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/vnd.github+json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCommitActivity: builder.query<CommitActivity[], { owner: string; repo: string }>({
      query: ({ owner, repo }) => `repos/${owner}/${repo}/stats/commit_activity`,
    }),
    getContributors: builder.query<Contributor[], { owner: string; repo: string }>({
      query: ({ owner, repo }) => `repos/${owner}/${repo}/stats/contributors`,
    }),
    getRepoData: builder.query<RepoData, { owner: string; repo: string }>({
      query: ({ owner, repo }) => `repos/${owner}/${repo}`,
    }),
    getCommits: builder.query<Commit[], { owner: string; repo: string; per_page: number }>({
      query: ({ owner, repo, per_page }) => `repos/${owner}/${repo}/commits?per_page=${per_page}`,
    }),
  }),
});

export const {
  useGetCommitActivityQuery,
  useGetContributorsQuery,
  useGetRepoDataQuery,
  useGetCommitsQuery, 
} = githubApi;