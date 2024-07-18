import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ image, onDraw }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const maxWidth = 512;
      const maxHeight = 512;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);
    };

    setCtx(context);
  }, [image]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.moveTo(offsetX, offsetY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    onDraw(canvasRef.current.toDataURL());
  };

  useEffect(() => {
    if (!ctx) return;
    ctx.strokeStyle = 'black'; // 브러쉬 색상을 검정으로 설정
    ctx.lineWidth = 20;
  }, [ctx]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDrawing(false)}
      style={{ border: '1px solid black' }}
    />
  );
};

export default Canvas;