import { useState } from 'react';

const useImageUpload = () => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    const handleImageChange = (event) => {
        const selected = event.target.files[0];
        if (selected && selected.type.startsWith('image/')) {
            setImage(selected);
            setError(null);
        } else {
            setError('Please select a valid image file.');
        }
    };

    return {
        image,
        error,
        handleImageChange,
    };
};

export default useImageUpload;