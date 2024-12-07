import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";  // Import ToastContainer here
import "react-toastify/dist/ReactToastify.css";  // Import styles for toast notifications
import Logo from "../components/Logo";

const Login = () => {
  const [data, setData] = useState({
    email: "",
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
    console.log(data);
    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_Url}/login`,{
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const data2 = await response.json();
      console.log('data2',data2);

      if (response.ok) {
        toast.success("Login successful! Redirecting...", { position: "top-right" });  // Success message
        setTimeout(() => navigate("/chat"), 2000);  // Redirect after a delay
      } else {
        toast.error("Login failed! Please check your credentials.", { position: "top-right" });  // Error message
      }
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("An error occurred. Please try again.", { position: "top-right" });  // Error message
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <Logo />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-6">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

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
