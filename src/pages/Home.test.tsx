import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  test('renders title and description', () => {
    render(<Home />);

    expect(screen.getByText('NBA Player Comparison')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to the NBA Player Comparison tool. This application allows you to:')
    ).toBeInTheDocument();
  });

  test('renders feature list items', () => {
    render(<Home />);

    expect(screen.getByText('Compare statistics between NBA players')).toBeInTheDocument();
    expect(screen.getByText('View player clusters based on similar playing styles')).toBeInTheDocument();
    expect(screen.getByText('Analyze historical and current player data')).toBeInTheDocument();
  });

  test('applies correct structure to components', () => {
    render(<Home />);

    const title = screen.getByText('NBA Player Comparison');
    expect(title).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(within(listItems[0]).getByText('Compare statistics between NBA players')).toBeInTheDocument();
    expect(within(listItems[1]).getByText('View player clusters based on similar playing styles')).toBeInTheDocument();
    expect(within(listItems[2]).getByText('Analyze historical and current player data')).toBeInTheDocument();
  });
});
