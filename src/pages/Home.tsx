import React from 'react';
import styled from 'styled-components';

/**
 * Home page component
 * Serves as the landing page for the NBA player comparison application
 */
const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title>NBA Player Comparison</Title>
      <Description>
        Welcome to the NBA Player Comparison tool. This application allows you to:
      </Description>
      <FeatureList>
        <FeatureItem>Compare statistics between NBA players</FeatureItem>
        <FeatureItem>View player clusters based on similar playing styles</FeatureItem>
        <FeatureItem>Analyze historical and current player data</FeatureItem>
      </FeatureList>
    </HomeContainer>
  );
};

// Styled components
const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #1d428a; /* NBA blue */
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  max-width: 600px;
`;

const FeatureItem = styled.li`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default Home;
