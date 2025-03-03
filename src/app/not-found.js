'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Custom404() {
    const [randomMeme, setRandomMeme] = useState(null)
    const [loading, setLoading] = useState(true)
    const [gameActive, setGameActive] = useState(false)
    const [score, setScore] = useState(0)
    const [emoji, setEmoji] = useState('😱')
    const [collectedMemes, setCollectedMemes] = useState([])
    const [showCollection, setShowCollection] = useState(false)
    const gameRef = useRef(null)
    const [isBrowser, setIsBrowser] = useState(false)

    // Collection of funny 404 meme data with emoji pairs
    const memes404 = [
        {
            imageUrl: 'https://media1.tenor.com/m/s3mSfN97IMAAAAAC/john-travolta-kuddelzwerg.gif',
            caption: "Looking for a page that doesn't exist",
            altText: "Confused John Travolta looking around meme",
            emoji: '🤷‍♂️',
            id: 'travolta'
        },
        {
            imageUrl: 'https://media1.tenor.com/m/ZhKMg4_yCTgAAAAC/surprised-pikachu.gif',
            caption: "When you realize the URL doesn't exist",
            altText: "Surprised Pikachu meme",
            emoji: '😮',
            id: 'pikachu'
        },
        {
            imageUrl: 'https://media1.tenor.com/m/5BOVutzvWJgAAAAC/shmorky-this-is-fine.gif',
            caption: "404 error. This is fine.",
            altText: "This is fine dog meme",
            emoji: '🔥',
            id: 'this-is-fine'
        },
        {
            imageUrl: 'https://media1.tenor.com/m/XcW2X_rp2PUAAAAC/simpsonovi-simpsons.gif',
            caption: "The page you're looking for disappeared like...",
            altText: "Homer Simpson disappearing into bushes meme",
            emoji: '🌳',
            id: 'homer'
        },
    ]

    // Fallback images with meme styling
    const fallbackImageUrl = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22500%22 height%3D%22300%22 viewBox%3D%220 0 500 300%22%3E%3Crect fill%3D%22%23242424%22 width%3D%22500%22 height%3D%22300%22%2F%3E%3Ctext fill%3D%22%23fff%22 font-family%3D%22Impact%2C sans-serif%22 font-size%3D%2236%22 text-anchor%3D%22middle%22 x%3D%22250%22 y%3D%22150%22%3E404 MEME NOT FOUND%3C%2Ftext%3E%3C%2Fsvg%3E'

    // Choose a random meme that hasn't been collected yet
    const getRandomMeme = () => {
        let availableMemes = memes404

        const randomIndex = Math.floor(Math.random() * availableMemes.length)
        const selectedMeme = availableMemes[randomIndex]

        setEmoji(selectedMeme.emoji)
        return selectedMeme
    }

    // Set isBrowser to true once component mounts
    useEffect(() => {
        setIsBrowser(true)
        const timer = setTimeout(() => {
            setRandomMeme(getRandomMeme())
            setLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    // Handle image error
    const handleImageError = (e) => {
        e.target.src = fallbackImageUrl
    }

    // Show another meme
    const showAnotherMeme = () => {
        setLoading(true)
        setTimeout(() => {
            setRandomMeme(getRandomMeme())
            setLoading(false)
        }, 400)
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.15
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    }

    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 2 }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden">
            {/* Falling 404 numbers in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-2xl md:text-4xl text-blue-200/30 font-bold"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    >
                        404
                    </div>
                ))}
            </div>

            <motion.div
                className="max-w-2xl w-full backdrop-blur-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Collection modal */}
                        <AnimatePresence>
                            {showCollection && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold">Your Meme Collection</h3>
                                            <button
                                                onClick={() => setShowCollection(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <p className="mb-4 text-gray-600">
                                            You've collected {collectedMemes.length} out of {memes404.length} rare 404 memes!
                                        </p>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {memes404.map(meme => {
                                                const isCollected = collectedMemes.some(m => m.id === meme.id);
                                                return (
                                                    <div
                                                        key={meme.id}
                                                        className={`rounded-lg overflow-hidden border-2 ${isCollected ? 'border-green-500' : 'border-gray-200 opacity-50'}`}
                                                    >
                                                        <div className="relative aspect-video bg-gray-100">
                                                            {isCollected ? (
                                                                <img
                                                                    src={meme.imageUrl}
                                                                    alt={meme.altText}
                                                                    className="w-full h-full object-cover"
                                                                    onError={handleImageError}
                                                                />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <span className="text-3xl">❓</span>
                                                                </div>
                                                            )}
                                                            {isCollected && (
                                                                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                                    ✓
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-2 text-center">
                                                            <p className="text-sm font-medium truncate">{isCollected ? meme.caption : 'Not discovered yet'}</p>
                                                            <span className="text-xl">{meme.emoji}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {collectedMemes.length === memes404.length && (
                                            <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-center">
                                                <h4 className="text-xl font-bold text-yellow-800">🏆 Achievement Unlocked!</h4>
                                                <p className="text-yellow-800">You've collected all the 404 memes! You are a true Internet explorer!</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    4
                                </span>
                                <motion.span
                                    animate={{
                                        rotate: [0, 10, -10, 10, 0],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                                    className="text-6xl"
                                >
                                    😵
                                </motion.span>
                                <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    4
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-1">
                                Page Not Found
                            </h2>
                            <p className="text-gray-600 text-center max-w-md">
                                The meme you're looking for has been abducted by aliens 👽
                            </p>
                        </motion.div>

                        {/* Random meme card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8 transform transition-all hover:scale-102 duration-300"
                        >
                            <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-500 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="bg-white text-blue-500 rounded-md px-2 py-0.5 text-sm font-bold">
                                        404.meme
                                    </span>
                                </div>
                                <div className="flex space-x-1">
                                    {['#f87171', '#fbbf24', '#34d399'].map((color, i) => (
                                        <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <img
                                    src={randomMeme?.imageUrl || fallbackImageUrl}
                                    alt={randomMeme?.altText || "404 Error Meme"}
                                    className="w-full h-auto object-cover max-h-96"
                                    onError={handleImageError}
                                />
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-xl font-bold text-center" style={{ fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                        {randomMeme?.caption || "404: MEME NOT FOUND"}
                                    </p>
                                </div>
                                <motion.div
                                    className="absolute top-3 right-3 text-4xl animate-bounce"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    {randomMeme?.emoji || '❓'}
                                </motion.div>
                            </div>

                            <div className="p-4 bg-gray-100 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Error meme #{collectedMemes.length}/{memes404.length}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium">
                                        #not-found
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs font-medium">
                                        #meme-404
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                        >
                            <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-2">
                                <span>Take Me Home</span>
                                <span>🏠</span>
                            </Link>

                            <motion.button
                                onClick={showAnotherMeme}
                                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-blue-200 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span>Another Meme</span>
                                <span>🔄</span>
                            </motion.button>
                        </motion.div>

                        {/* CSS for falling animations */}
                        <style jsx global>{`
                            @keyframes float {
                                0% { transform: translateY(-20px); opacity: 0; }
                                10% { opacity: 0.5; }
                                90% { opacity: 0.5; }
                                100% { transform: translateY(100vh); opacity: 0; }
                            }
                            
                            @keyframes fall {
                                0% { transform: translateY(-40px); opacity: 1; }
                                80% { opacity: 1; }
                                100% { transform: translateY(400px); opacity: 0; }
                            }
                            
                            .animate-fall {
                                animation: fall 3s linear forwards;
                            }
                        `}</style>
                    </>
                )}
            </motion.div>
        </div>
    )
}