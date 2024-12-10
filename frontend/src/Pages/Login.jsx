import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications
import Logo from "../components/Logo"; // Import your Logo component

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(data);

    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_Url}/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Send cookies with request
      });

      const data2 = await response.json(); // Parse response data
      console.log("data2", data2);

      if (response.ok) {
        // Show success toast notification
        toast.success("Login successful! Redirecting...", { position: "top-right" });

        // Reset form fields
        setData({ email: "", password: "" });

        // Redirect after 1 second
        setTimeout(() => navigate("/chat"), 1000);
      } else {
        // Show error toast with message from backend (if available)
        toast.error(data2.message || "Login failed! Please check your credentials.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error logging in", error);
      // Show error toast for network issues or other errors
      toast.error("An error occurred. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <Logo /> {/* Logo component */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-6">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <NavLink to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </NavLink>
        </p>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
