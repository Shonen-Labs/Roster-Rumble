'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { MenuIcon, XIcon } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const menuItems = isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Logout', onClick: () => setIsAuthenticated(false) },
      ]
    : [{ label: 'Login', onClick: () => setIsAuthenticated(true) }];


  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  
  const throttledDragEnd = useCallback(
    (() => {
      let lastCall = 0;
      return (_: any, info: any) => {
        const now = Date.now();
        if (now - lastCall > 100) {
          if (info.offset.x > 100) setIsOpen(false);
          lastCall = now;
        }
      };
    })(),
    []
  );

  return (
    <>
 
      <button
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 text-blue-700"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={throttledDragEnd}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={twMerge(
              'fixed top-0 right-0 h-full w-4/5 bg-white shadow-lg z-40 p-6 flex flex-col'
            )}
          >
            <button
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-700"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <ul className="mt-16 space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-blue-700 text-lg"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      className="text-blue-700 text-lg"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
