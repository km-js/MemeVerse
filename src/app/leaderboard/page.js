'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import Link from 'next/link';

export default function Leaderboard() {
    const { memes } = useMeme();
    const [activeTab, setActiveTab] = useState('topMemes');
    const [topMemes, setTopMemes] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay for better UX
        setIsLoading(true);

        setTimeout(() => {
            // Get top memes based on likes count
            const sortedMemes = [...memes]
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 10);
            setTopMemes(sortedMemes);

            // Calculate user engagement
            // This assumes memes have a userId or username property
            const userEngagement = memes.reduce((acc, meme) => {
                const user = meme.username || meme.userId || 'Anonymous';
                if (!acc[user]) {
                    acc[user] = {
                        username: user,
                        totalLikes: 0,
                        memeCount: 0,
                        engagement: 0
                    };
                }
                acc[user].totalLikes += (meme.likesCount || 0);
                acc[user].memeCount += 1;
                acc[user].engagement = acc[user].totalLikes * 2 + acc[user].memeCount;
                return acc;
            }, {});

            // Convert to array and sort by engagement score
            const sortedUsers = Object.values(userEngagement)
                .sort((a, b) => b.engagement - a.engagement)
                .slice(0, 10);

            setTopUsers(sortedUsers);
            setIsLoading(false);
        }, 800);
    }, [memes]);

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
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Meme Leaderboard</h1>
                <p className="text-gray-600">Discover the most popular memes and top creators</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <button
                        onClick={() => setActiveTab('topMemes')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'topMemes'
                            ? 'bg-white shadow text-yellow-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Top Memes
                    </button>
                    <button
                        onClick={() => setActiveTab('topUsers')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'topUsers'
                            ? 'bg-white shadow text-yellow-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Top Creators
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {activeTab === 'topMemes' ? (
                        /* Top Memes Section */
                        <motion.div
                            key="memes"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                          
                        >
                            {topMemes.length === 0 ? (
                                <div className="col-span-full text-center py-16">
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="mt-4 text-gray-500">No memes found. Be the first to create popular content!</p>
                                    <Link href="/create" className="mt-4 inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-600 transition-colors">
                                        Create a Meme
                                    </Link>
                                </div>
                            ) : (
                                topMemes.map((meme, index) => (
                                    <motion.div
                                        key={meme.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden relative"
                                        variants={itemVariants}
                                    >
                                        <div className="absolute top-3 left-3 z-10">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-light-yellow text-black font-bold shadow-lg">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="relative">
                                        <Link href={`/meme/${meme.id}`} className="block overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                                            <img
                                                src={meme.url}
                                                alt={meme.name}
                                                className="w-full h-52 object-cover"
                                            />
                                            <div
                                                className={`absolute w-full text-center ${meme.captionPosition === 'top' ? 'top-2' : 'bottom-2'
                                                    } px-2`}
                                            >
                                                {/* <p
                                                    style={{
                                                        fontSize: `${meme.fontSize}px`,
                                                        color: meme.fontColor,
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                                        fontFamily: 'Impact, sans-serif',
                                                        lineHeight: 1.2,
                                                        margin: 0,
                                                        padding: '5px 10px',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    {meme.caption}
                                                </p> */}
                                            </div>
                                            </Link>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-medium">{meme.likes || 0} likes</span>
                                                </div>
                                                {/* <span className="text-sm text-gray-500">by {meme.username || 'Anonymous'}</span> */}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        /* Top Users Section */
                        <motion.div
                            key="users"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-vibrant-pink to-light-yellow">
                                    <h3 className="text-lg leading-6 font-medium text-white">Top Meme Creators</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-blue-100">
                                        Rankings based on likes, meme count, and overall engagement
                                    </p>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {topUsers.length === 0 ? (
                                        <li className="px-4 py-16 text-center text-gray-500">
                                            No user data available yet
                                        </li>
                                    ) : (
                                        topUsers.map((user, index) => (
                                            <motion.li
                                                key={user.username}
                                                className="px-4 py-4 flex items-center"
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold mr-4 ${index === 0 ? 'bg-yellow-400 text-yellow-600' :
                                                    index === 1 ? 'bg-gray-300 text-gray-700' :
                                                        index === 2 ? 'bg-amber-600 text-amber-900' :
                                                            'bg-blue-100 text-blue-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {user.username}
                                                    </p>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                                        <span className="truncate">{user.memeCount} memes • {user.totalLikes} likes</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {user.engagement} pts
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}