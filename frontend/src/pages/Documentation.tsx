import React from 'react';
import styled from 'styled-components';

/**
 * Documentation page component
 * Provides usage instructions and documentation for the application
 */
const Documentation: React.FC = () => {
  return (
    <DocContainer>
      <Title>Documentation</Title>

      <Section>
        <SectionTitle>Getting Started</SectionTitle>
        <SectionContent>
          Welcome to the NBA Player Comparison tool! This documentation will help you navigate
          and make the most of our application's features.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Player Comparison</SectionTitle>
        <SubSection>
          <SubSectionTitle>How to Compare Players</SubSectionTitle>
          <SectionContent>
            1. Navigate to the Player Comparison page
            2. Enter the names of two NBA players you want to compare
            3. Click the "Compare Players" button
            4. View the detailed statistical comparison
          </SectionContent>
        </SubSection>

        <SubSection>
          <SubSectionTitle>Available Statistics</SubSectionTitle>
          <SectionContent>
            Our comparison tool includes the following statistical categories:
          </SectionContent>
          <StatList>
            <StatItem>Basic stats (points, rebounds, assists, etc.)</StatItem>
            <StatItem>Shooting percentages (FG%, 3P%, FT%)</StatItem>
            <StatItem>Advanced metrics (PER, True Shooting %, Win Shares)</StatItem>
            <StatItem>Defensive metrics (Defensive Rating, Steals, Blocks)</StatItem>
            <StatItem>Career totals and averages</StatItem>
          </StatList>
        </SubSection>
      </Section>

      <Section>
        <SectionTitle>Player Clusters</SectionTitle>
        <SectionContent>
          The Clusters feature groups players with similar statistical profiles and playing styles.
        </SectionContent>

        <SubSection>
          <SubSectionTitle>Exploring Clusters</SubSectionTitle>
          <SectionContent>
            1. Navigate to the Clusters page
            2. Browse the different cluster categories
            3. Click on a cluster to view all players in that group
            4. Select individual players to see their detailed statistics
          </SectionContent>
        </SubSection>

        <SubSection>
          <SubSectionTitle>Cluster Methodology</SubSectionTitle>
          <SectionContent>
            Our clustering algorithm uses k-means clustering on normalized player statistics.
            Players are grouped based on statistical similarities across multiple categories,
            creating meaningful clusters that represent different playing styles and roles.
          </SectionContent>
        </SubSection>
      </Section>

      <Section>
        <SectionTitle>API Access</SectionTitle>
        <SectionContent>
          For developers interested in accessing our data programmatically, we offer a REST API.
          Please contact us for API documentation and access credentials.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Troubleshooting</SectionTitle>
        <SectionContent>
          If you encounter any issues while using the application, please try the following steps:
        </SectionContent>
        <TroubleList>
          <TroubleItem>Refresh your browser</TroubleItem>
          <TroubleItem>Clear your browser cache</TroubleItem>
          <TroubleItem>Try a different browser</TroubleItem>
          <TroubleItem>Contact our support team if the issue persists</TroubleItem>
        </TroubleList>
      </Section>
    </DocContainer>
  );
};

// Styled components
const DocContainer = styled.div`
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
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1d428a; /* NBA blue */
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const SubSection = styled.div`
  margin-top: 1.5rem;
`;

const SubSectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: #333;
`;

const SectionContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
`;

const StatList = styled.ul`
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const TroubleList = styled.ol`
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const TroubleItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export default Documentation;
