import { motion } from 'framer-motion';

const MemeEditor = ({
  caption,
  onCaptionChange,
  captionPosition,
  onPositionChange,
  fontSize,
  onFontSizeChange,
  fontColor,
  onFontColorChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Your Meme</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Caption</label>
        <textarea
          value={caption}
          onChange={onCaptionChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="Enter your meme caption here..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Caption Position</label>
        <div className="flex space-x-4">
          {['top', 'center', 'bottom'].map((position) => (
            <button
              key={position}
              onClick={() => onPositionChange(position)}
              className={`px-4 py-2 rounded-md ${captionPosition === position
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Font Size: {fontSize}px</label>
        <input
          type="range"
          min="16"
          max="64"
          value={fontSize}
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Font Color</label>
        <div className="flex space-x-4">
          {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((color) => (
            <motion.div
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onFontColorChange(color)}
              className={`w-8 h-8 rounded-full cursor-pointer ${fontColor === color ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={fontColor}
            onChange={(e) => onFontColorChange(e.target.value)}
            className="w-8 h-8 p-0 border-0"
          />
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-6">
        <p>Pro Tip: Use short, funny captions for best results!</p>
      </div>
    </div>
  );
};

export default MemeEditor;