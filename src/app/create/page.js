'use client'
import { useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import MemeEditor from '@/components/create/MemeEditor';
import MemePreview from '@/components/create/MemePreview';
import MemeGallery from '@/components/create/MemeGallery';
import AICaptionGenerator from '@/components/create/AICaptionGenerator';
import UserProfile from '@/components/create/UserProfile';

export default function MemeCreator() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [captionPosition, setCaptionPosition] = useState('top');
    const [fontSize, setFontSize] = useState(32);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('mymemes');
    const fileInputRef = useRef(null);

    const { memes, addMeme, getLikedMemes, likes, toggleLike, deleteMeme } = useMeme();

    const userMemes = memes; // This could be filtered by user ID if you implement authentication
    const likedMemes = getLikedMemes();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.match('image/*') || file.type.match('image/gif'))) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsEditing(true);
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
                imageUrl: hostedImageUrl, // Use the hosted image URL
                caption,
                captionPosition,
                fontSize,
                fontColor,
                createdAt: new Date().toISOString(),
                deleteUrl: data.data.delete_url // Store delete URL if needed later
            };

            // Add to Context state
            addMeme(newMeme);

            // Reset form
            setSelectedFile(null);
            setPreviewUrl('');
            setCaption('');
            setCaptionPosition('top');
            setFontSize(32);
            setFontColor('#ffffff');
            setIsEditing(false);

            alert('Meme uploaded successfully!');
        } catch (error) {
            console.error('Error uploading meme:', error);
            alert('Error uploading meme: ' + (error.message || 'Please try again.'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setCaption('');
        setIsEditing(false);
    };


    const renderMeme = (meme) => {
        const likeInfo = likes[meme.id] || { liked: false, count: 0 };

        return (
            <motion.div
                key={meme.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-md overflow-hidden relative group"
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
                    <span className="text-sm text-gray-500">
                        {new Date(meme.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleLike(meme.id)}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${likeInfo.liked ? 'text-red-500' : 'text-gray-400'
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
                            {likeInfo.count > 0 && (
                                <span className="text-xs ml-1">{likeInfo.count}</span>
                            )}
                        </button>
                        <button
                            onClick={() => deleteMeme(meme.id)}
                            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
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
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Meme Creator</title>
                <meta name="description" content="Upload and create funny memes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-purple-600 text-white p-4 shadow-md"
            >
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Meme Creator</h1>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors"
                    >
                        Upload New Meme
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,.gif"
                        className="hidden"
                    />
                </div>
            </motion.header>

            <UserProfile />

            <main className="container mx-auto py-4 px-4">
                {isEditing ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
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

                        <div>
                            <MemePreview
                                imageUrl={previewUrl}
                                caption={caption}
                                captionPosition={captionPosition}
                                fontSize={fontSize}
                                fontColor={fontColor}
                            />

                            <AICaptionGenerator
                                imageUrl={previewUrl}
                                onCaptionGenerated={handleAICaptionGenerated}
                            />

                            <div className="mt-6 flex space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium disabled:bg-green-300"
                                >
                                    {isUploading ? 'Uploading...' : 'Save Meme'}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Your Meme Gallery</h2>
                        <MemeGallery memes={memes} />
                    </div>
                )}
            </main>

            <footer className="bg-purple-800 text-white p-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>© 2025 Meme Creator - Create and share your favorite memes!</p>
                </div>
            </footer>
        </div>
    );
}