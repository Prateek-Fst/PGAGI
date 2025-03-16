import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { useSession } from 'next-auth/react';
import { SearchProvider } from '@/lib/SearchContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../ProfileSection', () => ({ onClose }) => (
    <div>Profile Section <button onClick={onClose}>Close</button></div>
  ));

const mockSession = {
  data: { user: { name: 'Test User', image: '/avatar.png' } },
  status: 'authenticated',
};

describe('Header', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
    i18n.changeLanguage('en');
    localStorage.clear();
  });

  const renderHeader = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <SearchProvider>
          <Header />
        </SearchProvider>
      </I18nextProvider>
    );

  it('renders dashboard title', () => {
    renderHeader();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    renderHeader();
    const darkModeButton = screen.getByLabelText('Toggle Dark Mode');
    fireEvent.click(darkModeButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(darkModeButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('loads saved dark mode theme on mount', () => {
    localStorage.setItem('theme', 'dark');
    renderHeader();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('switches language to Spanish', () => {
    renderHeader();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'es' } });
    expect(screen.getByText('Tablero')).toBeInTheDocument();
  });

  it('shows user avatar when authenticated', () => {
    renderHeader();
    expect(screen.getByAltText('User Avatar')).toHaveAttribute('src', '/avatar.png');
  });

  it('renders without session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    renderHeader();
    expect(screen.queryByAltText('User Avatar')).not.toBeInTheDocument();
  });

  it('handles search submission', () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText('Search dashboard...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.submit(searchInput.closest('form')!);
    expect(searchInput).toHaveValue('test query');
  });

  it('toggles profile section visibility', () => {
    renderHeader();
    const avatar = screen.getByAltText('User Avatar');
    fireEvent.click(avatar);
    expect(screen.getByText('Profile Section')).toBeInTheDocument();
    fireEvent.click(avatar);
    expect(screen.queryByText('Profile Section')).not.toBeInTheDocument();
  });
});