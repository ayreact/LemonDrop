import React, { useState, useContext } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/auth/AuthProvider';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (logoutUser) {
      await logoutUser();
      navigate('/login');
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-lemon-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-lemon-400 transition-colors">
              About
            </Link>

            {user ? (
              <>
                <Link to="/messages" className="text-foreground hover:text-lemon-400 transition-colors">
                  Messages
                </Link>
                {/* <Link to="/send/anonymous" className="text-foreground hover:text-lemon-400 transition-colors">
                  Send Message
                </Link> */}
                <div className="flex items-center gap-4 ml-2">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.username}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-foreground hover:text-lemon-400 transition-colors">
                  <Button variant="outline" className="border-lemon-400 text-lemon-400 hover:bg-lemon-400 hover:text-white flex items-center gap-2">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-lemon-400 text-white hover:bg-lemon-400">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-lemon-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground hover:text-lemon-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {user ? (
              <>
                <Link
                  to="/messages"
                  className="block py-2 text-foreground hover:text-lemon-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-foreground hover:text-lemon-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" className="w-full bg-lemon-300 text-foreground hover:bg-lemon-400">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
