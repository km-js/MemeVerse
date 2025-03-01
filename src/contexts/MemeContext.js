import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  memes: [],
  currentMeme: null,
  likes: {},
  comments: {},
  userProfile: {
    name: 'Username',
    bio: 'Tell us about yourself...',
    email: 'user@example.com',
    profileImage: '/default-avatar.png'
  },
  likedMemes: [] // Array of meme IDs that the user has liked
};

// Action types
const ADD_MEME = 'ADD_MEME';
const DELETE_MEME = 'DELETE_MEME';
const SET_CURRENT_MEME = 'SET_CURRENT_MEME';
const TOGGLE_LIKE = 'TOGGLE_LIKE';
const ADD_COMMENT = 'ADD_COMMENT';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE';

// Reducer function
const memeReducer = (state, action) => {
  switch (action.type) {
    case ADD_MEME:
      return {
        ...state,
        memes: [...state.memes, action.payload]
      };
    case DELETE_MEME:
      return {
        ...state,
        memes: state.memes.filter(meme => meme.id !== action.payload)
      };
    case SET_CURRENT_MEME:
      return {
        ...state,
        currentMeme: action.payload
      };
    case TOGGLE_LIKE:
      const memeId = action.payload;
      const currentLikeState = state.likes[memeId] || { liked: false, count: 0 };
      const isCurrentlyLiked = currentLikeState.liked;
      
      // Update likedMemes array
      let updatedLikedMemes;
      if (isCurrentlyLiked) {
        // Remove from likedMemes if currently liked
        updatedLikedMemes = state.likedMemes.filter(id => id !== memeId);
      } else {
        // Add to likedMemes if not currently liked
        updatedLikedMemes = [...state.likedMemes, memeId];
      }
      
      return {
        ...state,
        likes: {
          ...state.likes,
          [memeId]: {
            liked: !isCurrentlyLiked,
            count: isCurrentlyLiked
              ? Math.max(0, currentLikeState.count - 1)
              : currentLikeState.count + 1
          }
        },
        likedMemes: updatedLikedMemes
      };
    case ADD_COMMENT:
      const { id, comment } = action.payload;
      return {
        ...state,
        comments: {
          ...state.comments,
          [id]: [...(state.comments[id] || []), comment]
        }
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload
        }
      };
    case UPDATE_PROFILE_IMAGE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          profileImage: action.payload
        }
      };
    default:
      return state;
  }
};

// Create context
const MemeContext = createContext();

// Context provider
export const MemeProvider = ({ children }) => {
  // Load initial state from localStorage
  const loadInitialState = () => {
    if (typeof window === 'undefined') return initialState;
    try {
      const savedMemes = localStorage.getItem('memes');
      const savedLikes = localStorage.getItem('meme-likes');
      const savedComments = localStorage.getItem('meme-comments');
      const savedUserProfile = localStorage.getItem('user-profile');
      const savedLikedMemes = localStorage.getItem('liked-memes');

      return {
        memes: savedMemes ? JSON.parse(savedMemes) : initialState.memes,
        currentMeme: initialState.currentMeme,
        likes: savedLikes ? JSON.parse(savedLikes) : initialState.likes,
        comments: savedComments ? JSON.parse(savedComments) : initialState.comments,
        userProfile: savedUserProfile ? JSON.parse(savedUserProfile) : initialState.userProfile,
        likedMemes: savedLikedMemes ? JSON.parse(savedLikedMemes) : initialState.likedMemes
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(memeReducer, null, loadInitialState);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('memes', JSON.stringify(state.memes));
      localStorage.setItem('meme-likes', JSON.stringify(state.likes));
      localStorage.setItem('meme-comments', JSON.stringify(state.comments));
      localStorage.setItem('user-profile', JSON.stringify(state.userProfile));
      localStorage.setItem('liked-memes', JSON.stringify(state.likedMemes));
    }
  }, [state.memes, state.likes, state.comments, state.userProfile, state.likedMemes]);

  // Action creators
  const addMeme = (meme) => {
    dispatch({ type: ADD_MEME, payload: meme });
  };

  const deleteMeme = (id) => {
    dispatch({ type: DELETE_MEME, payload: id });
  };

  const setCurrentMeme = (meme) => {
    dispatch({ type: SET_CURRENT_MEME, payload: meme });
  };

  const toggleLike = (memeId) => {
    dispatch({ type: TOGGLE_LIKE, payload: memeId });
  };

  const addComment = (memeId, text) => {
    const comment = {
      id: Date.now(),
      text,
      date: new Date().toISOString(),
      author: state.userProfile.name || 'Anonymous User' // Use user's name if available
    };

    dispatch({
      type: ADD_COMMENT,
      payload: { id: memeId, comment }
    });
  };

  // Helper function to get meme by ID
  const getMemeById = (id) => {
    return state.memes.find(meme => meme.id === id);
  };

  // User profile actions
  const updateProfile = (profileData) => {
    dispatch({ type: UPDATE_PROFILE, payload: profileData });
  };

  const updateProfileImage = (imageUrl) => {
    dispatch({ type: UPDATE_PROFILE_IMAGE, payload: imageUrl });
  };

  // Get liked memes (full objects, not just IDs)
  const getLikedMemes = () => {
    return state.memes.filter(meme => state.likedMemes.includes(meme.id));
  };

  // Check if a meme is liked
  const isMemeLiked = (memeId) => {
    return state.likedMemes.includes(memeId);
  };

  return (
    <MemeContext.Provider value={{
      memes: state.memes,
      currentMeme: state.currentMeme,
      likes: state.likes,
      comments: state.comments,
      userProfile: state.userProfile,
      likedMemes: state.likedMemes,
      addMeme,
      deleteMeme,
      setCurrentMeme,
      toggleLike,
      addComment,
      getMemeById,
      updateProfile,
      updateProfileImage,
      getLikedMemes,
      isMemeLiked
    }}>
      {children}
    </MemeContext.Provider>
  );
};

// Custom hook to use the meme context
export const useMeme = () => {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
};