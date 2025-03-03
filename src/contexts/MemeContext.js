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
  const [generatedMemes, setGeneratedMemes] = useState([]);

  // Sync likedMemes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedMemes', JSON.stringify(likedMemes));
    console.log('Liked memes saved to localStorage:', likedMemes);
  }, [likedMemes]);

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

  const generateRandomLikes = (memeId) => Math.floor(Math.random() * 496) + 5;

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
      const existingMeme = [...memes, ...generatedMemes].find(m => m.id === id);
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
    const memeToAdd = [...memes, ...generatedMemes].find(meme => meme.id === id);
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
    setGeneratedMemes(prev => prev.map(meme => meme.id === id ? { ...meme, likes: meme.likes + 1, hasLiked: true } : meme));
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
    setGeneratedMemes(prev => prev.map(meme => meme.id === id ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } : meme));
    if (currentMeme && currentMeme.id === id) {
      setCurrentMeme(prev => ({ ...prev, likes: Math.max(prev.likes - 1, 0), hasLiked: false }));
    }
  };

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
    setGeneratedMemes(prev => 
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

  const getTrendingMemes = () => memes.filter(meme => meme.trending);
  const getNewMemes = () => memes.filter(meme => meme.isNew);
  const getGeneratedMemes = () => generatedMemes;

  const value = {
    memes,
    likedMemes,
    currentMeme,
    loading,
    getMeme,
    likeMeme,
    unlikeMeme,
    toggleLike,
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
};

export const useMeme = () => {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
};