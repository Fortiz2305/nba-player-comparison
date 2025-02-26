import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About Component', () => {
  test('renders title and sections', () => {
    render(<About />);

    expect(screen.getByText('About NBA Player Comparison')).toBeInTheDocument();

    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Data Sources')).toBeInTheDocument();
    expect(screen.getByText('Development Team')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders section content', () => {
    render(<About />);

    expect(
      screen.getByText(/The NBA Player Comparison tool was created to help basketball fans/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our application uses data from various NBA seasons/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/All data used in this application is sourced from publicly available NBA statistics/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This project was developed by a team of basketball enthusiasts/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Have questions, suggestions, or feedback/)
    ).toBeInTheDocument();
  });

  test('renders contact email link', () => {
    render(<About />);

    const emailLink = screen.getByText('contact@nbaplayercomparison.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@nbaplayercomparison.com');
  });
});
