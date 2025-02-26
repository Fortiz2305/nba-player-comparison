import React from 'react';
import { render, screen } from '@testing-library/react';
import Privacy from './Privacy';

describe('Privacy Component', () => {
  test('renders title and last updated date', () => {
    render(<Privacy />);

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
  });

  test('renders main sections', () => {
    render(<Privacy />);

    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('How We Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('Data Security')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Services')).toBeInTheDocument();
    expect(screen.getByText('Changes to This Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders information collection details', () => {
    render(<Privacy />);

    expect(screen.getByText('Usage Data')).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(
      screen.getByText(/Information on how you use our website/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We use cookies and similar tracking technologies/)
    ).toBeInTheDocument();
  });

  test('renders information usage list', () => {
    render(<Privacy />);

    expect(screen.getByText('To provide and maintain our service')).toBeInTheDocument();
    expect(screen.getByText('To notify you about changes to our service')).toBeInTheDocument();
    expect(screen.getByText('To provide customer support')).toBeInTheDocument();
    expect(screen.getByText('To gather analysis or valuable information to improve our service')).toBeInTheDocument();
    expect(screen.getByText('To monitor the usage of our service')).toBeInTheDocument();
    expect(screen.getByText('To detect, prevent, and address technical issues')).toBeInTheDocument();
  });

  test('renders contact email link', () => {
    render(<Privacy />);

    const emailLink = screen.getByText('privacy@nbaplayercomparison.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:privacy@nbaplayercomparison.com');
  });
});
