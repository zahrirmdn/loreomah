import React from 'react';
import { Instagram } from 'lucide-react';
import { contactData } from '../mockData';

const ContactSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#6A4C2E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-white uppercase tracking-wider font-semibold mb-2">
            get up close and personal
          </p>
          <h2 className="text-5xl font-bold text-white uppercase mb-2">Contact Us</h2>
          <div className="w-16 h-1 bg-white mx-auto"></div>
        </div>

        {/* Contact Options - Only Instagram, TikTok, YouTube */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {/* Instagram */}
          <div className="text-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors" style={{ backgroundColor: '#8B6F47' }}>
              <Instagram size={48} className="text-white" />
            </div>
            <p className="text-white uppercase text-sm mb-2">Instagram</p>
            <p className="text-white font-semibold">{contactData.instagram}</p>
          </div>

          {/* TikTok */}
          <div className="text-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors" style={{ backgroundColor: '#8B6F47' }}>
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
            <p className="text-white uppercase text-sm mb-2">TikTok</p>
            <p className="text-white font-semibold">{contactData.tiktok}</p>
          </div>

          {/* YouTube */}
          <div className="text-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors" style={{ backgroundColor: '#8B6F47' }}>
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <p className="text-white uppercase text-sm mb-2">YouTube</p>
            <p className="text-white font-semibold">{contactData.youtube}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;