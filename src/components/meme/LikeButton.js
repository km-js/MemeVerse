'use client'

import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';

export default function LikeButton({ id }) {
    const { likes, toggleLike } = useMeme();

    // Get like info for this meme
    const likeInfo = likes[id] || { liked: false, count: 0 };
    const { liked, count } = likeInfo;

    return (
        <motion.button
            onClick={() => toggleLike(id)}
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
        >
            <motion.div
                whileTap={{ scale: 0.8 }}
                animate={liked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                {liked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                )}
            </motion.div>
            <span className={liked ? "text-red-500" : "text-gray-500"}>{count}</span>
        </motion.button>
    );
}