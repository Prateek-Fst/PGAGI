import { render, screen } from '@testing-library/react';
import GitHubWidget from '../GitHubWidget';
import { useGetRepoDataQuery, useGetCommitsQuery } from '@/store/api/githubApi';

jest.mock('@/store/api/githubApi', () => ({
  useGetRepoDataQuery: jest.fn(),
  useGetCommitsQuery: jest.fn(),
}));

describe('GitHubWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    (useGetRepoDataQuery as jest.Mock).mockReturnValue({ isLoading: true });
    (useGetCommitsQuery as jest.Mock).mockReturnValue({ isLoading: false });
    render(<GitHubWidget />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state for repo data', () => {
    (useGetRepoDataQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: { message: 'Repo API Error' },
    });
    (useGetCommitsQuery as jest.Mock).mockReturnValue({ isLoading: false });
    render(<GitHubWidget />);
    expect(screen.getByText('Error: Repo API Error')).toBeInTheDocument();
  });

  it('shows error state for commits', () => {
    (useGetRepoDataQuery as jest.Mock).mockReturnValue({ isLoading: false });
    (useGetCommitsQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: { message: 'Commits API Error' },
    });
    render(<GitHubWidget />);
    expect(screen.getByText('Error: Commits API Error')).toBeInTheDocument();
  });

  it('shows repo data and commits on success', () => {
    (useGetRepoDataQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        stargazers_count: 1000,
        forks_count: 500,
        open_issues_count: 50,
      },
    });
    (useGetCommitsQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [
        {
          sha: '1',
          commit: {
            message: 'Initial commit',
            author: { name: 'John Doe', date: '2023-01-01T00:00:00Z' },
          },
        },
        {
          sha: '2',
          commit: {
            message: 'Fix bug',
            author: { name: 'Jane Doe', date: '2023-01-02T00:00:00Z' },
          },
        },
      ],
    });
    render(<GitHubWidget />);
    expect(screen.getByText('GitHub: vercel/next.js')).toBeInTheDocument();
    expect(screen.getByText('Stars: 1,000')).toBeInTheDocument();
    expect(screen.getByText('Forks: 500')).toBeInTheDocument();
    expect(screen.getByText('Issues: 50')).toBeInTheDocument();
    expect(screen.getByText('Initial commit')).toBeInTheDocument();
    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.getByText(/John Doe - \d+\/\d+\/\d+/)).toBeInTheDocument(); // Flexible date match
    expect(screen.getByText(/Jane Doe - \d+\/\d+\/\d+/)).toBeInTheDocument();
  });

  it('shows no commits message when commit data is empty', () => {
    (useGetRepoDataQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        stargazers_count: 1000,
        forks_count: 500,
        open_issues_count: 50,
      },
    });
    (useGetCommitsQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
    });
    render(<GitHubWidget />);
    expect(screen.getByText('No commits available')).toBeInTheDocument();
  });
});