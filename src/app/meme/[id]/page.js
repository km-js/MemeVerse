'use client';

import { useEffect } from 'react';
import { useMeme } from '@/contexts/MemeContext';
import MemeDetails from '@/components/meme/MemeDetails';
import { getMemeById } from '@/utils/memeApi';
import { useParams } from 'next/navigation';

export default function MemePage() {
    const { setCurrentMeme, getMemeById: getLocalMeme } = useMeme();
    const routeParams = useParams(); // Returns an object with route parameters
    const id = routeParams.id; // Extract the `id` from route parameters

    useEffect(() => {
        // First try to get meme from local context
        const localMeme = getLocalMeme(id);

        if (localMeme) {
            // Only update if the local meme is different from the current meme
            setCurrentMeme(localMeme);
        } else {
            // If not found locally, fetch from API
            const fetchMeme = async () => {
                try {
                    const meme = await getMemeById(id);
                    setCurrentMeme(meme); // Update the current meme
                } catch (error) {
                    console.error('Error fetching meme:', error);
                }
            };

            fetchMeme();
        }

        // Cleanup function (optional, depending on your use case)
        return () => {
            setCurrentMeme(null); // Reset current meme when the component unmounts
        };
    }, [id]); // Only re-run when `id` changes

    return <MemeDetails id={id} />;
}