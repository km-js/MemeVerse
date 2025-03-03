'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMeme } from '@/contexts/MemeContext';
import { Heart, MessageCircle, Share2, ExternalLink, Download } from 'lucide-react';

export default function MemeCard({ meme, isDetailed = false }) {
  const router = useRouter();
  const {
    likeMeme,
    unlikeMeme,
    addComment,
    setCurrentMeme,
    comments
  } = useMeme();

  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Get comments for this meme
  const memeComments = comments?.filter(c => c.memeId === meme.id) || [];

  // Handle liking/unliking
  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (meme.hasLiked) {
      unlikeMeme(meme.id);
    } else {
      likeMeme(meme.id);
    }
  };

  // Navigate to meme page when clicking comment
  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMeme(meme);
    router.push(`/meme/${meme.id}`);
  };

  // Handle share functionality
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create the URL to the meme
    const memeUrl = `${window.location.origin}/meme/${meme.id}`;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: meme.name,
        text: `Check out this meme: ${meme.name}`,
        url: memeUrl,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(memeUrl)
        .then(() => {
          // Could add a toast notification here
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Handle card click to navigate to detail page
  const handleCardClick = () => {
    setCurrentMeme(meme);
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
    <motion.div
      key={meme.id}
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

        {/* Action Buttons - Improved UI */}
        <div className="mt-auto flex justify-between items-center py-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${meme.hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} 
            />
            <span className={`text-sm font-medium ${meme.hasLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {meme.likes || 0}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCommentClick}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {memeComments.length || meme.comments || 0}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">
              Share
            </span>
          </motion.button>
        </div>

        {/* Time indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span className="inline-flex items-center">
            <span className="mr-1">⏱️</span>
            <span>{meme.daysAgo}d ago</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}