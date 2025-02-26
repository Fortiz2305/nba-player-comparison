import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

/**
 * Layout component
 * Provides consistent layout structure for all pages
 */
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        {children}
      </MainContent>
      <Footer>
        <FooterText>
          © {new Date().getFullYear()} NBA Player Comparison | Data for educational purposes only
        </FooterText>
      </Footer>
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
`;

const Footer = styled.footer`
  background-color: #f8f9fa;
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
`;

const FooterText = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
`;

export default Layout;
