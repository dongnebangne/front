import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onDrop }) => {
  const onDropCallback = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles[0]);
  }, [onDrop]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onDropCallback });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default Dropzone;