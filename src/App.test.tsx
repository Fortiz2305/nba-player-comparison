import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Note: react-router-dom is now mocked globally in __mocks__/react-router-dom.js

// Mock the page components
jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('./pages/PlayerComparison', () => {
  return function MockPlayerComparison() {
    return <div data-testid="player-comparison-page">Player Comparison Page</div>;
  };
});

jest.mock('./pages/Clusters', () => {
  return function MockClusters() {
    return <div data-testid="clusters-page">Clusters Page</div>;
  };
});

jest.mock('./pages/About', () => {
  return function MockAbout() {
    return <div data-testid="about-page">About Page</div>;
  };
});

jest.mock('./pages/Documentation', () => {
  return function MockDocumentation() {
    return <div data-testid="documentation-page">Documentation Page</div>;
  };
});

jest.mock('./pages/Privacy', () => {
  return function MockPrivacy() {
    return <div data-testid="privacy-page">Privacy Page</div>;
  };
});

// Mock the MainLayout component
jest.mock('./components/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return (
      <div data-testid="main-layout">
        <div data-testid="layout-content">{children}</div>
      </div>
    );
  };
});

describe('App Component', () => {
  test('renders MainLayout with routes', () => {
    render(<App />);

    // Check if MainLayout is rendered
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();

    // Check if routes container is rendered
    expect(screen.getByTestId('layout-content')).toBeInTheDocument();
  });

  test('renders Home page by default', () => {
    // Mock window.location to simulate being on the root path
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/'
      }
    });

    render(<App />);

    // Home page should be rendered by default
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
