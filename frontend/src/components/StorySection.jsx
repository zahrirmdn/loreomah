import React from 'react';
import { storyData } from '../mockData';
import { Button } from './ui/button';

const StorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-gray-400 uppercase text-center mb-16">
          {storyData.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            {storyData.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}

            <div className="flex flex-wrap gap-4 pt-6">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg">
                AWAL MULA
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg">
                KAMPANYE
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <img
                src={storyData.image}
                alt="Cafe Loreomah Story"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500 rounded-full opacity-20 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-700 rounded-full opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;