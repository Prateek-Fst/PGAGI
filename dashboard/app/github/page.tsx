'use client';
import { useState } from 'react';
import { useGetCommitActivityQuery, useGetContributorsQuery, useGetRepoDataQuery } from '@/store/api/githubApi';
import Chart from '@/components/ui/Chart';
import useDebounce from '@/hooks/useDebounce';

export default function GitHubPage() {
  const [repoInput, setRepoInput] = useState('facebook/react'); // Default repo
  const [owner, setOwner] = useState('facebook');
  const [repo, setRepo] = useState('react');
  const debouncedRepoInput = useDebounce(repoInput, 300);

  const handleRepoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRepoInput(value);
    const [newOwner, newRepo] = value.split('/');
    if (newOwner && newRepo) {
      setOwner(newOwner.trim());
      setRepo(newRepo.trim());
    }
  };

  const { data: commitData, error: commitError, isLoading: commitLoading } = useGetCommitActivityQuery({ owner, repo });
  const { data: contributorData, error: contributorError, isLoading: contributorLoading } = useGetContributorsQuery({ owner, repo });
  const { data: repoData, error: repoError, isLoading: repoLoading } = useGetRepoDataQuery({ owner, repo });
  const commitChartData = commitData?.map((week) => ({
    week: new Date(week.week * 1000).toLocaleDateString(),
    commits: week.total,
  })) || [];

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">GitHub Repository Stats</h1>
      <div className="mb-6">
        <input
          type="text"
          value={repoInput}
          onChange={handleRepoChange}
          placeholder="Enter repository (e.g., facebook/react)"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Enter in the format: owner/repo
        </p>
      </div>
      {(commitLoading || contributorLoading || repoLoading) ? (
        <div className="text-center">Loading...</div>
      ) : (commitError || contributorError || repoError) ? (
        <div className="text-center text-red-500">
          Error: {(commitError || contributorError || repoError as any)?.message}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-900 dark:text-white">Stars: {repoData?.stargazers_count.toLocaleString()}</p>
            <p className="text-gray-900 dark:text-white">Forks: {repoData?.forks_count.toLocaleString()}</p>
            <p className="text-gray-900 dark:text-white">Issues: {repoData?.open_issues_count.toLocaleString()}</p>
            <p className="text-gray-900 dark:text-white col-span-full">Description: {repoData?.description || 'No description'}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Commit Activity (Last 52 Weeks)</h2>
            <Chart data={commitChartData} dataKey="commits" name="Commits" type="line" />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Contributors</h2>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {contributorData?.slice(0, 5).map((contributor) => (
                <li key={contributor.author.login} className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <img src={contributor.author.avatar_url} alt={contributor.author.login} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contributor.author.login}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Commits: {contributor.total}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}