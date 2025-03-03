'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getAllMemes, getMemeById, generateMeme } from '@/utils/memeApi';

const MemeContext = createContext();

export function MemeProvider({ children }) {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState(() => {
    // Load initial state from localStorage
    const savedLikedMemes = localStorage.getItem('likedMemes');
    return savedLikedMemes ? JSON.parse(savedLikedMemes) : [];
  });
  const [currentMeme, setCurrentMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  // Rename generatedMemes to userMemes and load from localStorage
  const [userMemes, setUserMemes] = useState(() => {
    const savedUserMemes = localStorage.getItem('userMemes');
    return savedUserMemes ? JSON.parse(savedUserMemes) : [];
  });

  // Sync likedMemes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedMemes', JSON.stringify(likedMemes));
    console.log('Liked memes saved to localStorage:', likedMemes);
  }, [likedMemes]);

  // Add new effect to sync userMemes to localStorage
  useEffect(() => {
    localStorage.setItem('userMemes', JSON.stringify(userMemes));
    console.log('User memes saved to localStorage:', userMemes);
  }, [userMemes]);

  const generateRandomComments = (memeId) => {
    const commentTexts = [
      "This is hilarious! 😂",
      "I can't stop laughing 🤣",
      "Me every Monday morning lol",
      "Tag someone who needs to see this",
      "This speaks to my soul",
      "Who made this? 💀",
      "Literally me",
      "I feel personally attacked 😅",
      "Saving this one 🔥",
      "My life in a nutshell",
      "Why is this so accurate? 💯",
      "I'm in this picture and I don't like it",
      "Facts tho",
      "Mood forever",
      "This just made my day 👏"
    ];
    const numComments = Math.floor(Math.random() * 6);
    const memeComments = [];
    for (let i = 0; i < numComments; i++) {
      const commentIndex = Math.floor(Math.random() * commentTexts.length);
      memeComments.push({
        id: `${memeId}-comment-${i}`,
        memeId,
        text: commentTexts[commentIndex],
        user: `user${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 604800000))
      });
    }
    return memeComments;
  };

  const generateRandomLikes = () => Math.floor(Math.random() * 496) + 5;

  const generateRandomUploadDate = () => {
    const now = new Date();
    const randomTime = now.getTime() - Math.floor(Math.random() * 15778800000);
    return new Date(randomTime);
  };

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        const fetchedMemes = await getAllMemes();
        const processedMemes = fetchedMemes.map(meme => {
          const trending = Math.random() > 0.8;
          const isNew = !trending && Math.random() > 0.9;
          const uploadedDate = generateRandomUploadDate();
          const likesCount = generateRandomLikes(meme.id);
          const memeComments = generateRandomComments(meme.id);
          return {
            ...meme,
            trending,
            isNew,
            uploadedDate,
            likes: likesCount,
            hasLiked: likedMemes.some(liked => liked.id === meme.id), // Sync with likedMemes
            comments: memeComments,
            commentCount: memeComments.length
          };
        });
        setMemes(processedMemes);
      } catch (error) {
        console.error('Error fetching memes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemes();
  }, []);

  const getMeme = async (id) => {
    try {
      // Update to check userMemes instead of generatedMemes
      const existingMeme = [...memes, ...userMemes].find(m => m.id === id);
      if (existingMeme) return existingMeme;
      const meme = await getMemeById(id);
      const uploadedDate = generateRandomUploadDate();
      const likesCount = generateRandomLikes(id);
      const memeComments = generateRandomComments(id);
      return {
        ...meme,
        trending: Math.random() > 0.8,
        isNew: Math.random() > 0.9,
        uploadedDate,
        likes: likesCount,
        hasLiked: likedMemes.some(liked => liked.id === id), // Sync with likedMemes
        comments: memeComments,
        commentCount: memeComments.length
      };
    } catch (error) {
      console.error('Error fetching meme:', error);
      return null;
    }
  };

  const setCurrentMemeById = async (id) => {
    setLoading(true);
    try {
      const meme = await getMeme(id);
      setCurrentMeme(meme);
    } catch (error) {
      console.error('Error setting current meme:', error);
    } finally {
      setLoading(false);
    }
  };

  const likeMeme = (id) => {
    // Update to check userMemes instead of generatedMemes
    const memeToAdd = [...memes, ...userMemes].find(meme => meme.id === id);
    if (!memeToAdd) {
      console.error('Meme not found:', id);
      return;
    }
    setLikedMemes(prev => {
      if (!prev.some(meme => meme.id === id)) {
        const newLiked = [...prev, { ...memeToAdd, hasLiked: true }];
        console.log('Liked memes after like:', newLiked);
        return newLiked;
      }
      return prev;
    });
    setMemes(prev => prev.map(meme => meme.id === id ? { ...meme, likes: meme.likes + 1, hasLiked: true } : meme));
    // Update userMemes instead of generatedMemes
    setUserMemes(prev => prev.map(meme => meme.id === id ? { ...meme, likes: meme.likes + 1, hasLiked: true } : meme));
    if (currentMeme && currentMeme.id === id) {
      setCurrentMeme(prev => ({ ...prev, likes: prev.likes + 1, hasLiked: true }));
    }
  };

  const unlikeMeme = (id) => {
    setLikedMemes(prev => {
      const newLiked = prev.filter(meme => meme.id !== id);
      console.log('Liked memes after unlike:', newLiked);
      return newLiked;
    });
    setMemes(prev => prev.map(meme => meme.id === id ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } : meme));
    // Update userMemes instead of generatedMemes
    setUserMemes(prev => prev.map(meme => meme.id === id ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } : meme));
    if (currentMeme && currentMeme.id === id) {
      setCurrentMeme(prev => ({ ...prev, likes: Math.max(prev.likes - 1, 0), hasLiked: false }));
    }
  };

  const toggleLike = (id) => {
    // Update to check userMemes instead of generatedMemes
    const meme = memes.find(m => m.id === id) || userMemes.find(m => m.id === id);
    if (meme) {
      if (meme.hasLiked) {
        unlikeMeme(id);
      } else {
        likeMeme(id);
      }
    }
  };

  const addComment = (memeId, text) => {
    const newComment = {
      id: `${memeId}-comment-${Date.now()}`,
      memeId,
      text,
      user: `user${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date()
    };
    setMemes(prev => 
      prev.map(meme => {
        if (meme.id === memeId) {
          const updatedComments = [...(meme.comments || []), newComment];
          return { ...meme, comments: updatedComments, commentCount: updatedComments.length };
        }
        return meme;
      })
    );
    // Update userMemes instead of generatedMemes
    setUserMemes(prev => 
      prev.map(meme => {
        if (meme.id === memeId) {
          const updatedComments = [...(meme.comments || []), newComment];
          return { ...meme, comments: updatedComments, commentCount: updatedComments.length };
        }
        return meme;
      })
    );
    setLikedMemes(prev =>
      prev.map(meme => {
        if (meme.id === memeId) {
          const updatedComments = [...(meme.comments || []), newComment];
          return { ...meme, comments: updatedComments, commentCount: updatedComments.length };
        }
        return meme;
      })
    );
    if (currentMeme && currentMeme.id === memeId) {
      setCurrentMeme(prev => {
        const updatedComments = [...(prev.comments || []), newComment];
        return { ...prev, comments: updatedComments, commentCount: updatedComments.length };
      });
    }
  };

  // Rename createMeme function to createApiMeme and add createUserMeme function
  const createApiMeme = async (templateId, topText, bottomText) => {
    try {
      const url = await generateMeme(templateId, topText, bottomText);
      const newMeme = {
        id: `generated-${Date.now()}`,
        name: `Custom Meme - ${new Date().toLocaleDateString()}`,
        url,
        width: 500,
        height: 500,
        likes: 0,
        hasLiked: false,
        isNew: true,
        trending: false,
        isCustom: true,
        uploadedDate: new Date(),
        comments: [],
        commentCount: 0
      };
      setUserMemes(prev => [newMeme, ...prev]);
      return newMeme;
    } catch (error) {
      console.error('Error generating meme:', error);
      throw error;
    }
  };

  // Add new function to handle user-uploaded memes
  const createUserMeme = (newMeme) => {
    setUserMemes(prev => [newMeme, ...prev]);
    return newMeme;
  };

  const getTrendingMemes = () => memes.filter(meme => meme.trending);
  const getNewMemes = () => memes.filter(meme => meme.isNew);
  // Update to return userMemes instead of generatedMemes
  const getUserMemes = () => userMemes;

  // Function to delete user meme
  const deleteMeme = (id) => {
    setUserMemes(prev => prev.filter(meme => meme.id !== id));
    // Also remove from liked memes if present
    setLikedMemes(prev => prev.filter(meme => meme.id !== id));
  };

  const value = {
    memes,
    likedMemes,
    currentMeme,
    loading,
    userMemes, // Expose userMemes instead of generatedMemes
    getMeme,
    likeMeme,
    unlikeMeme,
    toggleLike,
    addComment,
    setCurrentMeme,
    setCurrentMemeById,
    getTrendingMemes,
    getNewMemes,
    createMeme: createUserMeme, // Change the main createMeme to point to createUserMeme
    createApiMeme, // Expose the API-based meme creation as a separate function
    getUserMemes, // Update function name
    deleteMeme,
  };

  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  );
};

export const useMeme = () => {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
};