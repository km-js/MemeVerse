'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useMeme } from '@/contexts/MemeContext';

export default function MemeExplorer() {
  // Context and States
  const { memes, toggleLike } = useMeme(); // Destructure likeMeme from context
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('likes');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const searchInputRef = useRef(null);

  // Categories with emojis
  const categories = [
    { id: 'all', name: 'All', emoji: '🌐' },
    { id: 'trending', name: 'Trending', emoji: '🔥' },
    { id: 'new', name: 'Fresh', emoji: '✨' },
    { id: 'classic', name: 'Classics', emoji: '🏆' },
    { id: 'random', name: 'Random', emoji: '🎲' },
  ];

  // Sort options with emojis
  const sortOptions = [
    { value: 'likes', label: '❤️ Most Liked' },
    { value: 'date', label: '📅 Newest First' },
    { value: 'comments', label: '💬 Most Comments' },
  ];

  // Check if desktop view
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Filter and sort memes from context
  const filteredMemes = useMemo(() => {
    let result = [...memes];

    // Filter by category
    if (category === 'all') {
      result = result;
    } else if (category === 'trending') {
      result = result.slice(0, 10);
    } else if (category === 'new') {
      result = result.slice(10, 20);
    } else if (category === 'classic') {
      result = result.slice(20, 30);
    } else if (category === 'random') {
      result = result.sort(() => 0.5 - Math.random());
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter((meme) =>
        meme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by selected metric
    if (sortBy === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate));
    } else if (sortBy === 'comments') {
      result.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    }

    return result;
  }, [memes, category, searchQuery, sortBy]);

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const calculateDaysAgo = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffTime = now - uploadDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-lg top-0 z-10 transition-all">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="mt-4 relative transition-all duration-300">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for memes... 🔎"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 
                focus:ring-yellow-500 focus:border-transparent transition-all shadow-sm hover:shadow"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                ❌
              </button>
            )}
          </div>

          {/* Toggle Filters Button (Mobile) */}
          <button
            className="md:hidden mt-4 w-full py-2 px-4 bg-yellow-600 text-white rounded-lg flex items-center justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            <span className="ml-2">{showFilters ? '▲' : '▼'}</span>
          </button>

          {/* Filters and Controls */}
          <AnimatePresence>
            {(showFilters || isDesktop) && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="md:block overflow-hidden"
              >
                <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-4 py-2 rounded-full font-medium ${category === cat.id
                          ? 'bg-yellow-600 hover:bg-yellow-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                          } transition-colors shadow-sm`}
                      >
                        <span className="mr-1">{cat.emoji}</span> {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Sort Control */}
                  <div className="relative w-full md:w-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 
                        dark:border-gray-600 text-gray-800 dark:text-white rounded-lg py-2 
                        pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        shadow-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Category Description */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            <span className="text-2xl">{categories.find((cat) => cat.id === category)?.emoji}</span>
            <h2>{categories.find((cat) => cat.id === category)?.name}</h2>
            {searchQuery && (
              <span className="ml-2 text-base font-normal">- Results for "{searchQuery}"</span>
            )}
          </div>
        </div>

        {/* Meme Grid */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredMemes.map((meme, index) => (
              <motion.div
                key={`${meme.id}-${index}`}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                  transition-all duration-300 flex flex-col group relative"
              >
                {/* Meme Image with Link */}
                <Link href={`/meme/${meme.id}`} className="block overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                  <img
                    src={meme.url}
                    alt={meme.name}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>

                {/* Meme Info */}
                <div className="p-4 flex-grow flex flex-col">
                  <Link href={`/meme/${meme.id}`} className="block">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                      {meme.name}
                    </h3>
                  </Link>

                  {/* Metrics */}
                  <div className="mt-auto flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <button
                        // onClick={() => likeMeme(meme.id)} // Call likeMeme with meme.id
                        // onClick={() => (meme.hasliked ? unlikeMeme(meme.id) : likeMeme(meme.id))}
                        onClick={() => toggleLike(meme.id)}
                        className="mr-1"
                      >
                        {meme.hasLiked ? '❤️' : '🤍'}
                      </button>
                      <span className="font-medium">{meme.likes}</span>
                    </div>
                    <div className="flex items-center">
                      {/* <span className="mr-1">💬</span>
                      <span className="font-medium">{meme.comments?.length || 0}</span> */}
                      <Link href={`/meme/${meme.id}`} className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        <span className="mr-1">💬</span>
                        <span className="font-medium">{meme.comments?.length || 0}</span>
                      </Link>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">⏱️</span>
                      <span className="font-medium">{calculateDaysAgo(meme.uploadedDate)}d</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results Messages */}
        {filteredMemes.length === 0 && !searchQuery && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <span className="mx-auto text-6xl mb-4 block">🤔</span>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No memes found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try changing your filters</p>
          </div>
        )}

        {filteredMemes.length === 0 && searchQuery && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <span className="mx-auto text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              No memes found for "{searchQuery}"
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search or browse categories</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}