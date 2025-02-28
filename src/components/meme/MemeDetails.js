'use client'

import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

export default function MemeDetails({ id }) {
    const { currentMeme } = useMeme();

    if (!currentMeme) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                    </div>
                    <p>Loading meme...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
                <div className="relative h-[500px]">
                    <img
                        src={currentMeme.url}
                        alt={currentMeme.name}
                        className="w-[500px] h-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full"
                    />
                </div>

                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-2">{currentMeme.name}</h1>

                    <div className="flex items-center space-x-4 mt-4">
                        <LikeButton id={id} />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Share</span>
                        </motion.button>
                    </div>

                    <CommentSection id={id} />
                </div>
            </motion.div>
        </div>
    );
}