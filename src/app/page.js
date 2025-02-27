import Header from '@/components/Header';
import MemeCard from '@/components/MemeCard';
import { getTrendingMemes } from '@/utils/api';

export default async function HomePage() {
  const memes = await getTrendingMemes();
  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {memes.length > 0 ? (
          memes.map(meme => <MemeCard key={meme.id} meme={meme} />)
        ) : (
          <p className="col-span-full text-center">No memes found.</p>
        )}
      </div>
    </div>
  );
}