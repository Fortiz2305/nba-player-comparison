import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Navbar component
 * Provides navigation links to different pages of the application
 */
const Navbar: React.FC = () => {
  return (
    <NavContainer>
      <NavBrand to="/">NBA Player Comparison</NavBrand>
      <NavLinks>
        <NavItem>
          <NavLink to="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/comparison">Player Comparison</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/clusters">Clusters</NavLink>
        </NavItem>
      </NavLinks>
    </NavContainer>
  );
};

// Styled components
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1d428a; /* NBA blue */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;

  &:hover {
    color: #f0f0f0;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-left: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Navbar;
