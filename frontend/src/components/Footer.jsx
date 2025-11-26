import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin } from 'lucide-react';
import API from '../api/api';

const Footer = () => {
  const [contactData, setContactData] = useState({
    address: '',
    phone: '',
    instagram: '@cafeloreomah',
    tiktok: 'cafeloreomah',
    youtube: 'Cafe Loreomah'
  });

  useEffect(() => {
    API.get('/api/settings/')
      .then(res => setContactData(res.data.contact || contactData))
      .catch(err => console.error('Failed to load contact settings:', err));
  }, []);

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#D4A574' }}>Cafe Loreomah</h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Nikmati suasana sejuk khas pedesaan dengan pemandangan asri yang menenangkan.
              Kami hadir untuk memberikan pengalaman bersantai yang tak terlupakan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: '#D4A574' }}>Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/" className="text-gray-300 transition-colors text-sm" style={{ hover: { color: '#D4A574' } }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 transition-colors text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: '#D4A574' }}>Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} style={{ color: '#D4A574' }} className="mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{contactData.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} style={{ color: '#D4A574' }} className="flex-shrink-0" />
                <span className="text-gray-300 text-sm">{contactData.phone}</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
              <a
                href="https://www.instagram.com/cafeloreomah/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full transition-colors"
                style={{ backgroundColor: '#6A4C2E' }}
              >
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@cafeloreomah"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full transition-colors"
                style={{ backgroundColor: '#6A4C2E' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full transition-colors"
                style={{ backgroundColor: '#6A4C2E' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © {new Date().getFullYear()} Cafe Loreomah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;