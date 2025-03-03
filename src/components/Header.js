'use client';

import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function Header() {
  // Theme state
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname(); // Get current path

  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src='/logo.svg' alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold text-gray-800 dark:text-white">MemeVerse</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`${pathname === '/'
                ? 'font-medium text-yellow-600 dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`${pathname === '/explore'
                ? 'font-medium text-yellow-600 dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors`}
            >
              Explore
            </Link>
            <Link
              href="/create"
              className={`${pathname === '/create'
                ? 'font-medium text-yellow-600 dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors`}
            >
              Create
            </Link>
            <Link
              href="/leaderboard"
              className={`${pathname === '/leaderboard'
                ? 'font-medium text-yellow-600 dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors`}
            >
              Leaderboard
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
           
            {/* Dark Mode Toggle */}
            {mounted && (<button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Image src="/sun.png" alt="Sun" width={24} height={24} />
              ) : (
                <Image src="/moon.png" alt="Moon" width={24} height={24} />
              )}
            </button>)}

            {/* User Profile Button */}
            <Link
              href="/user"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="User Profile"
            >
              <Image src="/user.png" alt="User" width={24} height={24} />
            </Link>
            
            {/* Mobile Menu Button - Hidden on larger screens */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            {/* Explore Button */}
            <Link
              href="/explore"
              className="hidden sm:block bg-light-yellow border border--yellow-600 hover:border hover:border-transparent text-black font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Explore Memes
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`${pathname === '/'
                  ? 'font-medium text-yellow-600 dark:text-light-yellow'
                  : 'text-gray-600 dark:text-gray-300'
                  } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors px-2 py-1`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className={`${pathname === '/explore'
                  ? 'font-medium text-yellow-600 dark:text-light-yellow'
                  : 'text-gray-600 dark:text-gray-300'
                  } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors px-2 py-1`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/create"
                className={`${pathname === '/create'
                  ? 'font-medium text-yellow-600 dark:text-light-yellow'
                  : 'text-gray-600 dark:text-gray-300'
                  } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors px-2 py-1`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Create
              </Link>
              <Link
                href="/leaderboard"
                className={`${pathname === '/leaderboard'
                  ? 'font-medium text-yellow-600 dark:text-light-yellow'
                  : 'text-gray-600 dark:text-gray-300'
                  } hover:text-yellow-600 dark:hover:text-light-yellow transition-colors px-2 py-1`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/explore"
                className="bg-light-yellow text-black font-medium px-4 py-2 rounded-lg transition-colors w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Memes
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}