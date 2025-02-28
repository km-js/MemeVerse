'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';

export default function CommentSection({ id }) {
    const { comments, addComment } = useMeme();
    const [newComment, setNewComment] = useState('');

    // Get comments for this meme
    const memeComments = comments[id] || [];

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        addComment(id, newComment);
        setNewComment('');
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            <div className="mb-4">
                <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <motion.button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={handleAddComment}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Post Comment
                </motion.button>
            </div>

            <div className="space-y-4">
                {memeComments.length === 0 ? (
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                    memeComments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex justify-between">
                                <p className="font-medium">{comment.author}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(comment.date).toLocaleDateString()}
                                </p>
                            </div>
                            <p className="mt-1">{comment.text}</p>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}