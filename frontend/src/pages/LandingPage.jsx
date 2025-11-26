import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import MenuSection from '../components/MenuSection';
import StorySection from '../components/StorySection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import ReservationPromoModal from '../components/ReservationPromoModal';

const LandingPage = () => {
  const location = useLocation();
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    if (location.state?.showReservationPromo) {
      setShowPromo(true);
      // Bersihkan state agar tidak muncul lagi pada navigasi berikutnya
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div>
      <HeroSlider />
      <MenuSection />
      <StorySection />
      <GallerySection />
      <ContactSection />
      <ReservationPromoModal open={showPromo} onOpenChange={setShowPromo} />
    </div>
  );
};

export default LandingPage;