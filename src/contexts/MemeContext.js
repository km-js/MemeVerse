'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { getAllMemes, getMemeById, generateMeme } from '@/utils/memeApi';

// Create the context
const MemeContext = createContext();

// Provider component
export function MemeProvider({ children }) {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedMemes, setGeneratedMemes] = useState([]);

  // Generate random comments
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

    // Generate random number of comments (0-5)
    const numComments = Math.floor(Math.random() * 6);
    const memeComments = [];

    for (let i = 0; i < numComments; i++) {
      const commentIndex = Math.floor(Math.random() * commentTexts.length);
      memeComments.push({
        id: `${memeId}-comment-${i}`,
        memeId,
        text: commentTexts[commentIndex],
        user: `user${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 604800000)) // Random time in the last week
      });
    }

    return memeComments;
  };

  // Generate random like counts for each meme
  const generateRandomLikes = (memeId) => {
    // Random like count between 5 and 500
    return Math.floor(Math.random() * 496) + 5;
  };

  // Generate random upload date within the last 6 months
  const generateRandomUploadDate = () => {
    const now = new Date();
    // Random date between now and 6 months ago
    const randomTime = now.getTime() - Math.floor(Math.random() * 15778800000); // ~6 months in milliseconds
    return new Date(randomTime);
  };

  // Fetch memes from your existing API
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
            hasLiked: false,
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

  // Get a meme by id using your existing API
  const getMeme = async (id) => {
    try {
      const existingMeme = [...memes, ...generatedMemes].find(m => m.id === id);
      if (existingMeme) {
        return existingMeme;
      }

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
        hasLiked: false,
        comments: memeComments,
        commentCount: memeComments.length
      };
    } catch (error) {
      console.error('Error fetching meme:', error);
      return null;
    }
  };

  // Set current meme by ID
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

  // Like a meme
  const likeMeme = (id) => {
    const memeToAdd = [...memes, ...generatedMemes].find(meme => meme.id === id);
    
    if (!memeToAdd) {
      console.error('Meme not found:', id);
      return;
    }

    // Update likedMemes with hasLiked set to true
    setLikedMemes(prev => {
      if (!prev.some(meme => meme.id === id)) {
        return [...prev, { ...memeToAdd, hasLiked: true }];
      }
      return prev;
    });

    // Update likes count in the memes array
    setMemes(prev => 
      prev.map(meme => 
        meme.id === id 
          ? { ...meme, likes: meme.likes + 1, hasLiked: true } 
          : meme
      )
    );

    // Update likes count in the generated memes array if applicable
    setGeneratedMemes(prev => 
      prev.map(meme => 
        meme.id === id 
          ? { ...meme, likes: meme.likes + 1, hasLiked: true } 
          : meme
      )
    );

    // If this is the current meme, update it
    if (currentMeme && currentMeme.id === id) {
      setCurrentMeme(prev => ({
        ...prev,
        likes: prev.likes + 1,
        hasLiked: true
      }));
    }
  };

  // Unlike a meme
  const unlikeMeme = (id) => {
    setLikedMemes(prev => prev.filter(meme => meme.id !== id));

    setMemes(prev => 
      prev.map(meme => 
        meme.id === id 
          ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } 
          : meme
      )
    );

    setGeneratedMemes(prev => 
      prev.map(meme => 
        meme.id === id 
          ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } 
          : meme
      )
    );

    if (currentMeme && currentMeme.id === id) {
      setCurrentMeme(prev => ({
        ...prev,
        likes: Math.max(prev.likes - 1, 0),
        hasLiked: false
      }));
    }
  };

  // Toggle like status
  const toggleLike = (id) => {
    const meme = memes.find(m => m.id === id) || generatedMemes.find(m => m.id === id);
    if (meme) {
      if (meme.hasLiked) {
        unlikeMeme(id);
      } else {
        likeMeme(id);
      }
    }
  };

  // Add a comment to a meme
  const addComment = (memeId, text) => {
    const newComment = {
      id: `${memeId}-comment-${Date.now()}`,
      memeId,
      text,
      user: `user${Math.floor(Math.random() * 1000)}`, // Random user ID for demo
      timestamp: new Date()
    };

    setMemes(prev => 
      prev.map(meme => {
        if (meme.id === memeId) {
          const updatedComments = [...(meme.comments || []), newComment];
          return {
            ...meme, 
            comments: updatedComments,
            commentCount: updatedComments.length
          };
        }
        return meme;
      })
    );

    setGeneratedMemes(prev => 
      prev.map(meme => {
        if (meme.id === memeId) {
          const updatedComments = [...(meme.comments || []), newComment];
          return {
            ...meme, 
            comments: updatedComments,
            commentCount: updatedComments.length
          };
        }
        return meme;
      })
    );

    if (currentMeme && currentMeme.id === memeId) {
      setCurrentMeme(prev => {
        const updatedComments = [...(prev.comments || []), newComment];
        return {
          ...prev,
          comments: updatedComments,
          commentCount: updatedComments.length
        };
      });
    }
  };

  // Generate a custom meme using your existing API
  const createMeme = async (templateId, topText, bottomText) => {
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

      setGeneratedMemes(prev => [newMeme, ...prev]);

      return newMeme;
    } catch (error) {
      console.error('Error generating meme:', error);
      throw error;
    }
  };

  // Get trending memes
  const getTrendingMemes = () => {
    return memes.filter(meme => meme.trending);
  };

  // Get new memes
  const getNewMemes = () => {
    return memes.filter(meme => meme.isNew);
  };

  // Get generated memes
  const getGeneratedMemes = () => {
    return generatedMemes;
  };

  // Get memes liked by the user
  const getLikedMemes = () => {
    return likedMemes;
  };

  // Value to be provided to consumers
  const value = {
    memes,
    likedMemes: getLikedMemes(),
    currentMeme,
    loading,
    getMeme,
    likeMeme,
    unlikeMeme,
    toggleLike, // Added toggleLike to context value
    addComment,
    setCurrentMeme,
    setCurrentMemeById,
    getTrendingMemes,
    getNewMemes,
    createMeme,
    getGeneratedMemes,
  };

  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  );
}

// Custom hook for using the context
export const useMeme = () => {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
};