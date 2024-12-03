import React, { useEffect, useState } from "react";
import { uploadFile } from "../helper/uploadFile";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Importing ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Importing the styles for toast
import Logo from "../components/Logo";

const Signup = () => {
  const [upload, setUpload] = useState("");
  const [loading, setLoading] = useState(false); // State for upload indicator
  const [data, setData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    password: "",
  });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent submission if the profile picture is uploading
    if (loading) {
      alert("Please wait until the profile picture finishes uploading.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_Url}/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const data2 = await response.json();
      console.log(data2);

      if (response.ok) {
        toast.success("Signup successful! Redirecting to Chat Page...", { position: "top-right" }); // Success toast
        setTimeout(() => navigate("/chat"), 2000);  // Redirect to login page after 2 seconds
      } else {
        toast.error("Signup failed! Please check your details.", { position: "top-right" });  // Error toast
      }
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("An error occurred. Please try again later.", { position: "top-right" });  // Error toast
    }
  };

  const handleUploadPhoto = async () => {
    if (!upload) {
      return;
    }
    setLoading(true); // Start loading
    try {
      const uploadresponse = await uploadFile(upload);
      setData((prev) => ({
        ...prev,
        profile_pic: uploadresponse?.url,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    handleUploadPhoto();
  }, [upload]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Logo />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <input
                type="file"
                name="profile_pic"
                onChange={(e) => setUpload(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {loading && (
                <p className="text-sm text-blue-600 mt-2">Uploading photo, please wait...</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading} // Disable button while uploading
              className={`w-full py-2 px-4 rounded-md shadow ${loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"}`}
            >
              {loading ? "Uploading..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <NavLink to="/chat" className="text-blue-600 hover:underline">
              Login
            </NavLink>
          </p>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Signup;
