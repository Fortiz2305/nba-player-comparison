import React from 'react';
import styled from 'styled-components';

/**
 * About page component
 * Provides information about the NBA player comparison application
 */
const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title>About NBA Player Comparison</Title>

      <Section>
        <SectionTitle>Our Mission</SectionTitle>
        <SectionContent>
          The NBA Player Comparison tool was created to help basketball fans, analysts, and enthusiasts
          explore and compare player statistics in an intuitive and visually appealing way. Our goal is
          to make advanced basketball analytics accessible to everyone, regardless of their statistical
          background.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <SectionContent>
          Our application uses data from various NBA seasons to provide comprehensive player comparisons.
          The clustering feature employs machine learning algorithms to group players with similar
          statistical profiles, helping users discover players with comparable playing styles.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Data Sources</SectionTitle>
        <SectionContent>
          All data used in this application is sourced from publicly available NBA statistics.
          The data is updated regularly to ensure accuracy and relevance. Please note that this
          application is for educational and entertainment purposes only.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Development Team</SectionTitle>
        <SectionContent>
          This project was developed by a team of basketball enthusiasts with a passion for data
          visualization and web development. We're constantly working to improve the application
          and add new features.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <SectionContent>
          Have questions, suggestions, or feedback? We'd love to hear from you! Please reach out
          to us at <EmailLink href="mailto:contact@nbaplayercomparison.com">contact@nbaplayercomparison.com</EmailLink>.
        </SectionContent>
      </Section>
    </AboutContainer>
  );
};

// Styled components
const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1d428a; /* NBA blue */
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1d428a; /* NBA blue */
`;

const SectionContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
`;

const EmailLink = styled.a`
  color: #1d428a;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default About;
