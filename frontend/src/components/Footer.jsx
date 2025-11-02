import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { contactData } from '../mockData';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-amber-500 mb-4">Cafe Loreomah</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nikmati kopi specialty terbaik Indonesia dengan suasana hangat dan nyaman. 
              Kami hadir untuk memberikan pengalaman kopi yang tak terlupakan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-amber-500 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-amber-500 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{contactData.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{contactData.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{contactData.email}</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a
                href={`https://instagram.com/${contactData.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-800 p-2 rounded-full hover:bg-amber-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-800 p-2 rounded-full hover:bg-amber-700 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Cafe Loreomah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;