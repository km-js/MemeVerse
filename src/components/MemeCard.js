'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MemeCard({ meme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow"
    >
      <Image
        src={meme.url}
        alt={meme.name}
        width={meme.width}
        height={meme.height}
        layout="responsive"
      />
      <p className="mt-2 text-center">{meme.name}</p>
    </motion.div>
  );
}