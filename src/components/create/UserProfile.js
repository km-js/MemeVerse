'use client'
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMeme } from '@/contexts/MemeContext';

export default function UserProfile() {
    const {
        memes,
        userProfile,
        updateProfile,
        updateProfileImage, getLikedMemes
    } = useMeme();

    const [isEditing, setIsEditing] = useState(false);
    const [previewProfileUrl, setPreviewProfileUrl] = useState('');
    const [editedProfile, setEditedProfile] = useState({ ...userProfile });
    const fileInputRef = useRef(null);

    const userMemes = memes; // This could be filtered by user ID if you implement authentication
    const likedMemes = getLikedMemes();

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image/*')) {
            const url = URL.createObjectURL(file);
            setPreviewProfileUrl(url);
        }
    };

    const handleSaveProfile = () => {
        // Save profile data
        updateProfile(editedProfile);

        // Save profile image if changed
        if (previewProfileUrl) {
            updateProfileImage(previewProfileUrl);
        }

        setIsEditing(false);
    };

    // const renderMeme = (meme) => {
    //     const likeInfo = likes[meme.id] || { liked: false, count: 0 };

    //     return (
    //         <motion.div
    //             key={meme.id}
    //             whileHover={{ scale: 1.03 }}
    //             className="bg-white rounded-lg shadow-md overflow-hidden relative group"
    //         >
    //             <div className="relative">
    //                 <img
    //                     src={meme.imageUrl}
    //                     alt={meme.caption}
    //                     className="w-full h-48 object-cover"
    //                 />
    //                 <div
    //                     className={`absolute w-full text-center ${meme.captionPosition === 'top' ? 'top-2' : 'bottom-2'
    //                         } px-2`}
    //                 >
    //                     <p
    //                         style={{
    //                             fontSize: `${meme.fontSize}px`,
    //                             color: meme.fontColor,
    //                             textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    //                             fontFamily: 'Impact, sans-serif',
    //                             lineHeight: 1.2,
    //                             margin: 0,
    //                             padding: '5px 10px',
    //                             wordBreak: 'break-word'
    //                         }}
    //                     >
    //                         {meme.caption}
    //                     </p>
    //                 </div>
    //             </div>

    //             <div className="p-3 flex justify-between items-center">
    //                 <span className="text-sm text-gray-500">
    //                     {new Date(meme.createdAt).toLocaleDateString()}
    //                 </span>
    //                 <div className="flex space-x-2">
    //                     <button
    //                         onClick={() => toggleLike(meme.id)}
    //                         className={`p-1 rounded hover:bg-gray-100 transition-colors ${likeInfo.liked ? 'text-red-500' : 'text-gray-400'
    //                             }`}
    //                     >
    //                         <svg
    //                             xmlns="http://www.w3.org/2000/svg"
    //                             className="h-6 w-6"
    //                             fill={likeInfo.liked ? "currentColor" : "none"}
    //                             viewBox="0 0 24 24"
    //                             stroke="currentColor"
    //                         >
    //                             <path
    //                                 strokeLinecap="round"
    //                                 strokeLinejoin="round"
    //                                 strokeWidth={1.5}
    //                                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    //                             />
    //                         </svg>
    //                         {likeInfo.count > 0 && (
    //                             <span className="text-xs ml-1">{likeInfo.count}</span>
    //                         )}
    //                     </button>
    //                     <button
    //                         onClick={() => deleteMeme(meme.id)}
    //                         className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
    //                     >
    //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    //                         </svg>
    //                     </button>
    //                 </div>
    //             </div>
    //         </motion.div>
    //     );
    // };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-4">
                        <img
                            src={isEditing && previewProfileUrl ? previewProfileUrl : userProfile.profileImage}
                            alt="Profile"
                            className="w-48 h-48 rounded-full object-cover border-4 border-purple-500"
                        />
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfileImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {!isEditing ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors w-full max-w-xs"
                        >
                            Edit Profile
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveProfile}
                            className="bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors w-full max-w-xs"
                        >
                            Save Profile
                        </motion.button>
                    )}
                </div>

                <div className="flex-1">
                    {!isEditing ? (
                        <div>
                            <h2 className="text-3xl font-bold text-purple-800 mb-2">{userProfile.name}</h2>
                            <p className="text-gray-600 mb-4">{userProfile.email}</p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                                <p className="text-gray-700">{userProfile.bio}</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-600">
                                    <span className="font-semibold">{userMemes.length}</span> memes created
                                    {" • "}
                                    <span className="font-semibold">{likedMemes.length}</span> memes liked
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editedProfile.name}
                                    onChange={handleProfileChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editedProfile.email}
                                    onChange={handleProfileChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={editedProfile.bio}
                                    onChange={handleProfileChange}
                                    rows="4"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                ></textarea>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}