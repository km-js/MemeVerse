// src/services/memeService.js
/**
 * Service for interacting with meme APIs
 */

// Imgflip API base URL
const IMGFLIP_API_URL = 'https://api.imgflip.com';

// ImgBB API base URL and key (you would need to get your own API key)
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

/**
 * Fetch popular meme templates from Imgflip
 * @returns {Promise<Array>} Array of meme templates
 */
export async function getPopularMemeTemplates() {
  try {
    const response = await fetch(`${IMGFLIP_API_URL}/get_memes`);
    const data = await response.json();
    
    if (data.success) {
      return data.data.memes.map(meme => ({
        id: meme.id,
        name: meme.name,
        url: meme.url,
        width: meme.width,
        height: meme.height,
        boxCount: meme.box_count
      }));
    } else {
      throw new Error(data.error_message);
    }
  } catch (error) {
    console.error('Error fetching meme templates:', error);
    throw error;
  }
}

/**
 * Create a meme using Imgflip API
 * @param {string} templateId - ID of the meme template
 * @param {Array<string>} textLines - Array of text lines for the meme
 * @param {string} username - Imgflip username
 * @param {string} password - Imgflip password
 * @returns {Promise<Object>} Created meme object
 */
export async function createMeme(templateId, textLines, username, password) {
  try {
    const formData = new FormData();
    formData.append('template_id', templateId);
    formData.append('username', username);
    formData.append('password', password);
    
    // Add text lines
    textLines.forEach((text, index) => {
      formData.append(`boxes[${index}][text]`, text);
    });
    
    const response = await fetch(`${IMGFLIP_API_URL}/caption_image`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        id: data.data.page_url.split('/').pop(),
        imageUrl: data.data.url,
        title: `Custom Meme ${Date.now()}`,
        pageUrl: data.data.page_url,
        createdAt: new Date().toISOString(),
        isLiked: false
      };
    } else {
      throw new Error(data.error_message);
    }
  } catch (error) {
    console.error('Error creating meme:', error);
    throw error;
  }
}

/**
 * Upload an image to ImgBB
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} Uploaded image data
 */
export async function uploadImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', IMGBB_API_KEY);
    
    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        id: data.data.id,
        imageUrl: data.data.url,
        title: `Uploaded Meme ${Date.now()}`,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
        createdAt: new Date().toISOString(),
        isLiked: false
      };
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}