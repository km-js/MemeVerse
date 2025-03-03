'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getAllMemes, getMemeById, generateMeme } from '@/utils/memeApi';

const MemeContext = createContext();

export function MemeProvider({ children }) {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMemes, setUserMemes] = useState([]);

  // Load initial state from localStorage after mount
  useEffect(() => {
    try {
      const savedLikedMemes = typeof window !== 'undefined' && localStorage.getItem('likedMemes');
      if (savedLikedMemes) setLikedMemes(JSON.parse(savedLikedMemes));

      const savedUserMemes = typeof window !== 'undefined' && localStorage.getItem('userMemes');
      if (savedUserMemes) setUserMemes(JSON.parse(savedUserMemes));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Sync likedMemes to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('likedMemes', JSON.stringify(likedMemes));
      }
    } catch (error) {
      console.error('Error saving likedMemes:', error);
    }
  }, [likedMemes]);

  // Sync userMemes to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userMemes', JSON.stringify(userMemes));
      }
    } catch (error) {
      console.error('Error saving userMemes:', error);
    }
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
          const likesCount = generateRandomLikes();
          const memeComments = generateRandomComments(meme.id);
          
          return {
            ...meme,
            trending,
            isNew,
            uploadedDate,
            likes: likesCount,
            hasLiked: likedMemes.some(liked => liked.id === meme.id),
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
      const existingMeme = [...memes, ...userMemes].find(m => m.id === id);
      if (existingMeme) return existingMeme;
      
      const meme = await getMemeById(id);
      const uploadedDate = generateRandomUploadDate();
      const likesCount = generateRandomLikes();
      const memeComments = generateRandomComments(id);
      
      return {
        ...meme,
        trending: Math.random() > 0.8,
        isNew: Math.random() > 0.9,
        uploadedDate,
        likes: likesCount,
        hasLiked: likedMemes.some(liked => liked.id === id),
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
    const memeToAdd = [...memes, ...userMemes].find(meme => meme.id === id);
    if (!memeToAdd) {
      console.error('Meme not found:', id);
      return;
    }

    setLikedMemes(prev => {
      if (!prev.some(meme => meme.id === id)) {
        return [...prev, { ...memeToAdd, hasLiked: true }];
      }
      return prev;
    });

    setMemes(prev => prev.map(meme => 
      meme.id === id ? { ...meme, likes: meme.likes + 1, hasLiked: true } : meme
    ));

    setUserMemes(prev => prev.map(meme => 
      meme.id === id ? { ...meme, likes: meme.likes + 1, hasLiked: true } : meme
    ));

    if (currentMeme?.id === id) {
      setCurrentMeme(prev => ({ 
        ...prev, 
        likes: prev.likes + 1, 
        hasLiked: true 
      }));
    }
  };

  const unlikeMeme = (id) => {
    setLikedMemes(prev => prev.filter(meme => meme.id !== id));
    
    setMemes(prev => prev.map(meme => 
      meme.id === id ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } : meme
    ));

    setUserMemes(prev => prev.map(meme => 
      meme.id === id ? { ...meme, likes: Math.max(meme.likes - 1, 0), hasLiked: false } : meme
    ));

    if (currentMeme?.id === id) {
      setCurrentMeme(prev => ({
        ...prev,
        likes: Math.max(prev.likes - 1, 0),
        hasLiked: false
      }));
    }
  };

  const toggleLike = (id) => {
    const meme = [...memes, ...userMemes].find(m => m.id === id);
    if (meme) {
      meme.hasLiked ? unlikeMeme(id) : likeMeme(id);
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

    const updateMemes = (prevMemes) => prevMemes.map(meme => 
      meme.id === memeId ? {
        ...meme,
        comments: [...(meme.comments || []), newComment],
        commentCount: (meme.comments?.length || 0) + 1
      } : meme
    );

    setMemes(updateMemes);
    setUserMemes(updateMemes);
    setLikedMemes(updateMemes);

    if (currentMeme?.id === memeId) {
      setCurrentMeme(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
        commentCount: (prev.comments?.length || 0) + 1
      }));
    }
  };

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

  const createUserMeme = (newMeme) => {
    setUserMemes(prev => [newMeme, ...prev]);
    return newMeme;
  };

  const getTrendingMemes = () => memes.filter(meme => meme.trending);
  const getNewMemes = () => memes.filter(meme => meme.isNew);
  const getUserMemes = () => userMemes;

  const deleteMeme = (id) => {
    setUserMemes(prev => prev.filter(meme => meme.id !== id));
    setLikedMemes(prev => prev.filter(meme => meme.id !== id));
  };

  const value = {
    memes,
    likedMemes,
    currentMeme,
    loading,
    userMemes,
    getMeme,
    likeMeme,
    unlikeMeme,
    toggleLike,
    addComment,
    setCurrentMeme,
    setCurrentMemeById,
    getTrendingMemes,
    getNewMemes,
    createMeme: createUserMeme,
    createApiMeme,
    getUserMemes,
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