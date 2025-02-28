import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';

const MemeGallery = ({ memes }) => {
    const [selectedMeme, setSelectedMeme] = useState(null);
    const { deleteMeme } = useMeme();

    if (memes.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Your gallery is empty</h3>
                <p className="text-gray-600 mb-6">Upload your first meme to start building your collection!</p>
                <div className="w-32 h-32 mx-auto opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        );
    }

    const handleShare = (meme) => {
        // In a real app, you would implement actual sharing functionality
        alert(`Sharing meme: ${meme.caption}`);
    };

    const handleDownload = (meme) => {
        // In a real app, you would generate and download the actual image
        const link = document.createElement('a');
        link.href = meme.imageUrl;
        link.download = `meme-${meme.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this meme?')) {
            deleteMeme(id);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {memes.map((meme) => (
                    <motion.div
                        key={meme.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div
                            className="h-48 bg-gray-200 cursor-pointer relative"
                            onClick={() => setSelectedMeme(meme)}
                        >
                            <img
                                src={meme.imageUrl}
                                alt={meme.caption}
                                className="w-full h-full object-contain"
                            />
                            <div
                                className={`absolute inset-x-0 p-2 text-center font-bold
                  ${meme.captionPosition === 'top' ? 'top-0' : ''}
                  ${meme.captionPosition === 'center' ? 'top-1/2 transform -translate-y-1/2' : ''}
                  ${meme.captionPosition === 'bottom' ? 'bottom-0' : ''}
                `}
                                style={{
                                    fontSize: `${Math.min(meme.fontSize, 24)}px`,
                                    color: meme.fontColor,
                                    textShadow: '2px 2px 2px rgba(0,0,0,0.8)'
                                }}
                            >
                                {meme.caption}
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-gray-500 text-sm mb-2">
                                Created: {new Date(meme.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex justify-between mt-2">
                                <button
                                    onClick={() => handleShare(meme)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Share
                                </button>

                                <button
                                    onClick={() => handleDownload(meme)}
                                    className="text-green-500 hover:text-green-700"
                                >
                                    Download
                                </button>

                                <button
                                    onClick={() => handleDelete(meme.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedMeme && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Meme Details</h3>
                                <button
                                    onClick={() => setSelectedMeme(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center">
                            <div className="relative mb-4">
                                <img
                                    src={selectedMeme.imageUrl}
                                    alt={selectedMeme.caption}
                                    className="max-w-full max-h-96 object-contain"
                                />
                                <div
                                    className={`absolute inset-x-0 p-2 text-center font-bold
                    ${selectedMeme.captionPosition === 'top' ? 'top-0' : ''}
                    ${selectedMeme.captionPosition === 'center' ? 'top-1/2 transform -translate-y-1/2' : ''}
                    ${selectedMeme.captionPosition === 'bottom' ? 'bottom-0' : ''}
                  `}
                                    style={{
                                        fontSize: `${selectedMeme.fontSize}px`,
                                        color: selectedMeme.fontColor,
                                        textShadow: '2px 2px 2px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    {selectedMeme.caption}
                                </div>
                            </div>

                            <div className="w-full flex justify-around mt-4">
                                <button
                                    onClick={() => handleShare(selectedMeme)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Share Meme
                                </button>

                                <button
                                    onClick={() => handleDownload(selectedMeme)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Download Meme
                                </button>

                                <button
                                    onClick={() => {
                                        handleDelete(selectedMeme.id);
                                        setSelectedMeme(null);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete Meme
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemeGallery;