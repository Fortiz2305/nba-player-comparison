import React from 'react';
import { render, screen, within } from '@testing-library/react';
import MainLayout from './MainLayout';

jest.mock('./Header', () => {
  return function MockHeader() {
    return <div data-testid="header-component">Header Component</div>;
  };
});

jest.mock('./Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Footer Component</div>;
  };
});

describe('MainLayout Component', () => {
  test('renders header, content, and footer', () => {
    const testContent = 'Test Content';
    render(
      <MainLayout>
        <div>{testContent}</div>
      </MainLayout>
    );

    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  test('applies correct layout structure', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(within(mainContent).getByText('Content')).toBeInTheDocument();
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });
});
