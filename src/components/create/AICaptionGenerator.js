// components/AICaptionGenerator.js
import { useState } from 'react';
import { motion } from 'framer-motion';

const AICaptionGenerator = ({ imageUrl, onCaptionGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const generateCaptions = async () => {
    if (!imageUrl) return;

    setIsLoading(true);

    try {
      // Normally you would send the image to an API here
      // For demo purposes, we'll use some predefined funny captions
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dummySuggestions = [
        "When you realize it's only Tuesday",
        "Nobody: \nMe at 3am:",
        "That moment when WiFi connects to your neighbor's printer",
        "How I look waiting for my food at the restaurant",
        "Me explaining to my mom why I need a new phone",
      ];

      setSuggestions(dummySuggestions);
    } catch (error) {
      console.error('Error generating captions:', error);
      alert('Failed to generate captions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onCaptionGenerated(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">AI Caption Generator</h2>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateCaptions}
        disabled={isLoading || !imageUrl}
        className="w-full bg-gradient-to-r from-vibrant-pink to-light-yellow text-black py-2 rounded-md disabled:bg-blue-300"
      >
        {isLoading ? 'Generating...' : 'Generate AI Captions'}
      </motion.button>

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Suggested Captions:</h3>
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">
        Click on the button to get AI-generated caption ideas for your meme!
      </p>
    </div>
  );
};

export default AICaptionGenerator;