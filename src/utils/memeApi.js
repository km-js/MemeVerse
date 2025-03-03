export const generateMeme = async (templateId, topText, bottomText) => {
  try {
    const formData = new URLSearchParams();
    formData.append('template_id', templateId);
    formData.append('username', 'your_username'); // Replace with your Imgflip username
    formData.append('password', 'your_password'); // Replace with your Imgflip password
    formData.append('text0', topText);
    formData.append('text1', bottomText);

    const response = await fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(`Failed to generate meme: ${data.error_message}`);
    }
  } catch (error) {
    console.error('Error generating meme:', error);
    throw error;
  }
};


export async function getMemeById(id) {
  try {
    // For demonstration, we're using the Imgflip API to get a list of memes
    // In a real application, you would have an endpoint to get a specific meme by ID
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to fetch memes from API');
    }

    // Find the meme with the matching ID
    const meme = data.data.memes.find((meme) => meme.id === id);

    if (!meme) {
      throw new Error('Meme not found');
    }

    return meme;
  } catch (error) {
    console.error('Error fetching meme:', error);
    throw error;
  }
}

// Get all memes (for browsing)
export async function getAllMemes() {
  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to fetch memes from API');
    }

    return data.data.memes;
  } catch (error) {
    console.error('Error fetching all memes:', error);
    throw error;
  }
}