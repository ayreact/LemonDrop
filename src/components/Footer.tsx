import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { XIcon, GITIcon, INSIcon, TIKIcon } from './icons';
import { AuthContext } from '@/auth/AuthProvider';

// Social media configuration object for easy link management
const socialLinks = {
  instagram: "https://www.instagram.com/ay_react",
  twitter: "https://x.com/ay_react",
  tiktok: "https://tiktok.com/@ay_react",
  github: "https://github.com/ayreact",
};

const SocialLinks = () => (
  <div className="flex space-x-4 mt-4 md:mt-0">
    {Object.entries({
      twitter: { icon: XIcon, link: socialLinks.twitter },
      github: { icon: GITIcon, link: socialLinks.github },
      tiktok: { icon: TIKIcon, link: socialLinks.tiktok },
      instagram: { icon: INSIcon, link: socialLinks.instagram },
    }).map(([platform, { icon: Icon, link }]) => (
      <a
        key={platform}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon className="text-muted-foreground hover:text-foreground transition-colors" />
      </a>
    ))}
  </div>
);

const Footer: React.FC = () => {
  const { user, logoutUser } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (logoutUser) {
      await logoutUser();
      navigate('/login');
    }
  };

  return (
    <footer className="bg-secondary border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              The sweetest way to receive anonymous messages from your friends.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/messages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Messages
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Account</h3>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li>
                    <Link to="/messages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LemonDrop. All rights reserved | By <Link className='text-lemon-500 hover:underline' to="https://ayreact-portfolio.onrender.com">AY_REACT</Link>
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
