import React from 'react';
import { render, screen } from '@testing-library/react';
import Documentation from './Documentation';

describe('Documentation Component', () => {
  test('renders title and main sections', () => {
    render(<Documentation />);

    expect(screen.getByText('Documentation')).toBeInTheDocument();

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Player Comparison')).toBeInTheDocument();
    expect(screen.getByText('Player Clusters')).toBeInTheDocument();
    expect(screen.getByText('API Access')).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting')).toBeInTheDocument();
  });

  test('renders player comparison subsections', () => {
    render(<Documentation />);

    expect(screen.getByText('How to Compare Players')).toBeInTheDocument();
    expect(screen.getByText('Available Statistics')).toBeInTheDocument();

    expect(screen.getByText(/1\. Navigate to the Player Comparison page/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Enter the names of two NBA players/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Click the "Compare Players" button/)).toBeInTheDocument();
    expect(screen.getByText(/4\. View the detailed statistical comparison/)).toBeInTheDocument();
  });

  test('renders statistics list items', () => {
    render(<Documentation />);

    expect(screen.getByText(/Basic stats \(points, rebounds, assists, etc\.\)/)).toBeInTheDocument();
    expect(screen.getByText(/Shooting percentages \(FG%, 3P%, FT%\)/)).toBeInTheDocument();
    expect(screen.getByText(/Advanced metrics \(PER, True Shooting %, Win Shares\)/)).toBeInTheDocument();
    expect(screen.getByText(/Defensive metrics \(Defensive Rating, Steals, Blocks\)/)).toBeInTheDocument();
    expect(screen.getByText(/Career totals and averages/)).toBeInTheDocument();
  });

  test('renders clusters subsections', () => {
    render(<Documentation />);

    expect(screen.getByText('Exploring Clusters')).toBeInTheDocument();
    expect(screen.getByText('Cluster Methodology')).toBeInTheDocument();
    expect(screen.getByText(/The Clusters feature groups players with similar statistical profiles/)).toBeInTheDocument();
    expect(screen.getByText(/Our clustering algorithm uses k-means clustering/)).toBeInTheDocument();
  });

  test('renders troubleshooting steps', () => {
    render(<Documentation />);

    expect(screen.getByText('Refresh your browser')).toBeInTheDocument();
    expect(screen.getByText('Clear your browser cache')).toBeInTheDocument();
    expect(screen.getByText('Try a different browser')).toBeInTheDocument();
    expect(screen.getByText('Contact our support team if the issue persists')).toBeInTheDocument();
  });
});
