'use client'
import { useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import MemeEditor from '@/components/create/MemeEditor';
import MemePreview from '@/components/create/MemePreview';
import MemeGallery from '@/components/create/MemeGallery';
import AICaptionGenerator from '@/components/create/AICaptionGenerator';

export default function MemeCreator() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [captionPosition, setCaptionPosition] = useState('top');
    const [fontSize, setFontSize] = useState(32);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const { memes, addMeme } = useMeme();

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

    // const handleUpload = async () => {
    //     if (!selectedFile || !caption) {
    //         alert('Please select an image and add a caption');
    //         return;
    //     }

    //     setIsUploading(true);

    //     try {
    //         // Simulate upload to Cloudinary/Firebase
    //         // In a real app, you would upload the image to your storage service
    //         await new Promise(resolve => setTimeout(resolve, 1000));

    //         const newMeme = {
    //             id: Date.now().toString(),
    //             imageUrl: previewUrl,
    //             caption,
    //             captionPosition,
    //             fontSize,
    //             fontColor,
    //             createdAt: new Date().toISOString()
    //         };

    //         // Add to Context state
    //         addMeme(newMeme);

    //         // Reset form
    //         setSelectedFile(null);
    //         setPreviewUrl('');
    //         setCaption('');
    //         setCaptionPosition('top');
    //         setFontSize(32);
    //         setFontColor('#ffffff');
    //         setIsEditing(false);

    //         alert('Meme uploaded successfully!');
    //     } catch (error) {
    //         console.error('Error uploading meme:', error);
    //         alert('Error uploading meme. Please try again.');
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

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

            <main className="container mx-auto py-8 px-4">
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