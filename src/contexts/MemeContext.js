// context/MemeContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  memes: []
};

// Action types
const ADD_MEME = 'ADD_MEME';
const DELETE_MEME = 'DELETE_MEME';

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
      return savedMemes ? { memes: JSON.parse(savedMemes) } : initialState;
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
    }
  }, [state.memes]);

  // Action creators
  const addMeme = (meme) => {
    dispatch({ type: ADD_MEME, payload: meme });
  };

  const deleteMeme = (id) => {
    dispatch({ type: DELETE_MEME, payload: id });
  };

  return (
    <MemeContext.Provider value={{
      memes: state.memes,
      addMeme,
      deleteMeme
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