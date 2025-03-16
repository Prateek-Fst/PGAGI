'use client';
import { useGetRepoDataQuery, useGetCommitsQuery } from '@/store/api/githubApi';
import Card from '@/components/ui/Card';

export default function GitHubWidget() {
  const owner = 'vercel';
  const repo = 'next.js';

  const { data: repoData, error: repoError, isLoading: repoLoading } = useGetRepoDataQuery({ owner, repo });
  const { data: commitData, error: commitError, isLoading: commitLoading } = useGetCommitsQuery({ owner, repo, per_page: 5 });

  if (repoLoading || commitLoading) return <Card title={`GitHub: ${owner}/${repo}`}><div>Loading...</div></Card>;
  if (repoError || commitError) return <Card title={`GitHub: ${owner}/${repo}`}><div className="text-red-500">Error: {(repoError || commitError as any)?.message}</div></Card>;

  return (
    <Card title={`GitHub: ${owner}/${repo}`} className="h-full w-full">
      <div className="space-y-4">
        <div className="flex justify-between text-gray-900 dark:text-white">
          <p>Stars: {repoData?.stargazers_count.toLocaleString()}</p>
          <p>Forks: {repoData?.forks_count.toLocaleString()}</p>
          <p>Issues: {repoData?.open_issues_count.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Commits</h3>
          {commitData && commitData.length > 0 ? (
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {commitData.map((commit) => (
                <li key={commit.sha} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{commit.commit.message.split('\n')[0]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {commit.commit.author.name} - {new Date(commit.commit.author.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No commits available</p>
          )}
        </div>
      </div>
    </Card>
  );
}