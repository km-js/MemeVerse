export async function getTrendingMemes() {
  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    if (!response.ok) {
      throw new Error('Failed to fetch memes');
    }
    const data = await response.json();
    return data.data.memes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMemes({
  category = 'trending',
  search = '',
  sort = 'likes',
  offset = 0,
  limit = 20
} = {}) {
  // Fetch all memes from Imgflip API
  const response = await fetch('https://api.imgflip.com/get_memes');
  if (!response.ok) {
    throw new Error('Failed to fetch memes');
  }
  const data = await response.json();
  let memes = data.data.memes; // Extract the memes array

  // Step 1: Simulate category filtering
  // Imgflip doesn’t support categories, so we assume all memes are "trending"
  if (category !== 'trending') {
    return []; // Return empty array for unsupported categories as a placeholder
  }

  // Step 2: Filter by search term
  if (search) {
    memes = memes.filter((meme) =>
      meme.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Step 3: Sort the memes
  if (sort === 'likes') {
    // Imgflip doesn’t provide like counts, so sort by name as a fallback
    memes = [...memes].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name') {
    // Explicitly support sorting by name
    memes = [...memes].sort((a, b) => a.name.localeCompare(b.name));
  }
  // Add more sort options here if needed (e.g., 'date' or 'comments'), but Imgflip lacks this data

  // Step 4: Apply pagination
  const paginatedMemes = memes.slice(offset, offset + limit);

  // Return the processed memes in the expected format
  return paginatedMemes.map((meme) => ({
    id: meme.id,
    url: meme.url,
    name: meme.name,
    width: meme.width,
    height: meme.height
  }));
}