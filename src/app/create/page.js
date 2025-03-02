'use client'
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import MemeEditor from '@/components/create/MemeEditor';
import MemePreview from '@/components/create/MemePreview';
import AICaptionGenerator from '@/components/create/AICaptionGenerator';
import MemeGallery from '@/components/create/MemeGallery';

export default function MemeCreator() {
    // State management
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [captionPosition, setCaptionPosition] = useState('top');
    const [fontSize, setFontSize] = useState(32);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('my-memes');
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    const { memes, addMeme, getLikedMemes, likes, toggleLike, deleteMeme } = useMeme();

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file && (file.type.match('image/*') || file.type.match('image/gif'))) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            alert('Please select a valid image or GIF file');
        }
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handlePositionChange = (position) => {
        setCaptionPosition(position);
    };

    const handleFontSizeChange = (size) => {
        setFontSize(size);
    };

    const handleFontColorChange = (color) => {
        setFontColor(color);
    };

    const handleAICaptionGenerated = (generatedCaption) => {
        setCaption(generatedCaption);
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('bg-gray-100', 'dark:bg-gray-700');
        }
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('bg-gray-100', 'dark:bg-gray-700');
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('bg-gray-100', 'dark:bg-gray-700');
        }

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleUpload = async () => {
        if (!selectedFile || !caption) {
            alert('Please select an image and add a caption');
            return;
        }

        setIsUploading(true);

        try {
            // Create FormData to send the image to ImgBB
            const formData = new FormData();
            formData.append('image', selectedFile);

            // Replace with your ImgBB API key
            formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

            // Upload to ImgBB
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'Upload failed');
            }

            // Get the hosted image URL from ImgBB response
            const hostedImageUrl = data.data.url;

            const newMeme = {
                id: Date.now().toString(),
                imageUrl: hostedImageUrl,
                caption,
                captionPosition,
                fontSize,
                fontColor,
                createdAt: new Date().toISOString(),
                deleteUrl: data.data.delete_url
            };

            // Add to Context state
            addMeme(newMeme);

            // Reset form and scroll to the My Memes tab
            resetForm();
            setActiveTab('my-memes');

            // Smooth scroll to the memes section
            document.getElementById('memes-section').scrollIntoView({ behavior: 'smooth' });

            alert('Meme uploaded successfully!');
        } catch (error) {
            console.error('Error uploading meme:', error);
            alert('Error uploading meme: ' + (error.message || 'Please try again.'));
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setCaption('');
        setCaptionPosition('top');
        setFontSize(32);
        setFontColor('#ffffff');
    };

    // Toggle function for the user profile section
    const toggleProfileSection = () => {
        setShowProfileSection(!showProfileSection);
    };

    const renderMeme = (meme) => {
        const likeInfo = likes[meme.id] || { liked: false, count: 0 };

        return (
            <motion.div
                key={meme.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <div className="relative">
                    <img
                        src={meme.imageUrl}
                        alt={meme.caption}
                        className="w-full h-48 object-cover"
                    />
                    <div
                        className={`absolute w-full text-center ${meme.captionPosition === 'top' ? 'top-2' : 'bottom-2'
                            } px-2`}
                    >
                        <p
                            style={{
                                fontSize: `${meme.fontSize}px`,
                                color: meme.fontColor,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                fontFamily: 'Impact, sans-serif',
                                lineHeight: 1.2,
                                margin: 0,
                                padding: '5px 10px',
                                wordBreak: 'break-word'
                            }}
                        >
                            {meme.caption}
                        </p>
                    </div>
                </div>

                <div className="p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(meme.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleLike(meme.id)}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${likeInfo.liked ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill={likeInfo.liked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => deleteMeme(meme.id)}
                            className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <main>
                {/* Header */}
                {/* <section className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Create New Meme
                            </h1>
                            <Link 
                                href="/"
                                className="text-gray-600 dark:text-gray-300 hover:text-vibrant-pink transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </section> */}

                <section className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Create New Meme
                            </h1>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleProfileSection}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-light-yellow transition-colors"
                                >
                                    {!isLoading && userProfile && (
                                        <div className="flex items-center">
                                            <img
                                                src={userProfile.profilePic}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover mr-2"
                                            />
                                            <span className="hidden md:inline">{userProfile.name}</span>
                                        </div>
                                    )}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>
                                <Link
                                    href="/"
                                    className="text-gray-600 dark:text-gray-300 hover:text-vibrant-pink transition-colors flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="hidden md:inline">Back to Home</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conditionally render the User Profile section */}
                {showProfileSection && !isLoading && (
                    <UserProfile userProfile={userProfile} setUserProfile={setUserProfile} />
                )}

                {/* Create Meme Content */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-6xl mx-auto"
                        >
                            {!previewUrl ? (
                                /* Upload Section */
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                    <div
                                        ref={dropZoneRef}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Drag & Drop Image</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                                            Upload an image or GIF to start creating your meme.
                                            We recommend using high-quality images for the best results.
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*,.gif"
                                            className="hidden"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => fileInputRef.current.click()}
                                            className=" bg-light-yellow hover:bg-yellow-300 text-black  px-8 py-4 rounded-lg font-medium shadow-md"
                                        >
                                            Choose Image
                                        </motion.button>
                                    </div>
                                </div>
                            ) : (
                                /* Edit Section */
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customize Your Meme</h3>

                                        <MemeEditor
                                            caption={caption}
                                            onCaptionChange={handleCaptionChange}
                                            captionPosition={captionPosition}
                                            onPositionChange={handlePositionChange}
                                            fontSize={fontSize}
                                            onFontSizeChange={handleFontSizeChange}
                                            fontColor={fontColor}
                                            onFontColorChange={handleFontColorChange}
                                        />

                                        <div className="mt-8">
                                            <button
                                                onClick={() => {
                                                    setPreviewUrl('');
                                                    setSelectedFile(null);
                                                }}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Choose a different image
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preview</h3>

                                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                            <MemePreview
                                                imageUrl={previewUrl}
                                                caption={caption}
                                                captionPosition={captionPosition}
                                                fontSize={fontSize}
                                                fontColor={fontColor}
                                            />
                                        </div>

                                        <AICaptionGenerator
                                            imageUrl={previewUrl}
                                            onCaptionGenerated={handleAICaptionGenerated}
                                        />

                                        <div className="mt-8 flex flex-wrap gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-green-300 shadow-md"
                                            >
                                                {isUploading ? 'Uploading...' : 'Save Meme'}
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={resetForm}
                                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-md"
                                            >
                                                Cancel
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* Tips Section */}
                {previewUrl && (
                    <section className="py-8">
                        <div className="container mx-auto px-4">
                            <div className="max-w-6xl mx-auto bg-light-yellow dark:bg-gray-700 rounded-xl p-6 shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">💡 Meme Creation Tips</h3>
                                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                                    <li>Keep your captions short and punchy for maximum impact</li>
                                    <li>Experiment with different font sizes for emphasis</li>
                                    <li>Use contrasting colors for better readability</li>
                                    <li>Try using the AI Caption Generator for inspiration</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                )}

                {/* Divider */}
                {/* <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center">
                            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                            <span className="px-4 text-gray-500 dark:text-gray-400 text-sm uppercase">Your Memes</span>
                            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                        </div>
                    </div>
                </div> */}

                <MemeGallery />

                {/* Tab Navigation */}
                {/* <section id="memes-section" className="bg-white dark:bg-gray-800 shadow-md">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('my-memes')}
                                    className={`py-4 px-6 font-medium text-lg ${activeTab === 'my-memes' ? 'text-vibrant-pink border-b-2 border-vibrant-pink' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    My Memes
                                </button>
                                <button
                                    onClick={() => setActiveTab('liked-memes')}
                                    className={`py-4 px-6 font-medium text-lg ${activeTab === 'liked-memes' ? 'text-vibrant-pink border-b-2 border-vibrant-pink' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    Liked Memes
                                </button>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Content Sections */}
                {/* <section className="py-12">
                    <div className="container mx-auto px-4">
                        {activeTab === 'my-memes' && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                                className="max-w-6xl mx-auto"
                            >
                                {memes.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Memes Yet</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">Upload an image above to create your first meme</p>
                                        <button
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="bg-vibrant-pink hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
                                        >
                                            Create a Meme
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {memes.map(meme => renderMeme(meme))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'liked-memes' && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                                className="max-w-6xl mx-auto"
                            >
                                {Object.keys(likes).filter(id => likes[id].liked).length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Liked Memes Yet</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">Like some memes to see them appear here</p>
                                        <button
                                            onClick={() => setActiveTab('my-memes')}
                                            className="bg-vibrant-pink hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
                                        >
                                            Go to My Memes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {memes.filter(meme => likes[meme.id]?.liked).map(meme => renderMeme(meme))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </section> */}
            </main>
        </div>
    );
}