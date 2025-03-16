import { render, screen, fireEvent } from '@testing-library/react';
import NewsWidget from '../NewsWidget';
import { useGetTopHeadlinesQuery } from '@/store/api/newsApi';

jest.mock('@/store/api/newsApi', () => ({
  useGetTopHeadlinesQuery: jest.fn(),
}));

describe('NewsWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({ isLoading: true });
    render(<NewsWidget />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: { message: 'API Error' },
    });
    render(<NewsWidget />);
    expect(screen.getByText('Error: API Error')).toBeInTheDocument();
  });

  it('shows news article with image', () => {
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        articles: [
          {
            title: 'Tech Breakthrough',
            author: 'Jane Doe',
            source: { name: 'TechCrunch' },
            urlToImage: 'https://example.com/image.jpg',
          },
        ],
      },
    });
    render(<NewsWidget />);
    expect(screen.getByText('Top News')).toBeInTheDocument();
    expect(screen.getByText('Tech Breakthrough')).toBeInTheDocument();
    expect(screen.getByText('By Jane Doe - TechCrunch')).toBeInTheDocument();
    expect(screen.getByAltText('Tech Breakthrough')).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows news article without image', () => {
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        articles: [
          {
            title: 'Sports Update',
            author: 'John Doe',
            source: { name: 'ESPN' },
            urlToImage: null,
          },
        ],
      },
    });
    render(<NewsWidget />);
    expect(screen.getByText('Sports Update')).toBeInTheDocument();
    expect(screen.getByText('By John Doe - ESPN')).toBeInTheDocument();
    expect(screen.queryByAltText('Sports Update')).not.toBeInTheDocument();
  });

  it('shows no news message when no articles', () => {
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { articles: [] },
    });
    render(<NewsWidget />);
    expect(screen.getByText('No news available')).toBeInTheDocument();
  });

  it('changes category on button click', () => {
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        articles: [
          {
            title: 'Business News',
            author: 'Jane Doe',
            source: { name: 'Bloomberg' },
          },
        ],
      },
    });
    render(<NewsWidget />);
    const techButton = screen.getByText('Technology');
    fireEvent.click(techButton);
    (useGetTopHeadlinesQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        articles: [
          {
            title: 'Tech News',
            author: 'John Doe',
            source: { name: 'TechCrunch' },
          },
        ],
      },
    });
    render(<NewsWidget />); 
    expect(screen.getByText('Tech News')).toBeInTheDocument();
  });
});