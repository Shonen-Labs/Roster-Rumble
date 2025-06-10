"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Header Component
 *
 * Professional navigation header with beautiful mobile menu
 * Mobile menu shows on screens smaller than 1280px (xl breakpoint)
 * Features outside click to close and backdrop blur
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint - shows menu earlier
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Handle outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    { name: "Home", href: "/", isActive: true },
    { name: "How to Play", href: "/how-to-play" },
    { name: "Contests", href: "/contests" },
    { name: "Winners", href: "/winners" },
    { name: "About Us", href: "/about" },
    { name: "Support", href: "/support" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu - Shows on mobile/tablet (earlier breakpoint) */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-white p-2 hover:bg-red-600/20 rounded-lg transition-all duration-200 group"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-6 bg-white transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 top-3" : "top-1"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-white transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "top-3"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-white transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 top-3" : "top-5"
                  }`}
                />
              </div>
            </button>
          )}

          {/* Logo - Center on mobile, left on desktop */}
          <Link
            href="/"
            className={`flex items-center group ${isMobile ? "mx-auto" : ""}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold text-xl tracking-wide">
                ROSTER<span className="text-red-500">RUMBLE</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    item.isActive
                      ? "text-red-500 bg-red-500/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Section - Right */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3">
              <span className="text-gray-300 text-sm">Not a Member Yet?</span>
              <Link
                href="/signup"
                className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                Register Now
              </Link>
            </div>
            <Link href={"/signin"}>
                        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105">
              Log In
            </Button>
            </Link>

          </div>
        </div>

        {/* Modern Mobile Menu Dropdown */}
        {isMenuOpen && isMobile && (
          <>
            {/* Backdrop Blur Overlay */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Dropdown Menu */}
            <div
              ref={menuRef}
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl z-50 animate-in slide-in-from-top duration-300"
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        item.isActive
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Auth */}
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Link
                      href="/signin"
                      className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register Now
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
