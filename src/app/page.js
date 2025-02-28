// import Header from '@/components/Header';
// import MemeCard from '@/components/MemeCard';
// import { getTrendingMemes } from '@/utils/api';

// export default async function HomePage() {
//   const memes = await getTrendingMemes();
//   return (
//     <div>
//       <Header />
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//         {memes.length > 0 ? (
//           memes.map(meme => <MemeCard key={meme.id} meme={meme} />)
//         ) : (
//           <p className="col-span-full text-center">No memes found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';

const Home = () => {
  // Theme state
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  // State management
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [featuredMeme, setFeaturedMeme] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch trending memes
  useEffect(() => {
    const fetchTrendingMemes = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error_message || 'Failed to fetch memes');
        }

        // Get memes and select first 8 for trending section
        const allMemes = data.data.memes;
        const trending = allMemes.slice(0, 8);

        // Select a random featured meme from top 3
        const featured = allMemes[Math.floor(Math.random() * 3)];

        // Create simulated categories based on meme characteristics
        const categoryList = [
          { id: 1, name: 'Reactions', count: 128, icon: '😂' },
          { id: 2, name: 'Animals', count: 86, icon: '🐱' },
          { id: 3, name: 'Gaming', count: 74, icon: '🎮' },
          { id: 4, name: 'Movies', count: 92, icon: '🎬' },
          { id: 5, name: 'Classic', count: 63, icon: '🏆' },
          { id: 6, name: 'Anime', count: 55, icon: '✨' }
        ];

        setTrendingMemes(trending);
        setFeaturedMeme(featured);
        setCategories(categoryList);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching memes:', err);
      }
    };

    fetchTrendingMemes();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
              <span className="text-xl font-bold text-gray-800 dark:text-white">MemeVerse</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-blue-500 font-medium">Home</Link>
              <Link href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Explore</Link>
              <Link href="/create" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Create</Link>
              <Link href="/popular" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Popular</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Button - Hidden on larger screens */}
              <button className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>

              {/* Explore Button */}
              <Link
                href="/explore"
                className="hidden sm:block bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Explore Memes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section with Featured Meme */}
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Hero Text */}
              <motion.div
                className="md:w-1/2"
                initial="hidden"
                animate="visible"
                variants={heroVariants}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Discover the <span className="text-blue-500">Funniest</span> Memes Online
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Browse thousands of viral memes, create your own, and share with friends.
                  Join the fastest growing meme community on the web.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/explore"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Start Exploring
                  </Link>
                  <Link
                    href="/create"
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Create a Meme
                  </Link>
                </div>
              </motion.div>

              {/* Featured Meme */}
              {featuredMeme && (
                <motion.div
                  className="md:w-1/2 relative"
                  initial="hidden"
                  animate="visible"
                  variants={heroVariants}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="aspect-square sm:aspect-[4/3] overflow-hidden">
                      <img
                        src={featuredMeme.url}
                        alt={featuredMeme.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {featuredMeme.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Trending Now</span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {Math.floor(Math.random() * 20) + 10}k
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
                  <div className="absolute -z-10 -top-6 -left-6 w-16 h-16 bg-yellow-500 rounded-full opacity-20"></div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Background shapes */}
          <div className="absolute -z-10 top-1/4 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute -z-10 bottom-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
        </section>

        {/* Category Section */}
        <section className="py-12 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                variants={itemVariants}
              >
                Popular Categories
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Find exactly what you're looking for with our curated meme categories
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} memes</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trending Memes Section */}
        <section className="py-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Memes</h2>
              <Link
                href="/explore"
                className="text-blue-500 hover:text-blue-600 font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                <p>{error}</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                {trendingMemes.map((meme) => (
                  <motion.div
                    key={meme.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/meme/${meme.id}`} key={meme.id}>
                      <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={meme.url}
                          alt={meme.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {meme.name}
                        </h3>

                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {Math.floor(Math.random() * 15) + 5}k
                          </div>

                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {Math.floor(Math.random() * 20) + 1}d ago
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to start your meme journey?</h2>
              <p className="max-w-2xl mx-auto mb-8 text-blue-100">
                Join thousands of meme enthusiasts sharing and discovering the internet's freshest content.
              </p>
              <Link
                href="/explore"
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg transition-colors inline-block"
              >
                Explore All Memes
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
                <span className="text-xl font-bold text-gray-800 dark:text-white">MemeVerse</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                The ultimate platform for meme lovers to discover, create, and share the internet's funniest content.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Home</Link></li>
                  <li><Link href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Explore</Link></li>
                  <li><Link href="/create" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Create</Link></li>
                  <li><Link href="/popular" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Popular</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li><Link href="/category/reactions" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Reactions</Link></li>
                  <li><Link href="/category/animals" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Animals</Link></li>
                  <li><Link href="/category/gaming" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Gaming</Link></li>
                  <li><Link href="/category/classic" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Classic</Link></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"> </a>
                  {/* <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> */}
                  {/* <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238- */}

                </div></div>
            </div> </div> </div> </footer> </div>)
}

export default Home;