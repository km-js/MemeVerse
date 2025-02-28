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