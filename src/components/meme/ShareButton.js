'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export function ShareButton ({ memeName}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this meme: ${memeName}`,
          url: currentUrl
        });
      } else {
        setIsDropdownOpen(!isDropdownOpen);
      }
    } catch (error) {
      console.log('Sharing cancelled', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard! 📋');
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error('Failed to copy link 😢');
    }
  };

  const shareOnSocial = (platform) => {
    const message = `Check out this awesome meme: ${memeName}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(currentUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message + ' ' + currentUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(message)}`
    };

    window.open(urls[platform], '_blank');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>Share</span>
      </motion.button>

      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
        >
          <div className="py-1">
            <button
              onClick={copyToClipboard}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Copy Link
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Twitter
            </button>
            <button
              onClick={() => shareOnSocial('facebook')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Facebook
            </button>
            <button
              onClick={() => shareOnSocial('whatsapp')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              WhatsApp
            </button>
            <button
              onClick={() => shareOnSocial('reddit')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Reddit
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};





 