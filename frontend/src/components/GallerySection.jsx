import React from 'react';
import { galleryImages } from '../mockData';

const GallerySection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-amber-600 uppercase tracking-wider font-semibold mb-2">
            MOMENTS
          </p>
          <h2 className="text-5xl font-bold text-gray-400 uppercase mb-2">Gallery</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-16">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer h-64"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;