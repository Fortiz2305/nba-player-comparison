import React, { useState } from 'react'
import { Activity, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ui/theme-toggle'

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-[hsl(var(--nba-blue))]" />
          <Link to="/" className="text-xl font-bold">NBA Player Comparison</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link
            to="/comparison"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/comparison') ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            Similar Players
          </Link>
          <Link
            to="/clusters"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/clusters') ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            Clusters
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/about') ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-3 space-y-1">
            <Link
              to="/"
              className={`block py-2 px-3 rounded-md ${isActive('/') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/comparison"
              className={`block py-2 px-3 rounded-md ${isActive('/comparison') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Similar Players
            </Link>
            <Link
              to="/clusters"
              className={`block py-2 px-3 rounded-md ${isActive('/clusters') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Clusters
            </Link>
            <Link
              to="/about"
              className={`block py-2 px-3 rounded-md ${isActive('/about') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
