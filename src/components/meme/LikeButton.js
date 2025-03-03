'use client'
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import { useState } from 'react';

export default function LikeButton({ id }) {
  const { memes, userMemes, toggleLike } = useMeme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Find the meme in both memes and userMemes arrays
  const currentMeme = [...memes, ...userMemes].find(meme => meme.id === id);
  const hasLiked = currentMeme?.hasLiked || false;
  const likesCount = currentMeme?.likes || 0;

  const handleLike = () => {
    setIsAnimating(true);
    toggleLike(id);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <motion.button
      onClick={handleLike}
      className="flex items-center gap-2 group focus:outline-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <motion.div
          animate={isAnimating ? 
            { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : 
            {}
          }
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {hasLiked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-red-500 fill-current">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-gray-400 group-hover:text-red-500 transition-colors duration-300">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </motion.div>

        {isAnimating && hasLiked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-red-500 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
      </div>

      <span className={`font-medium text-sm ${hasLiked ? "text-red-500" : "text-gray-500"}`}>
        {likesCount > 0 ? (likesCount > 999 ? `${(likesCount/1000).toFixed(1)}k` : likesCount) : "Like"}
      </span>
    </motion.button>
  );
}