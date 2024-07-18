import React, { useState, useEffect } from 'react';
import Dropzone from './Dropzone';
import Canvas from './Canvas';
import PromptForm from './PromptForm';
import { API_BASE_URL } from './api-config';
import './CptedAI.css';

const CptedAI = () => {
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDraw = (maskDataUrl) => {
    setMask(maskDataUrl);
  };

  const handleSubmit = async (prompt) => {
    try {
      setError(null);
      console.log("Submitting request with image and mask:");
      console.log("Image:", image);
      console.log("Mask:", mask);

      const response = await fetch(`${API_BASE_URL}/api/generate-image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          init_image: image,
          mask,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error generating image');
      }

      const data = await response.json();
      console.log("Received initial response:", data);

      // 폴링을 통해 예측이 완료될 때까지 기다림
      let prediction = data;
      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        console.log("Polling for status...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
        const statusResponse = await fetch(`${API_BASE_URL}/api/predictions/${prediction.id}/`);
        if (!statusResponse.ok) {
          throw new Error('Error fetching prediction status');
        }
        prediction = await statusResponse.json();
        console.log("Updated prediction status:", prediction);
      }

      if (prediction.status === 'succeeded') {
        setGeneratedImage(prediction.output[0]); // assuming the output is an array
        setPredictions(predictions.concat([prediction]));
      } else {
        throw new Error('Prediction failed');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.message || 'Error generating image');
    }
  };

  useEffect(() => {
    if (generatedImage) {
      setImage(generatedImage);
    }
  }, [generatedImage]);

  return (
    <div className="cpted-ai">
      {!image ? (
        <Dropzone onDrop={handleImageUpload} />
      ) : (
        <>
          <Canvas image={image} onDraw={handleDraw} />
          <PromptForm onSubmit={handleSubmit} />
        </>
      )}
      {error && <p>{error}</p>}
      {generatedImage && (
        <div className="generated-image">
          <img src={generatedImage} alt="Generated" />
        </div>
      )}
    </div>
  );
};

export default CptedAI;