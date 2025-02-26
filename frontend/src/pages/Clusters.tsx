import React from 'react';
import styled from 'styled-components';

/**
 * Clusters component
 * Displays player clusters based on similar playing styles and statistics
 */
const Clusters: React.FC = () => {
  return (
    <ClustersContainer>
      <Title>Player Clusters</Title>
      <Description>
        Explore groups of NBA players with similar playing styles and statistical profiles.
        Players are clustered based on advanced metrics and performance data.
      </Description>

      <ClusterCategories>
        <ClusterCard>
          <ClusterTitle>Scoring Guards</ClusterTitle>
          <ClusterDescription>
            Guards who excel at scoring and creating their own shots.
          </ClusterDescription>
          <ViewButton>View Players</ViewButton>
        </ClusterCard>

        <ClusterCard>
          <ClusterTitle>Defensive Specialists</ClusterTitle>
          <ClusterDescription>
            Players who make their biggest impact on the defensive end.
          </ClusterDescription>
          <ViewButton>View Players</ViewButton>
        </ClusterCard>

        <ClusterCard>
          <ClusterTitle>Stretch Bigs</ClusterTitle>
          <ClusterDescription>
            Big men who can space the floor with outside shooting.
          </ClusterDescription>
          <ViewButton>View Players</ViewButton>
        </ClusterCard>

        <ClusterCard>
          <ClusterTitle>Playmaking Forwards</ClusterTitle>
          <ClusterDescription>
            Forwards who excel at creating for others and handling the ball.
          </ClusterDescription>
          <ViewButton>View Players</ViewButton>
        </ClusterCard>
      </ClusterCategories>

      <InfoSection>
        <InfoTitle>About Clustering</InfoTitle>
        <InfoText>
          Our clustering algorithm uses machine learning techniques to group players based on
          statistical similarities. The algorithm analyzes dozens of metrics including scoring,
          efficiency, defensive impact, and playing style to create meaningful player clusters.
        </InfoText>
      </InfoSection>
    </ClustersContainer>
  );
};

// Styled components
const ClustersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #1d428a; /* NBA blue */
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ClusterCategories = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ClusterCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ClusterTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1d428a;
`;

const ClusterDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  color: #6c757d;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #1d428a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #17336d;
  }
`;

const InfoSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1d428a;
`;

const InfoText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
`;

export default Clusters;
