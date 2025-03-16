import React from 'react'; // Add this line
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileSection from '../ProfileSection';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ProfileSection', () => {
  const mockRouter = { push: jest.fn() };
  const mockNotifications = [
    { id: 1, message: 'Test notification', time: 'Now' },
  ];

  beforeEach(() => {
    (useRouter as unknown as jest.Mock).mockReturnValue(mockRouter);
    (useSelector as unknown as jest.Mock).mockReturnValue(mockNotifications);
  });

  const renderProfileSection = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <ProfileSection onClose={jest.fn()} />
      </I18nextProvider>
    );

  it('renders profile settings button', () => {
    renderProfileSection();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('navigates to profile page', () => {
    renderProfileSection();
    fireEvent.click(screen.getByText('Profile Settings'));
    expect(mockRouter.push).toHaveBeenCalledWith('/profile');
  });

  it('shows notifications on click', () => {
    renderProfileSection();
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('shows no notifications message when empty', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue([]);
    renderProfileSection();
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });
});