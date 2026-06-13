import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Profile = () => {
  // 1. Unified User State Initializer (Fixes the data visibility bug)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : {};
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return {};
    }
  });

  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle image selection - only preview, don't save yet
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempProfilePic(reader.result);
      setUploading(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Save image to localStorage and sync reactive state
  const handleSaveImage = () => {
    if (!tempProfilePic) return;
    
    // Update the current profile picture view state
    setProfilePic(tempProfilePic);
    setTempProfilePic(null);
    
    // Construct updated profile matrix
    const updatedUser = { ...user, profilePic: tempProfilePic };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 💡 CRUCIAL FIX: Keep the reactive hook synced so fields refresh instantly
    setUser(updatedUser);
    
    // Persist profile picture separately by email to survive logout
    if (user?.email) {
      localStorage.setItem(`profilePic_${user.email}`, tempProfilePic);
    }
    
    // Show success banner
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Cancel unsaved changes
  const handleCancel = () => {
    setTempProfilePic(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Profile</h2>
        
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-sm text-green-700 dark:text-green-400 font-semibold">✓ Profile picture saved successfully!</p>
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          {/* Profile Picture Preview */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-600 mb-4 shadow-lg">
            {tempProfilePic ? (
              <img src={tempProfilePic} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">No Image</div>
            )}
          </div>

          {/* Upload Input */}
          <label className="block mb-4 w-full">
            <span className="sr-only">Choose profile photo</span>
            <input 
              type="file" 
              accept="image/*" 
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 cursor-pointer" 
              onChange={handleImageChange} 
              disabled={uploading || tempProfilePic !== null}
            />
          </label>

          {uploading && <p className="text-xs text-purple-600 dark:text-purple-400 mb-4 font-semibold">Processing image...</p>}

          {/* Save and Cancel Buttons for Unsaved Changes */}
          {tempProfilePic && (
            <div className="w-full flex gap-3 mb-4">
              <button
                onClick={handleSaveImage}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <FaCheck className="text-lg" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg transition-all"
              >
                <FaTimes className="text-lg" /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className='text-black dark:text-white'>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span> 
            <span className="ml-2">{user.name || '-'}</span>
          </div>
          <div className='text-black dark:text-white'>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span> 
            <span className="ml-2">{user.email || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;