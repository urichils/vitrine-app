import { useState } from 'react';
import { useAuth } from '../context/authContext';

export const useImageUpload = (portfolioId) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return null;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add all selected files to FormData
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(
        `http://localhost:4322/portfolio/${portfolioId}/section/0/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      return data.images; // Returns array of uploaded image URLs
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFiles, uploading, error };
};