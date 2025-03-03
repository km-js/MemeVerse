'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';
import MemeCard from '@/components/MemeCard';

// Default avatar SVG
const DefaultAvatar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="100" fill="#FFD54F" />
        <circle cx="70" cy="80" r="10" fill="#4A4A4A" />
        <circle cx="130" cy="80" r="10" fill="#4A4A4A" />
        <path d="M65 125 C82 145, 118 145, 135 125" stroke="#4A4A4A" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
);

export default function UserProfile() {
    // State management
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('my-memes');
    const [userProfile, setUserProfile] = useState({
        name: 'Meme Creator',
        bio: 'I love creating hilarious memes! 😂',
        profilePic: null // Start with null for hydration safety
    });

    const [hasMounted, setHasMounted] = useState(false);

    const [tempProfile, setTempProfile] = useState({ ...userProfile });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const { memes, likes, toggleLike, deleteMeme, likedMemes } = useMeme();

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

    // Set isClient to true when component mounts
    useEffect(() => {
        setHasMounted(true);
        setIsClient(true);

        // Load user profile from localStorage only on client-side
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setUserProfile(parsedProfile);
            setTempProfile(parsedProfile);
        }
    }, []);

    if (!hasMounted) {
        return null; // Or a loading skeleton
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempProfile({
            ...tempProfile,
            [name]: value
        });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image/*')) {
            setProfilePicFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile({
                    ...tempProfile,
                    profilePic: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let profilePicUrl = userProfile.profilePic;

            // Upload profile picture if changed
            if (profilePicFile) {
                const formData = new FormData();
                formData.append('image', profilePicFile);
                formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    profilePicUrl = data.data.url;
                }
            }

            // Update profile
            const updatedProfile = {
                ...tempProfile,
                profilePic: profilePicUrl
            };

            setUserProfile(updatedProfile);
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelEdit = () => {
        setTempProfile({ ...userProfile });
        setProfilePicFile(null);
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    //   const getRandomEmoji = () => {
    //     const emojis = ['😂', '🤣', '😎', '🔥', '💯', '👽', '🚀', '✨', '🎉', '🤪'];
    //     return emojis[Math.floor(Math.random() * emojis.length)];
    //   };

    const renderMeme = (meme) => {
        // const likeInfo = likes[meme.id] || { liked: false, count: 0 };
        // const randomEmoji = getRandomEmoji();

        return (
            <motion.div
                key={meme.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="relative">
                    <img
                        src={meme.imageUrl}
                        alt={meme.caption}
                        className="w-full h-48 object-cover"
                    />
                    <div
                        className={`absolute w-full text-center ${meme.captionPosition === 'top' ? 'top-2' : 'bottom-2'} px-2`}
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
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        {/* <span className="mr-1">📅</span> */}
                        {formatDate(meme.createdAt)}
                    </span>
                    <div className="flex space-x-2">
                        {/* <button
                            onClick={() => toggleLike(meme.id)}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${likeInfo.liked ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
                            aria-label={likeInfo.liked ? "Unlike" : "Like"}
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
                        </button> */}
                        <button
                            onClick={() => deleteMeme(meme.id)}
                            className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Delete"
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

                {/* Profile Section */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="flex flex-col md:flex-row md:space-x-8">
                                            <div className="mb-6 md:mb-0">
                                                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 bg-yellow-100 dark:bg-yellow-900">
                                                    {tempProfile.profilePic ? (
                                                        <img
                                                            src={tempProfile.profilePic}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <DefaultAvatar />
                                                    )}
                                                    <label className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1 cursor-pointer">
                                                        Change
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleProfilePicChange}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={tempProfile.name}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2"
                                                        placeholder="Your name"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Bio
                                                    </label>
                                                    <textarea
                                                        id="bio"
                                                        name="bio"
                                                        rows="4"
                                                        value={tempProfile.bio}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2"
                                                        placeholder="Tell us about yourself..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="mr-1">✨</span> Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:space-x-8">
                                        <div className="mb-6 md:mb-0 flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-yellow-100 dark:bg-yellow-900">
                                                {isClient && userProfile.profilePic ? (
                                                    <img
                                                        src={userProfile.profilePic}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <DefaultAvatar />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                                    <span className="mr-2">👋</span>
                                                    {userProfile.name}
                                                </h2>
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="text-yellow-500 hover:text-yellow-600 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Edit Profile
                                                </button>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                                                    <span className="mr-2">📝</span>Bio
                                                </h3>
                                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                                    {userProfile.bio || "No bio provided yet. Click 'Edit Profile' to add one!"}
                                                </p>
                                            </div>

                                            <div className="mt-6 flex space-x-6">
                                                <div className="text-center bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                                                        <span className="mr-2">🖼️</span>{memes.length}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Memes</div>
                                                </div>
                                                <div className="text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center" suppressHydrationWarning>
                                                        <span className="mr-2">❤️</span>
                                                        {/* {Object.values(likes).filter(like => like.liked).length} */}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Tab Navigation */}
                <section id="memes-section" className="bg-white dark:bg-gray-800 shadow-md mt-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto flex justify-between">
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('my-memes')}
                                    className={`py-4 px-6 font-medium text-lg flex items-center ${activeTab === 'my-memes' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    <span className="mr-2">🎨</span>My Memes
                                </button>
                                <button
                                    onClick={() => setActiveTab('liked-memes')}
                                    className={`py-4 px-6 font-medium text-lg flex items-center ${activeTab === 'liked-memes' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    <span className="mr-2">❤️</span>Liked Memes
                                </button>

                            </div>
                            <div>  <Link
                                href="/create"
                                className="py-4 px-6 font-medium text-lg flex items-center text-gray-600 dark:text-gray-300"
                            >
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg> */}
                                <span className="mr-2">🌱</span>Create Meme
                                {/* <span className="hidden md:inline">Create Meme</span> */}
                            </Link></div>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <section className="py-12">
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
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Memes Yet 😢</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">Time to share your creativity with the world!</p>
                                        <Link href="/create">
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transform transition hover:scale-105 flex items-center mx-auto">
                                                <span className="mr-2">🚀</span>Create a Meme
                                            </button>
                                        </Link>
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
                                {likedMemes.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Liked Memes Yet 🤔</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">Find some awesome memes and show them some love!</p>
                                        <Link href="/">
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transform transition hover:scale-105 flex items-center mx-auto">
                                                <span className="mr-2">🔍</span>Browse Memes
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {likedMemes.map(meme => <MemeCard meme={meme} key={meme.id} />)}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}