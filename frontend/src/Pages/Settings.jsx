import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { uploadFile } from '../helper/uploadFile';
import { toast, ToastContainer } from 'react-toastify'; // Importing Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing Toastify CSS

const Settings = () => {
  const [currUser, setCurrUser] = useState({
    username: '',
    userId: '',
    profile_pic: '',
  });
  const [loading, setLoading] = useState(false); // State for upload loading indicator

  const profilePicRef = useRef();
  const navigate = useNavigate(); // Initialize useNavigate

  const getCurruserDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_Backend_Url}/userDetails`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await response.json();
      setCurrUser({
        userId: data?.user?._id,
        username: data?.user?.name,
        profile_pic: data?.user?.profile_pic,
      });
    } catch (error) {
      console.log('Error getting current user details:', error);
      toast.error("Failed to load user details.", { position: "top-right" }); // Error toast
    }
  };

  useEffect(() => {
    getCurruserDetails();
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, value, files } = e.target;

    if (name === 'profile_pic') {
      setLoading(true); // Start loading
      const pp = await uploadFile(files[0]);
      setCurrUser((prev) => ({
        ...prev,
        [name]: pp?.url,
      }));
      setLoading(false); // End loading
    } else {
      setCurrUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_Url}/updateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(currUser), // Convert the object to a JSON string
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Profile updated successfully!", { position: "top-right" }); // Success toast
      } else {
        toast.error("Failed to update profile. Please try again.", { position: "top-right" }); // Error toast
      }
    } catch (error) {
      console.log('Error updating user:', error);
      toast.error("An error occurred. Please try again later.", { position: "top-right" }); // Error toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/chat')} // Navigate to /chat
              className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {`< Back`}
            </button>
            <h2 className="text-2xl font-bold text-blue-600 text-center flex-grow">Settings</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={currUser.username}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={currUser.profile_pic}
                  alt="Profile Picture"
                  className="mt-2 w-24 h-24 rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <button
                  type="button"
                  onClick={() => profilePicRef.current.click()}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Change Profile Photo
                </button>
                <input
                  type="file"
                  name="profile_pic"
                  onChange={handleChange}
                  ref={profilePicRef}
                  hidden
                />
              </div>
            </div>
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md shadow bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading} // Disable button while uploading
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Settings;
