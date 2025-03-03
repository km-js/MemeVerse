import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMeme } from '@/contexts/MemeContext';

const TrendingMemesSection = () => {
  const { memes, loading, error, likeMeme, unlikeMeme } = useMeme();
  const [trendingMemes, setTrendingMemes] = useState([]);

  useEffect(() => {
    // Get the first 8 memes for trending section
    setTrendingMemes(memes.slice(0, 8));
  }, [memes]);

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

  const formatDate = (date) => {
    const now = new Date();
    const memeDate = new Date(date);
    const diffDays = Math.floor((now - memeDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const handleLikeToggle = (meme, e) => {
    e.preventDefault(); // Prevent navigation
    
    if (meme.hasLiked) {
      unlikeMeme(meme.id);
    } else {
      likeMeme(meme.id);
    }
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Memes</h2>
          <Link
            href="/explore"
            className="text-blue-500 hover:text-blue-600 font-medium flex items-center"
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {trendingMemes.map((meme) => (
              <motion.div
                key={meme.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/meme/${meme.id}`}>
                  <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={meme.url}
                      alt={meme.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {meme.name}
                  </h3>

                  {/* <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3"> */}
                    {/* <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(meme.timestamp || Date.now() - Math.random() * 1000000000)}
                    </div> */}
                  {/* </div> */}

                  <div className="flex justify-between items-center">
                    {/* Like button */}
                    <button 
                      onClick={(e) => handleLikeToggle(meme, e)}
                      className="flex items-center space-x-1"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill={meme.hasLiked ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: meme.hasLiked ? "#f87171" : "" }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                      <span className={meme.hasLiked ? "text-red-400" : ""}>
                        {meme.likes || 0}
                      </span>
                    </button>

                    {/* Comment count */}
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      <span>
                        {meme.comments?.length || Math.floor(Math.random() * 10)}
                      </span>
                    </div>

                    {/* Share button */}
                    <div className="flex items-center">
                      <button 
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        aria-label="Share meme"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TrendingMemesSection;