'use client'
import { useMeme } from '@/contexts/MemeContext';
import { motion } from 'framer-motion';

import { useState } from "react";

export default function MemeGallery() {
    // State management
    const [activeTab, setActiveTab] = useState('my-memes');


    const { memes, addMeme, getLikedMemes, likes, toggleLike, deleteMeme } = useMeme();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.5
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

    const renderMeme = (meme) => {
        const likeInfo = likes[meme.id] || { liked: false, count: 0 };

        return (
            <motion.div
                key={meme.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <div className="relative">
                    <img
                        src={meme.imageUrl}
                        alt={meme.caption}
                        className="w-full h-48 object-cover"
                    />
                    <div
                        className={`absolute w-full text-center ${meme.captionPosition === 'top' ? 'top-2' : 'bottom-2'
                            } px-2`}
                    >
                        <p
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
                        </p>
                    </div>
                </div>

                <div className="p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(meme.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleLike(meme.id)}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${likeInfo.liked ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill={likeInfo.liked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => deleteMeme(meme.id)}
                            className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <main>
            {/* Tab Navigation */}
            <section id="memes-section" className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('my-memes')}
                                className={`py-4 px-6 font-medium text-lg ${activeTab === 'my-memes' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-600 dark:text-gray-300'}`}
                            >
                                My Memes
                            </button>
                            <button
                                onClick={() => setActiveTab('liked-memes')}
                                className={`py-4 px-6 font-medium text-lg ${activeTab === 'liked-memes' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-600 dark:text-gray-300'}`}
                            >
                                Liked Memes
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {activeTab === 'my-memes' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-6xl mx-auto"
                        >
                            {memes.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Memes Yet</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">Upload an image above to create your first meme</p>
                                    <button
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="bg-yellow-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
                                    >
                                        Create a Meme
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memes.map(meme => renderMeme(meme))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'liked-memes' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-6xl mx-auto"
                        >
                            {Object.keys(likes).filter(id => likes[id].liked).length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Liked Memes Yet</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">Like some memes to see them appear here</p>
                                    <button
                                        onClick={() => setActiveTab('my-memes')}
                                        className="bg-yellow-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
                                    >
                                        Go to My Memes
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memes.filter(meme => likes[meme.id]?.liked).map(meme => renderMeme(meme))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    )
}
