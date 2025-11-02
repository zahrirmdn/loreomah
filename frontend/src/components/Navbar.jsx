import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">CL</span>
            </div>
            <span className="text-2xl font-bold text-amber-900">Cafe Loreomah</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-colors hover:text-amber-800 ${
                  isActive(link.path) ? 'text-amber-800 border-b-2 border-amber-800' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login">
              <Button className="bg-amber-800 hover:bg-amber-900 text-white px-6">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-lg font-medium py-2 transition-colors ${
                  isActive(link.path) ? 'text-amber-800' : 'text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;