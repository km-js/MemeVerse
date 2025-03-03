'use client'

import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import { ShareButton } from './ShareButton';

export default function MemeDetails({ id, memeName }) {
  const { currentMeme } = useMeme();

  if (!currentMeme) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium">Loading meme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="md:flex">
          {/* Meme image container */}
          <div className="md:w-3/5 bg-gray-100 dark:bg-gray-900 relative">
            <div className="aspect-square relative overflow-hidden">
              <motion.img
                src={currentMeme.url}
                alt={currentMeme.name}
                className="object-contain w-full h-full"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content section */}
          <div className="md:w-2/5 p-6">
            <div className="mb-6">
              <motion.h1
                className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {currentMeme.name}
              </motion.h1>

              {currentMeme.category && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                  {currentMeme.category}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <motion.div
              className="flex items-center space-x-6 my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LikeButton id={id} />
              <ShareButton memeName={memeName} />
            </motion.div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>

            {/* Comments section */}
            <CommentSection id={id} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}