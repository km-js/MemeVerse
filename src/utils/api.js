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