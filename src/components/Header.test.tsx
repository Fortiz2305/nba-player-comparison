import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  test('renders logo and navigation links', () => {
    render(<Header />);

    expect(screen.getByText('NBA Player Comparison')).toBeInTheDocument();
    expect(screen.getByText('🏀')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Player Comparison')).toBeInTheDocument();
    expect(screen.getByText('Clusters')).toBeInTheDocument();
  });

  test('mobile menu button toggles navigation on mobile view', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    render(<Header />);

    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton);

    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('Player Comparison')).toBeVisible();
    expect(screen.getByText('Clusters')).toBeVisible();
  });
});
