import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '../page';
import { useSession } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('Profile Page', () => {
  const mockSession = {
    data: { user: { name: 'Test User', email: 'test@example.com', image: '/avatar.png' } },
    status: 'authenticated',
  };

  const renderProfile = (sessionOverride = mockSession) => {
    (useSession as jest.Mock).mockReturnValue(sessionOverride);
    return render(
      <I18nextProvider i18n={i18n}>
        <Profile />
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign-in prompt when unauthenticated', () => {
    renderProfile({ data: null, status: 'unauthenticated' });
    expect(screen.getByText('Please sign in to access the dashboard')).toBeInTheDocument();
  });

  it('renders profile with user data', () => {
    renderProfile();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('enables editing and saves changes', () => {
    renderProfile();
    fireEvent.click(screen.getByText('Edit Profile'));
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('New Name')).toBeInTheDocument();
  });

  it('saves profile with valid data', () => {
    renderProfile();
    fireEvent.click(screen.getByText('Edit Profile'));
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('New Name')).toBeInTheDocument();
  });
});