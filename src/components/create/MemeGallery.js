'use client'
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import { useState } from 'react';

export default function MemeGallery({ memes }) {
    const { deleteMeme, toggleLike, isMemeLiked } = useMeme();
    const [activeTab, setActiveTab] = useState('myMemes');

    const handleDelete = (memeId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this meme?')) {
            deleteMeme(memeId);
        }
    };

    const handleLike = (id, e) => {
        e.stopPropagation();
        toggleLike(id);
    };

    // Filter memes based on active tab
    const likedMemes = activeTab === 'myMemes'
        ? memes
        : memes.filter(meme => isMemeLiked(meme.id));

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveTab('myMemes')}
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'myMemes'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    My Memes
                </button>
                <button
                    onClick={() => setActiveTab('likedMemes')}
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'likedMemes'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Liked Memes
                </button>
            </div>

            {/* Meme Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {likedMemes.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 py-10">
                        {activeTab === 'myMemes' ? 'No memes found.' : 'No liked memes found.'}
                    </p>
                ) : (
                    likedMemes.map((meme) => (
                        <motion.div
                            key={meme.id}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden relative group"
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
                                <span className="text-sm text-gray-500">
                                    {new Date(meme.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => handleLike(meme.id, e)}
                                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${isMemeLiked(meme.id) ? 'text-red-500' : 'text-gray-400'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill={isMemeLiked(meme.id) ? "currentColor" : "none"}
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
                                        onClick={(e) => handleDelete(meme.id, e)}
                                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}