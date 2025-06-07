"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

/**
 * Testimonials Section
 *
 * Auto-rotating testimonials with manual navigation
 * Showcases user success stories and winnings
 */
export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Ramesh Singh",
      location: "Ghaziabad, Uttar Pradesh",
      winnings: "₹1 Crore",
      text: "I won 1 crore on RosterRumble & I am very happy. My experience with playing RosterRumble for last 2 years has been amazing. I recommend it very highly to every sports fantasy player.",
      avatar: "/testimonial-img2.jpg",
    },
    {
      name: "Pradip Apte",
      location: "Latur, Maharashtra",
      winnings: "₹1 Crore",
      text: "I've been an avid cricket follower since my childhood. I got to know about RosterRumble from a YouTube ad. Recently won 1 Crore on RosterRumble! The app is easy, secure, and smooth!",
      avatar: "/testimonial-img2.jpg",
    },
    {
      name: "Anjali Sharma",
      location: "Mumbai, Maharashtra",
      winnings: "₹50 Lakh",
      text: "As a working professional, RosterRumble fits perfectly into my schedule. The interface is user-friendly and I've been consistently winning. Highly recommended for cricket enthusiasts!",
      avatar: "/testimonial-img2.jpg",
    },
    {
      name: "Vikash Kumar",
      location: "Patna, Bihar",
      winnings: "₹75 Lakh",
      text: "Started playing RosterRumble 6 months ago and already won 75 lakhs! The expert analysis feature really helps in team selection. Best fantasy app in India!",
      avatar: "/testimonial-img2.jpg",
    },
    {
      name: "Deepak Mehta",
      location: "Jaipur, Rajasthan",
      winnings: "₹2 Crore",
      text: "RosterRumble changed my life! Won 2 crores in the IPL season. The platform is transparent, secure, and offers great contests. Thank you RosterRumble team!",
      avatar: "/testimonial-img2.jpg",
    },
    {
      name: "Priya Nair",
      location: "Kochi, Kerala",
      winnings: "₹30 Lakh",
      text: "Being a cricket fan, RosterRumble allows me to use my knowledge and earn money. Won 30 lakhs so far and the withdrawal process is super quick!",
      avatar: "/testimonial-img2.jpg",
    },
  ];

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.ceil(testimonials.length / 2)
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.ceil(testimonials.length / 2)) %
        Math.ceil(testimonials.length / 2)
    );
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * 2;
    return testimonials.slice(startIndex, startIndex + 2);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-red-600 text-4xl md:text-5xl font-bold mb-4">
            Players Love RosterRumble
          </h2>
          <div className="w-20 h-1 bg-red-600 rounded-full mx-auto"></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-8 min-h-[300px]">
            {getCurrentTestimonials().map((testimonial, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all  hover:-translate-y-2 animate-in fade-in duration-500"
              >
                <Quote className="h-8 w-8 text-red-500 mb-4" />

                <div className="flex items-start space-x-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border-4 border-red-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-red-600 text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {testimonial.location}
                    </p>
                    <p className="text-red-600 font-semibold mb-3">
                      Winnings {testimonial.winnings}
                    </p>
                    <p className="text-gray-700 italic leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full"
          >
            <ChevronLeft className="h-6 w-6 text-red-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full"
          >
            <ChevronRight className="h-6 w-6 text-red-600" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-red-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
