'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';
import { MenuIcon, XIcon } from 'lucide-react';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const menuItems = session
        ? [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Logout', onClick: () => signOut() },
        ]
        : [{ label: 'Login', onClick: () => signIn() }];

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const throttledDragEnd = useCallback(
        (() => {
            let lastCalled = 0;
            return (_: any, info: any) => {
                const now = Date.now();
                if (now - lastCalled > 100) {
                    if (info.offset.x > 100) setIsOpen(false);
                    lastCalled = now;
                }
            };
        })(),
        []
    );

    return (
        <>

            <button
                aria-label="Toggle menu"
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 z-50 p-2 text-blue-700"
            >
                <MenuIcon className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        key="mobile-nav"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={throttledDragEnd}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation menu"
                        className={twMerge(
                            'fixed top-0 right-0 h-full w-4/5 bg-white shadow-lg z-40 p-6 flex flex-col gap-6'
                        )}
                    >
                        <button
                            aria-label="Close menu"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-700"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>

                        <ul className="mt-12 flex flex-col gap-4">
                            {menuItems.map((item, i) => (
                                <li key={i}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-blue-700 text-lg"
                                            onClick={() => setIsOpen(false)}
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
