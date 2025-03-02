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

  const pathname = usePathname(); // Get current path

  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`${pathname === '/'
                ? 'font-medium text-yellow-600 dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-vibrant-pink dark:hover:text-light-yellow transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`${pathname === '/explore'
                ? 'font-medium text-vibrant-pink dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-vibrant-pink dark:hover:text-light-yellow transition-colors`}
            >
              Explore
            </Link>
            <Link
              href="/create"
              className={`${pathname === '/create'
                ? 'font-medium text-vibrant-pink dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-vibrant-pink dark:hover:text-light-yellow transition-colors`}
            >
              Create
            </Link>
            <Link
              href="/leaderboard"
              className={`${pathname === '/leaderboard'
                ? 'font-medium text-vibrant-pink dark:text-light-yellow'
                : 'text-gray-600 dark:text-gray-300'
                } hover:text-vibrant-pink dark:hover:text-light-yellow transition-colors`}
            >
              Leaderboard
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* User Profile Button */}
            <Link
              href="/user"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="User Profile"
            >
              {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg> */}
              <Image src="/user.png" alt="User" width={24} height={24} />
            </Link>

            {/* Dark Mode Toggle */}
            {mounted && (<button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >

              {darkMode ? (
                // <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                //   <path
                //     d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                //     fillRule="evenodd"
                //     clipRule="evenodd"
                //   />
                // </svg> 
                <Image src="/sun.png" alt="Sun" width={24} height={24} />
              ) : (
                // <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                //   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                // </svg>
                <Image src="/moon.png" alt="Moon" width={24} height={24} />
              )}
            </button>)}


            {/* Mobile Menu Button - Hidden on larger screens */}
            <button className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            {/* Explore Button */}
            <Link
              href="/explore"
              className="hidden sm:block bg-light-yellow border border-yellow-600 hover:border hover:border-transparent text-black font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Explore Memes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}