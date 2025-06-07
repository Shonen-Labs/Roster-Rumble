"use client";

import { useState, useEffect } from "react";

/**
 * Hero Carousel Component
 *
 * Full-width image carousel with smooth transitions
 * Auto-plays with manual navigation controls
 * Responsive design with proper aspect ratios
 */
export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/soccer-image.jpeg",
      alt: "Play with Champions - Fantasy Cricket",
    },
    {
      id: 2,
      image: "/soccer-image1.jpeg",
      alt: "Win Big Prizes - RosterRumble",
    },
    {
      id: 3,
      image: "/soccer-image2.jpeg",
      alt: "Fantasy Sports Experience",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[500px] md:h-[90vh] mt-16 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-gray-900"
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
          />
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-red-500 scale-125 shadow-lg shadow-red-500/50"
                : "bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
