import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  memes: [],
  currentMeme: null,
  likes: {},
  comments: {}
};

// Action types
const ADD_MEME = 'ADD_MEME';
const DELETE_MEME = 'DELETE_MEME';
const SET_CURRENT_MEME = 'SET_CURRENT_MEME';
const TOGGLE_LIKE = 'TOGGLE_LIKE';
const ADD_COMMENT = 'ADD_COMMENT';

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
      return {
        ...state,
        likes: {
          ...state.likes,
          [memeId]: {
            liked: !currentLikeState.liked,
            count: currentLikeState.liked
              ? Math.max(0, currentLikeState.count - 1)
              : currentLikeState.count + 1
          }
        }
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

      return {
        memes: savedMemes ? JSON.parse(savedMemes) : initialState.memes,
        currentMeme: initialState.currentMeme,
        likes: savedLikes ? JSON.parse(savedLikes) : initialState.likes,
        comments: savedComments ? JSON.parse(savedComments) : initialState.comments
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
    }
  }, [state.memes, state.likes, state.comments]);

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
      author: 'Anonymous User' // Could be replaced with user authentication
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

  return (
    <MemeContext.Provider value={{
      memes: state.memes,
      currentMeme: state.currentMeme,
      likes: state.likes,
      comments: state.comments,
      addMeme,
      deleteMeme,
      setCurrentMeme,
      toggleLike,
      addComment,
      getMemeById
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