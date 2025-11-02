import React from 'react';
import { menuCategories } from '../mockData';

const MenuSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-amber-600 uppercase tracking-wider font-semibold mb-2">
            from the best indonesian specialty coffee to heart-warming foods
          </p>
          <h2 className="text-5xl font-bold text-gray-400 uppercase mb-2">Our Menu</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {menuCategories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 h-64">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {category.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;