import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

/**
 * MainLayout component
 * Provides consistent layout structure for all pages with responsive design
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

// Styled components
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 0;
  background-color: #fafafa;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

export default MainLayout;
