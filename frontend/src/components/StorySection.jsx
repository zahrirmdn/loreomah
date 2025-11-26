import React, { useState, useEffect } from 'react';
import API from '../api/api';

const StorySection = () => {
  const [storyData, setStoryData] = useState({
    title: 'CERITA KAMI',
    paragraphs: [],
    image: ''
  });

  useEffect(() => {
    API.get('/api/settings/')
      .then(res => setStoryData(res.data.story || storyData))
      .catch(err => console.error('Failed to load story settings:', err));
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-400 uppercase text-center mb-8 sm:mb-12 md:mb-16">
          {storyData.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6">
            {storyData.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 text-sm sm:text-base leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <img
                src={storyData.image}
                alt="Cafe Loreomah Story"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20 -z-10" style={{ backgroundColor: '#6A4C2E' }}></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-20 -z-10" style={{ backgroundColor: '#8B6F47' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;