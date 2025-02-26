import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders footer sections and links', () => {
    render(<Footer />);

    expect(screen.getByText('NBA Player Comparison')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Player Comparison')).toBeInTheDocument();
    expect(screen.getByText('Clusters')).toBeInTheDocument();

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  test('renders copyright and social links', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    const copyrightElement = screen.getByText((content) =>
      content.includes(currentYear) && content.includes('NBA Player Comparison')
    );
    expect(copyrightElement).toBeInTheDocument();
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    const twitterLink = screen.getByRole('link', { name: 'Twitter' });
    expect(githubLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('target', '_blank');
  });
});
