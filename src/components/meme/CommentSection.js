'use client'
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';

export default function CommentSection({ id }) {
  const { memes, userMemes, addComment } = useMeme();
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const textareaRef = useRef(null);

  // Find the meme in both memes and userMemes
  const currentMeme = [...memes, ...userMemes].find(meme => meme.id === id);
  const memeComments = currentMeme?.comments || [];

  // Display max 3 comments initially
  const visibleComments = showAllComments ? memeComments : memeComments.slice(0, 3);
  const hasMoreComments = memeComments.length > 3;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(id, newComment);
    setNewComment('');
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comments {memeComments.length > 0 && `(${memeComments.length})`}
        </h3>
      </div>

      <div className="mb-6 relative">
        <textarea
          ref={textareaRef}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none bg-gray-50 dark:bg-gray-900 dark:text-white"
          rows={1}
          placeholder="Add your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        ></textarea>
        
        <motion.button
          className={`mt-3 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed ${newComment.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAddComment}
          whileHover={newComment.trim().length > 0 ? { scale: 1.02 } : {}}
          whileTap={newComment.trim().length > 0 ? { scale: 0.98 } : {}}
          disabled={newComment.trim().length === 0}
        >
          Post
        </motion.button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {memeComments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {visibleComments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                        {comment.user.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">{comment.user}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-10">{comment.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {hasMoreComments && (
              <motion.button
                onClick={() => setShowAllComments(!showAllComments)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {showAllComments ? 'Show less comments' : `Show all ${memeComments.length} comments`}
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
}