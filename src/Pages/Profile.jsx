import React, { useState } from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [uploading, setUploading] = useState(false);

  // Simulate upload and save to localStorage (replace with real API in production)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      // Save to localStorage (simulate backend)
      const updatedUser = { ...user, profilePic: reader.result };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-600 mb-2">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" onChange={handleImageChange} disabled={uploading} />
          </label>
          {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
        </div>
        <div className="space-y-2">
          <div><span className="font-semibold">Name:</span> {user.name || '-'}</div>
          <div><span className="font-semibold">Email:</span> {user.email || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
