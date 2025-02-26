import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerComparison from './PlayerComparison';

describe('PlayerComparison Component', () => {
  test('renders title and description', () => {
    render(<PlayerComparison />);

    expect(screen.getByText('Player Comparison')).toBeInTheDocument();
    expect(
      screen.getByText('Select two NBA players to compare their statistics and performance metrics.')
    ).toBeInTheDocument();
  });

  test('renders player input fields', () => {
    render(<PlayerComparison />);

    const player1Input = screen.getByLabelText('Player 1');
    const player2Input = screen.getByLabelText('Player 2');

    expect(player1Input).toBeInTheDocument();
    expect(player2Input).toBeInTheDocument();
    expect(player1Input).toHaveAttribute('placeholder', 'Enter player name');
    expect(player2Input).toHaveAttribute('placeholder', 'Enter player name');
  });

  test('updates input values when typing', () => {
    render(<PlayerComparison />);

    const player1Input = screen.getByLabelText('Player 1');
    const player2Input = screen.getByLabelText('Player 2');
    fireEvent.change(player1Input, { target: { value: 'LeBron James' } });
    fireEvent.change(player2Input, { target: { value: 'Michael Jordan' } });

    expect(player1Input).toHaveValue('LeBron James');
    expect(player2Input).toHaveValue('Michael Jordan');
  });

  test('renders compare button and results section', () => {
    render(<PlayerComparison />);

    const compareButton = screen.getByText('Compare Players');

    expect(compareButton).toBeInTheDocument();
    expect(screen.getByText('Player comparison results will appear here')).toBeInTheDocument();
  });
});
