const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`;

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ChattingApp3");

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        console.log(response);
        
      throw new Error("Failed to upload file",response);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
};
