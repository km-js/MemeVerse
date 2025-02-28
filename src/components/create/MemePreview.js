
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MemePreview = ({ imageUrl, caption, captionPosition, fontSize, fontColor }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image
      ctx.drawImage(image, 0, 0);

      // Draw caption
      if (caption) {
        ctx.font = `bold ${fontSize}px Impact, sans-serif`;
        ctx.fillStyle = fontColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = fontSize / 16;
        ctx.textAlign = 'center';

        // Apply text shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const lines = wrapText(ctx, caption, image.width - 20, fontSize * 1.2);
        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;

        let y;
        switch (captionPosition) {
          case 'top':
            y = fontSize + 10;
            break;
          case 'center':
            y = (image.height - totalTextHeight) / 2 + fontSize;
            break;
          case 'bottom':
          default:
            y = image.height - totalTextHeight + fontSize;
        }

        lines.forEach(line => {
          // Draw text stroke
          ctx.strokeText(line, image.width / 2, y);
          // Draw text fill
          ctx.fillText(line, image.width / 2, y);
          y += lineHeight;
        });
      }
    };
  }, [imageUrl, caption, captionPosition, fontSize, fontColor]);

  // Function to wrap text into multiple lines
  const wrapText = (ctx, text, maxWidth, lineHeight) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;

      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    lines.push(currentLine);
    return lines;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Meme Preview</h2>

      {imageUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <canvas
            ref={canvasRef}
            className="max-w-full border-2 border-gray-300 rounded-md"
            style={{ maxHeight: '400px' }}
          />
        </motion.div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">No image selected</p>
        </div>
      )}
    </div>
  );
};

export default MemePreview;