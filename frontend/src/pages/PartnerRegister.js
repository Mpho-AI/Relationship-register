import { useState } from 'react';
import { api } from '../services/api';
import Webcam from 'react-webcam';

const PartnerRegister = () => {
  const [partnerData, setPartnerData] = useState({
    full_name: '',
    age: '',
    city: '',
    car: '',
    location: '',
    number_of_kids: '',
  });
  const [images, setImages] = useState({ profile: null, partner: null });
  const [showWebcam, setShowWebcam] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First check for similar faces
      if (images.partner) {
        const matchResult = await api.checkFaceMatches(images.partner);
        setMatchResults(matchResult);
        
        if (matchResult.matches.length > 0) {
          // Show warning if similar faces found
          return;
        }
      }

      // Proceed with registration if no matches
      const formData = new FormData();
      Object.keys(partnerData).forEach(key => {
        formData.append(key, partnerData[key]);
      });
      if (images.profile) formData.append('profile_image', images.profile);
      if (images.partner) formData.append('partner_image', images.partner);

      await api.registerPartner(formData);
      // Show success message and redirect
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const captureImage = (type) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages(prev => ({ ...prev, [type]: imageSrc }));
    setShowWebcam(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register Partner</h2>
      
      {matchResults && matchResults.matches.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Warning: Similar profiles found! This person might already be registered.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Partner Information Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={partnerData.full_name}
              onChange={(e) => setPartnerData(prev => ({ ...prev, full_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          {/* Add other fields similarly */}
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Upload Images</h3>
            {showWebcam ? (
              <div className="mt-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full max-w-md mx-auto"
                />
                <button
                  type="button"
                  onClick={() => captureImage(showWebcam)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Capture Photo
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWebcam('profile')}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Take Profile Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowWebcam('partner')}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Take Partner Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Register Partner
        </button>
      </form>
    </div>
  );
};

export default PartnerRegister; 