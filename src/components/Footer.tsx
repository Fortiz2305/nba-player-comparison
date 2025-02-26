import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterSectionTitle>NBA Player Comparison</FooterSectionTitle>
          <FooterText>
            A tool for comparing NBA players and exploring statistical similarities.
            Data is for educational purposes only.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterSectionTitle>Quick Links</FooterSectionTitle>
          <FooterLinks>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/comparison">Player Comparison</FooterLink>
            <FooterLink to="/clusters">Clusters</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <FooterSectionTitle>Resources</FooterSectionTitle>
          <FooterLinks>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/documentation">Documentation</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
          </FooterLinks>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} NBA Player Comparison | All Rights Reserved
        </Copyright>
        <SocialLinks>
          <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </SocialLink>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </SocialLink>
        </SocialLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const FooterSectionTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1d428a; /* NBA blue */
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.6;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLink = styled(Link)`
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #1d428a;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.85rem;
  color: #6c757d;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: #6c757d;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;

  &:hover {
    color: #1d428a;
  }
`;

export default Footer;
