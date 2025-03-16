import { render, screen } from '@testing-library/react';
import WeatherWidget from '../WeatherWidget';
import { useGetCurrentWeatherQuery } from '@/store/api/weatherApi';

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div>Mocked Lottie</div>,
}));
jest.mock('@/public/animations/sunny.json', () => ({}), { virtual: true });
jest.mock('@/public/animations/rain.json', () => ({}), { virtual: true });
jest.mock('@/store/api/weatherApi', () => ({
  useGetCurrentWeatherQuery: jest.fn(),
}));

describe('WeatherWidget', () => {
  it('shows loading state', () => {
    (useGetCurrentWeatherQuery as jest.Mock).mockReturnValue({ isLoading: true });
    render(<WeatherWidget />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows weather data on success', () => {
    (useGetCurrentWeatherQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { main: { temp: 20 }, weather: [{ main: 'Clear', description: 'Sunny' }] },
    });
    render(<WeatherWidget />);
    expect(screen.getByText('Temperature: 20°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useGetCurrentWeatherQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: { message: 'API Error' },
    });
    render(<WeatherWidget />);
    expect(screen.getByText('Error: API Error')).toBeInTheDocument(); // Updated
  });
});