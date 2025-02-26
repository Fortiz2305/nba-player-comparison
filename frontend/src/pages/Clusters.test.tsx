import React from 'react';
import { render, screen } from '@testing-library/react';
import Clusters from './Clusters';

describe('Clusters Component', () => {
  test('renders title and description', () => {
    render(<Clusters />);

    expect(screen.getByText('Player Clusters')).toBeInTheDocument();
    expect(
      screen.getByText(/Explore groups of NBA players with similar playing styles and statistical profiles./)
    ).toBeInTheDocument();
  });

  test('renders cluster categories', () => {
    render(<Clusters />);

    expect(screen.getByText('Scoring Guards')).toBeInTheDocument();
    expect(screen.getByText('Defensive Specialists')).toBeInTheDocument();
    expect(screen.getByText('Stretch Bigs')).toBeInTheDocument();
    expect(screen.getByText('Playmaking Forwards')).toBeInTheDocument();
  });

  test('renders cluster descriptions', () => {
    render(<Clusters />);

    expect(screen.getByText('Guards who excel at scoring and creating their own shots.')).toBeInTheDocument();
    expect(screen.getByText('Players who make their biggest impact on the defensive end.')).toBeInTheDocument();
    expect(screen.getByText('Big men who can space the floor with outside shooting.')).toBeInTheDocument();
    expect(screen.getByText('Forwards who excel at creating for others and handling the ball.')).toBeInTheDocument();
  });

  test('renders view buttons for each cluster', () => {
    render(<Clusters />);

    const viewButtons = screen.getAllByText('View Players');
    expect(viewButtons).toHaveLength(4);
  });

  test('renders info section about clustering', () => {
    render(<Clusters />);

    expect(screen.getByText('About Clustering')).toBeInTheDocument();
    expect(
      screen.getByText(/Our clustering algorithm uses machine learning techniques to group players/)
    ).toBeInTheDocument();
  });
});
