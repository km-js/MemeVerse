'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MemeCard = ({
    meme,
    toggleLike
}) => {
    // Animation variants
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    const calculateDaysAgo = (date) => {
        const now = new Date();
        const uploadDate = new Date(date);
        const diffTime = now - uploadDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <motion.div
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

                {/* Metrics */}
                <div className="mt-auto flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <button
                            onClick={() => toggleLike(meme.id)}
                            className="mr-1"
                            aria-label={meme.hasLiked ? "Unlike" : "Like"}
                        >
                            {meme.hasLiked ? '❤️' : '🤍'}
                        </button>
                        <span className="font-medium">{meme.likes}</span>
                    </div>
                    <div className="flex items-center">
                        <Link href={`/meme/${meme.id}`} className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                            <span className="mr-1">💬</span>
                            <span className="font-medium">{meme.comments?.length || 0}</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-1">⏱️</span>
                        <span className="font-medium">{calculateDaysAgo(meme.uploadedDate)}d</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MemeCard;