import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { partnerApi } from '../../services/api';
import { Match } from '../../types';

interface FaceUploadProps {
  onMatchFound: (matches: Match[]) => void;
}

export const FaceUpload: React.FC<FaceUploadProps> = ({ onMatchFound }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', acceptedFiles[0]);
      
      const { data } = await partnerApi.uploadFace(formData);
      onMatchFound(data.matches);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onMatchFound]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={loading} />
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            <p className="mt-2 text-sm text-gray-600">Processing image...</p>
          </div>
        ) : (
          <div>
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {isDragActive
                ? "Drop the image here"
                : "Drag 'n' drop an image here, or click to select"}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default FaceUpload; 