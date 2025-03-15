import React, { useRef, useState, useEffect } from 'react';
import { partnerApi } from '../../services/api';
import { Match } from '../../types';

interface LiveCameraProps {
  onMatchFound: (matches: Match[]) => void;
}

export const LiveCamera: React.FC<LiveCameraProps> = ({ onMatchFound }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      try {
        const { data } = await partnerApi.getLiveMatches(blob);
        onMatchFound(data.matches);
      } catch (err) {
        setError('Failed to process image. Please try again.');
      }
    }, 'image/jpeg');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg shadow-lg"
        />
        
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={isStreaming ? stopCamera : startCamera}
            className={`px-4 py-2 rounded-md ${
              isStreaming 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isStreaming ? 'Stop Camera' : 'Start Camera'}
          </button>
          
          {isStreaming && (
            <button
              onClick={captureFrame}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Capture
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default LiveCamera; 