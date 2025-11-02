import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { contactData } from '../mockData';

const ContactSection = () => {
  return (
    <section className="py-20 bg-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-white uppercase tracking-wider font-semibold mb-2">
            get up close and personal
          </p>
          <h2 className="text-5xl font-bold text-white uppercase mb-2">Contact Us</h2>
          <div className="w-16 h-1 bg-white mx-auto"></div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {/* Instagram */}
          <div className="text-center group cursor-pointer">
            <div className="bg-amber-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-700 transition-colors">
              <Instagram size={48} className="text-white" />
            </div>
            <p className="text-white uppercase text-sm mb-2">Instagram</p>
            <p className="text-white font-semibold">{contactData.instagram}</p>
          </div>

          {/* Facebook */}
          <div className="text-center group cursor-pointer">
            <div className="bg-amber-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-700 transition-colors">
              <Facebook size={48} className="text-white" />
            </div>
            <p className="text-white uppercase text-sm mb-2">Facebook</p>
            <p className="text-white font-semibold">{contactData.facebook}</p>
          </div>

          {/* Email */}
          <div className="text-center group cursor-pointer">
            <div className="bg-amber-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-700 transition-colors">
              <Mail size={48} className="text-white" />
            </div>
            <p className="text-white uppercase text-sm mb-2">Email</p>
            <p className="text-white font-semibold text-sm">{contactData.email}</p>
          </div>

          {/* TikTok */}
          <div className="text-center group cursor-pointer">
            <div className="bg-amber-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-700 transition-colors">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
            <p className="text-white uppercase text-sm mb-2">TikTok</p>
            <p className="text-white font-semibold">{contactData.tiktok}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;