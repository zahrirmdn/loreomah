import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from '../api/api';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slider data from backend
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await API.get("/api/sliders/");
        setSliders(res.data);
      } catch (err) {
        console.error("Gagal memuat slider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (sliders.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading slider...</p>
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Belum ada data slider 😅</p>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
      {sliders.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={`http://localhost:8000${slide.image}`}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>

          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fadeIn">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 animate-fadeIn">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 sm:p-3 rounded-full transition-all"
      >
        <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 sm:p-3 rounded-full transition-all"
      >
        <ChevronRight size={20} className="sm:w-7 sm:h-7" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-amber-500 w-8"
                : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
