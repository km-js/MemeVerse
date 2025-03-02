'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { debounce } from 'lodash';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function MemeExplorer() {
    //states
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('trending');
    const [sortBy, setSortBy] = useState('likes');
    const [viewMode, setViewMode] = useState('infinite'); // 'infinite' or 'pagination'
    const [cachedMemes, setCachedMemes] = useLocalStorage('cachedMemes', {});
    const [darkMode, setDarkMode] = useState(false);
    const [favoriteMemes, setFavoriteMemes] = useLocalStorage('favoriteMemes', []);
    const [showFavorites, setShowFavorites] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    //refs
    const observer = useRef();
    const searchInputRef = useRef(null);

    // Categories with emojis
    const categories = [
        { id: 'trending', name: 'Trending', emoji: '🔥' },
        { id: 'new', name: 'Fresh Memes', emoji: '✨' },
        { id: 'classic', name: 'Classics', emoji: '🏆' },
        { id: 'random', name: 'Random', emoji: '🎲' }
    ];

    // Sort options with emojis
    const sortOptions = [
        { value: 'likes', label: '❤️ Most Liked' },
        { value: 'date', label: '📅 Newest First' },
        { value: 'comments', label: '💬 Most Comments' }
    ];

    //debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            setPage(1);
            setMemes([]);
            fetchMemes(1, query, category, sortBy);
        }, 500),
        [category, sortBy]
    );

    // API call to fetch memes
    const fetchMemes = async (pageNum, query = searchQuery, cat = category, sort = sortBy) => {
        if (showFavorites) {
            // When showing favorites, filter from the favorites list
            setMemes(favoriteMemes);
            setHasMore(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        //Create cache key based on parameters
        const cacheKey = `${cat}-${sort}-${query}-${pageNum}`;

        //check if we have cached data
        if (cachedMemes[cacheKey]) {
            setMemes(prevMemes => pageNum === 1 ? cachedMemes[cacheKey] : [...prevMemes, ...cachedMemes[cacheKey]]);
            setLoading(false);
            return;
        }

        try {
            //base URL for Imgflip API
            let url = 'https://api.imgflip.com/get_memes';

            const response = await fetch(url);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error_message || 'Failed to fetch memes');
            }

            let filteredMemes = data.data.memes;

            //simulating filtering by category
            if (cat === 'trending') {
                filteredMemes = filteredMemes.slice(0, 10);
            } else if (cat === 'new') {
                filteredMemes = filteredMemes.slice(10, 20);
            } else if (cat === 'classic') {
                filteredMemes = filteredMemes.slice(20, 30);
            } else if (cat === 'random') {
                filteredMemes = filteredMemes.sort(() => 0.5 - Math.random());
            }

            //simulating search
            if (query) {
                filteredMemes = filteredMemes.filter(meme =>
                    meme.name.toLowerCase().includes(query.toLowerCase())
                );
            }

            // Add random metrics for UI enhancements - FIXED: More reasonable values
            const enhancedMemes = filteredMemes.map(meme => ({
                ...meme,
                likes: Math.floor(Math.random() * 50) + 1,  // 1-50 likes
                comments: Math.floor(Math.random() * 20) + 1, // 1-20 comments
                daysAgo: Math.floor(Math.random() * 30) + 1, // 1-30 days ago
            }));

            //simulating sorting - FIXED: Using the enhanced metrics properly
            if (sort === 'likes') {
                enhancedMemes.sort((a, b) => b.likes - a.likes);
            } else if (sort === 'date') {
                enhancedMemes.sort((a, b) => a.daysAgo - b.daysAgo);
            } else if (sort === 'comments') {
                enhancedMemes.sort((a, b) => b.comments - a.comments);
            }

            //cache the results
            setCachedMemes(prev => ({
                ...prev,
                [cacheKey]: enhancedMemes
            }));

            //update state
            setMemes(prevMemes => pageNum === 1 ? enhancedMemes : [...prevMemes, ...enhancedMemes]);
            setHasMore(enhancedMemes.length > 0);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching memes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Toggle favorite status
    const toggleFavorite = (meme) => {
        const memeId = meme.id;
        if (favoriteMemes.some(m => m.id === memeId)) {
            setFavoriteMemes(favoriteMemes.filter(m => m.id !== memeId));
        } else {
            setFavoriteMemes([...favoriteMemes, meme]);
        }
    };

    // Check if a meme is favorited
    const isFavorite = (memeId) => {
        return favoriteMemes.some(m => m.id === memeId);
    };

    //handle intersection observer for infinite scrolling
    const lastMemeElementRef = useCallback(node => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && viewMode === 'infinite') {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, viewMode]);

    useEffect(() => {
        setMemes([]);
        setPage(1);
        fetchMemes(1);
    }, [category, sortBy, showFavorites]);

    //fetch on page change for infinite scroll
    useEffect(() => {
        if (page > 1 && viewMode === 'infinite' && !showFavorites) {
            fetchMemes(page);
        }
    }, [page, viewMode]);

    //handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };


    const handleToggleFavorites = () => {
        setShowFavorites(!showFavorites);
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
        debouncedSearch('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    //animation variants for Framer Motion
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
            <header className="bg-white dark:bg-gray-800 shadow-lg top-0 z-10 transition-all">
                <div className="container mx-auto px-4 py-4">

                    {/* Search Bar */}
                    <div className={`mt-4 relative transition-all duration-300`}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for memes... 🔎"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 
                                focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow"
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

                    {/* Filters and Controls */}
                    <AnimatePresence>
                        {(showFilters || window.innerWidth >= 768) && (
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
                                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    } transition-colors shadow-sm`}
                                            >
                                                <span className="mr-1">{cat.emoji}</span> {cat.name.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sort and View Controls */}
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {/* Sort Dropdown - FIXED: Not showing blue background when selected */}
                                        <div className="relative flex-grow md:flex-grow-0">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="appearance-none w-full md:w-auto bg-white dark:bg-gray-700 border border-gray-300 
                                                dark:border-gray-600 text-gray-800 dark:text-white rounded-lg py-2 
                                                pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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

                                        {/* Favorites Toggle Button */}
                                        <button
                                            onClick={handleToggleFavorites}
                                            className={`px-4 py-2 rounded-full font-medium ${showFavorites
                                                ? 'bg-pink-500 hover:bg-pink-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                } transition-colors shadow-sm`}
                                        >
                                            <span className="mr-1">{showFavorites ? '❤️' : '🤍'}</span>
                                            {showFavorites ? 'Favorites' : 'Favorites'}
                                        </button>
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
                    {showFavorites ? (
                        <div className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                            <span className="text-2xl">❤️</span>
                            <h2>Your Favorite Memes ({favoriteMemes.length})</h2>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                            <span className="text-2xl">{categories.find(cat => cat.id === category)?.emoji}</span>
                            <h2>{categories.find(cat => cat.id === category)?.name}</h2>
                        </div>
                    )}
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                        <p>🚨 {error}</p>
                    </div>
                )}

                {/* Empty States */}
                {memes.length === 0 && !loading && !error && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        {showFavorites ? (
                            <>
                                <span className="mx-auto text-6xl mb-4 block">💔</span>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No favorite memes yet</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">Click the heart icon on memes you love to save them here</p>
                                <button
                                    onClick={() => setShowFavorites(false)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Browse Memes
                                </button>
                            </>
                        ) : searchQuery ? (
                            <>
                                <span className="mx-auto text-6xl mb-4 block">🔍</span>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No memes found for "{searchQuery}"</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search or browse categories</p>
                                <button
                                    onClick={clearSearch}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="mx-auto text-6xl mb-4 block">🤔</span>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No memes found</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">Try changing your filters</p>
                            </>
                        )}
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
                            // Add ref to last element for infinite scroll
                            const isLastElement = index === memes.length - 1;
                            const favorite = isFavorite(meme.id);

                            return (
                                <motion.div
                                    key={`${meme.id}-${index}`}
                                    ref={isLastElement ? lastMemeElementRef : null}
                                    variants={itemVariants}
                                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                                transition-all duration-300 flex flex-col group relative"
                                >
                                    {/* Meme Image with Link */}
                                    <Link href={`/meme/${meme.id}`} className="block overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700 relative">
                                        <img
                                            src={meme.url}
                                            alt={meme.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </Link>

                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(meme);
                                        }}
                                        className={`absolute top-3 right-3 p-2 rounded-full ${favorite
                                            ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                                            : 'bg-gray-100 bg-opacity-70 text-gray-600 dark:bg-gray-800 dark:bg-opacity-70 dark:text-gray-300'} 
                                            transition-all duration-200 transform hover:scale-110 shadow-md`}
                                        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        {favorite ? '❤️' : '🤍'}
                                    </button>

                                    {/* Meme Info */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <Link href={`/meme/${meme.id}`} className="block">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                                {meme.name}
                                            </h3>
                                        </Link>

                                        {/* Metrics - FIXED: Removed 'k' suffix, uses proper values */}
                                        <div className="mt-auto flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <span className="mr-1">❤️</span>
                                                {meme.likes || 0}
                                            </div>

                                            <div className="flex items-center">
                                                <span className="mr-1">💬</span>
                                                {meme.comments || 0}
                                            </div>

                                            <div className="flex items-center">
                                                <span className="mr-1">⏱️</span>
                                                {meme.daysAgo || 0}d
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
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🤣</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 animate-pulse font-medium">{getLoadingMessage()}</p>
                    </div>
                )}
            </main>
        </div>
    );
}