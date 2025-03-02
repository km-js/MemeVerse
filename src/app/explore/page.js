'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { debounce } from 'lodash';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function MemeExplorer() {
    // States
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('trending');
    const [sortBy, setSortBy] = useState('likes');
    const [cachedMemes, setCachedMemes] = useLocalStorage('cachedMemes', {});
    const [darkMode, setDarkMode] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Refs
    const observer = useRef();
    const searchInputRef = useRef(null);

    // Categories with emojis
    const categories = [
        { id: 'trending', name: 'Trending', emoji: '🔥' },
        { id: 'new', name: 'Fresh', emoji: '✨' },
        { id: 'classic', name: 'Classics', emoji: '🏆' },
        { id: 'random', name: 'Random', emoji: '🎲' }
    ];

    // Sort options with emojis
    const sortOptions = [
        { value: 'likes', label: '❤️ Most Liked' },
        { value: 'date', label: '📅 Newest First' },
        { value: 'comments', label: '💬 Most Comments' }
    ];

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // useEffect(() => {
    //     if (filteredMemes.length > 0) {
    //         const enhancedMemes = filteredMemes.map(meme => ({
    //             ...meme,
    //             likes: Math.floor(Math.random() * 50) + 1,
    //             comments: Math.floor(Math.random() * 20) + 1,
    //             daysAgo: Math.floor(Math.random() * 30) + 1,
    //         }));
    //         setMemes(enhancedMemes);
    //     }
    // }, [filteredMemes]);

    // Debounced search function

    const debouncedSearch = useCallback(
        debounce((query) => {
            setMemes([]);
            fetchMemes(query, category, sortBy);
        }, 500),
        [category, sortBy]
    );

    // API call to fetch memes
    const fetchMemes = async (query = searchQuery, cat = category, sort = sortBy) => {
        setLoading(true);
        setError(null);

        // Create cache key based on parameters
        const cacheKey = `${cat}-${sort}-${query}`;

        // Check if we have cached data
        if (cachedMemes[cacheKey]) {
            setMemes(cachedMemes[cacheKey]);
            setLoading(false);
            return;
        }

        try {
            // Base URL for Imgflip API
            let url = 'https://api.imgflip.com/get_memes';

            const response = await fetch(url);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error_message || 'Failed to fetch memes');
            }

            let filteredMemes = data.data.memes;

            // Simulating filtering by category
            if (cat === 'trending') {
                filteredMemes = filteredMemes.slice(0, 10);
            } else if (cat === 'new') {
                filteredMemes = filteredMemes.slice(10, 20);
            } else if (cat === 'classic') {
                filteredMemes = filteredMemes.slice(20, 30);
            } else if (cat === 'random') {
                filteredMemes = filteredMemes.sort(() => 0.5 - Math.random());
            }

            // Simulating search
            if (query) {
                filteredMemes = filteredMemes.filter(meme =>
                    meme.name.toLowerCase().includes(query.toLowerCase())
                );
            }

            // Add random metrics for UI enhancements
            const enhancedMemes = filteredMemes.map(meme => ({
                ...meme,
                likes: Math.floor(Math.random() * 50) + 1,  // 1-50 likes
                comments: Math.floor(Math.random() * 20) + 1, // 1-20 comments
                daysAgo: Math.floor(Math.random() * 30) + 1, // 1-30 days ago
            }));

            // Simulating sorting based on the enhanced metrics
            if (sort === 'likes') {
                enhancedMemes.sort((a, b) => b.likes - a.likes);
            } else if (sort === 'date') {
                enhancedMemes.sort((a, b) => a.daysAgo - b.daysAgo);
            } else if (sort === 'comments') {
                enhancedMemes.sort((a, b) => b.comments - a.comments);
            }

            // Cache the results
            setCachedMemes(prev => ({
                ...prev,
                [cacheKey]: enhancedMemes
            }));

            // Update state
            setMemes(enhancedMemes);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching memes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle intersection observer for infinite scrolling
    const lastMemeElementRef = useCallback(node => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                // Load more memes if needed in the future
            }
        });

        if (node) observer.current.observe(node);
    }, [loading]);

    useEffect(() => {
        setMemes([]);
        fetchMemes();
    }, [category, sortBy]);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
        debouncedSearch('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    // Animation for the filter panel
    const filterVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: 'auto',
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    // Get random fun loading messages
    const getLoadingMessage = () => {
        const messages = [
            "Searching for the dankest memes... 🕵️‍♂️",
            "Summoning meme lords... 🧙‍♂️",
            "Converting caffeine to memes... ☕",
            "Generating laughs... 😂",
            "Finding the perfect reaction GIFs... 🔍"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
            {/* Header Section */}
            <header className="bg-white dark:bg-gray-800 shadow-lg  top-0 z-10 transition-all">
                <div className="container mx-auto px-4 py-4">
                    {/* App Title and Dark Mode Toggle */}
                    {/* <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            <span className="mr-2">🖼️</span>Meme Explorer
                        </h1>
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div> */}

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
                                            pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
                                        >
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
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
                        <span className="text-2xl">{categories.find(cat => cat.id === category)?.emoji}</span>
                        <h2>{categories.find(cat => cat.id === category)?.name}</h2>
                        {searchQuery && (
                            <span className="ml-2 text-base font-normal">
                                - Results for "{searchQuery}"
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                        <p>🚨 {error}</p>
                    </div>
                )}

                {/* Empty States */}
                {memes.length === 0 && !loading && !error && searchQuery && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <span className="mx-auto text-6xl mb-4 block">🔍</span>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No memes found for "{searchQuery}"</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search or browse categories</p>
                        <button
                            onClick={clearSearch}
                            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Meme Grid */}
                <AnimatePresence>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {memes.map((meme, index) => {
                            // Add ref to last element for potential future infinite scroll
                            const isLastElement = index === memes.length - 1;

                            return (
                                <motion.div
                                    key={`${meme.id}-${index}`}
                                    ref={isLastElement ? lastMemeElementRef : null}
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
                                        <div className="mt-auto flex justify-between text-sm text-gray-500 dark:text-gray-400 suppressHydrationWarning">
                                            <div className="flex items-center">
                                                <span className="mr-1">❤️</span>
                                                <span className="font-medium">{meme.likes}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="mr-1">💬</span>
                                                <span className="font-medium">{meme.comments}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="mr-1">⏱️</span>
                                                <span className="font-medium">{meme.daysAgo}d</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🤣</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 animate-pulse font-medium">{getLoadingMessage()}</p>
                    </div>
                )}

                {/* No Results Message */}
                {memes.length === 0 && !loading && !error && !searchQuery && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <span className="mx-auto text-6xl mb-4 block">🤔</span>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No memes found</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Try changing your filters</p>
                    </div>
                )}
            </main>
        </div>
    );
}