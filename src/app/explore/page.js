'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import useLocalStorage from '@/hooks/useLocalStorage';

const MemeExplorer = () => {
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

    //refs
    const observer = useRef();
    const searchInputRef = useRef(null);

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

            //simulating sorting
            if (sort === 'likes') {
                //simulating likes with id values
                filteredMemes = filteredMemes.sort((a, b) => b.id - a.id);
            } else if (sort === 'date') {
                //simulating dates with id values (newer = higher id)
                filteredMemes = filteredMemes.sort((a, b) => b.id - a.id);
            } else if (sort === 'comments') {
                //simulating comment counts with string length
                filteredMemes = filteredMemes.sort((a, b) => b.name.length - a.name.length);
            }

            //simulating pagination
            const itemsPerPage = 10;
            const startIndex = (pageNum - 1) * itemsPerPage;
            const paginatedMemes = filteredMemes.slice(startIndex, startIndex + itemsPerPage);

            //check if there are more memes to load
            setHasMore(startIndex + itemsPerPage < filteredMemes.length);

            //cache the results
            setCachedMemes(prev => ({
                ...prev,
                [cacheKey]: paginatedMemes
            }));

            //update state
            setMemes(prevMemes => pageNum === 1 ? paginatedMemes : [...prevMemes, ...paginatedMemes]);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching memes:', err);
        } finally {
            setLoading(false);
        }
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

    //initial fetch and fetch on parameter changes
    useEffect(() => {
        setMemes([]);
        setPage(1);
        fetchMemes(1);
    }, [category, sortBy]);

    //fetch on page change for infinite scroll
    useEffect(() => {
        if (page > 1 && viewMode === 'infinite') {
            fetchMemes(page);
        }
    }, [page, viewMode]);

    //handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    //handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchMemes(newPage);
        //scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    //animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header Section */}
            <header className="bg-white dark:bg-gray-800 shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meme Explorer</h1>

                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for memes..."
                            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <svg
                            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Filters and Controls */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            {['trending', 'new', 'classic', 'random'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2 rounded-full font-medium ${category === cat
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        } transition-colors`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Sort and View Controls */}
                        <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 
                            dark:border-gray-600 text-gray-800 dark:text-white rounded-lg py-2 
                            pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="likes">Sort by Likes</option>
                                    <option value="date">Sort by Date</option>
                                    <option value="comments">Sort by Comments</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('infinite')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === 'infinite'
                                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                                        }`}
                                >
                                    Infinite
                                </button>
                                <button
                                    onClick={() => setViewMode('pagination')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === 'pagination'
                                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                                        }`}
                                >
                                    Pages
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Status Messages */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                        <p>{error}</p>
                    </div>
                )}

                {memes.length === 0 && !loading && !error && (
                    <div className="text-center py-16">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No memes found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Try changing your search or filters</p>
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

                            return (
                                <motion.div
                                    key={`${meme.id}-${index}`}
                                    ref={isLastElement ? lastMemeElementRef : null}
                                    variants={itemVariants}
                                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                            transition-shadow duration-300 flex flex-col"
                                >
                                    {/* Meme Image */}
                                    <div className="relative overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700">
                                        <img
                                            src={meme.url}
                                            alt={meme.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Meme Info */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                                            {meme.name}
                                        </h3>

                                        {/* Simulated Metrics */}
                                        <div className="mt-auto flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                </svg>
                                                {Math.floor(meme.id / 100)}k
                                            </div>

                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                                </svg>
                                                {meme.name.length}
                                            </div>

                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                {Math.floor(Math.random() * 30)}d
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
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Pagination Controls (shown only in pagination mode) */}
                {viewMode === 'pagination' && memes.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`${page === 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                    } px-3 py-2 rounded-md text-gray-600 dark:text-gray-300`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {[...Array(Math.min(5, Math.max(page + 2, 5)))].map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-4 py-2 rounded-md ${page === pageNum
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={!hasMore}
                                className={`${!hasMore
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                    } px-3 py-2 rounded-md text-gray-600 dark:text-gray-300`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MemeExplorer;


