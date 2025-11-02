import React from 'react';
import HeroSlider from '../components/HeroSlider';
import MenuSection from '../components/MenuSection';
import StorySection from '../components/StorySection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';

const LandingPage = () => {
  return (
    <div>
      <HeroSlider />
      <MenuSection />
      <StorySection />
      <GallerySection />
      <ContactSection />
    </div>
  );
};

export default LandingPage;