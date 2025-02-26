import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer to="/">
          <LogoIcon>🏀</LogoIcon>
          <LogoText>NBA Player Comparison</LogoText>
        </LogoContainer>

        <MobileMenuButton onClick={toggleMenu} aria-label="Toggle menu">
          <MenuIcon $isOpen={isMenuOpen}>
            <span></span>
            <span></span>
            <span></span>
          </MenuIcon>
        </MobileMenuButton>

        <NavLinks $isOpen={isMenuOpen}>
          <NavItem>
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/comparison" onClick={() => setIsMenuOpen(false)}>Player Comparison</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/clusters" onClick={() => setIsMenuOpen(false)}>Clusters</NavLink>
          </NavItem>
        </NavLinks>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background-color: #1d428a; /* NBA blue */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  margin-right: 2rem;
`;

const LogoIcon = styled.span`
  font-size: 2rem;
  margin-right: 0.5rem;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

interface MenuIconProps {
  $isOpen: boolean;
}

const MenuIcon = styled.div<MenuIconProps>`
  width: 24px;
  height: 24px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: white;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;

    &:nth-child(1) {
      top: ${props => props.$isOpen ? '10px' : '4px'};
      transform: ${props => props.$isOpen ? 'rotate(135deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      top: 10px;
      opacity: ${props => props.$isOpen ? '0' : '1'};
    }

    &:nth-child(3) {
      top: ${props => props.$isOpen ? '10px' : '16px'};
      transform: ${props => props.$isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

interface NavLinksProps {
  $isOpen: boolean;
}

const NavLinks = styled.ul<NavLinksProps>`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-height: ${props => props.$isOpen ? '300px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    margin-top: ${props => props.$isOpen ? '1rem' : '0'};
  }
`;

const NavItem = styled.li`
  margin-left: 1.5rem;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0.75rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
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

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }
`;

export default Header;
