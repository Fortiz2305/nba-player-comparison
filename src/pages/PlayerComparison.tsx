import React, { useState } from 'react';
import styled from 'styled-components';

/**
 * PlayerComparison component
 * Allows users to compare statistics between NBA players
 */
const PlayerComparison: React.FC = () => {
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('');

  return (
    <ComparisonContainer>
      <Title>Player Comparison</Title>
      <Description>
        Select two NBA players to compare their statistics and performance metrics.
      </Description>

      <ComparisonForm>
        <InputGroup>
          <Label htmlFor="player1">Player 1</Label>
          <Input
            id="player1"
            type="text"
            placeholder="Enter player name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="player2">Player 2</Label>
          <Input
            id="player2"
            type="text"
            placeholder="Enter player name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        </InputGroup>

        <CompareButton>Compare Players</CompareButton>
      </ComparisonForm>

      <ResultsSection>
        {/* Results will be displayed here once implemented */}
        <p>Player comparison results will appear here</p>
      </ResultsSection>
    </ComparisonContainer>
  );
};

// Styled components
const ComparisonContainer = styled.div`
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
`;

const ComparisonForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1d428a;
    box-shadow: 0 0 0 2px rgba(29, 66, 138, 0.25);
  }
`;

const CompareButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #1d428a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #17336d;
  }
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export default PlayerComparison;
