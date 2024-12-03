import React from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-lg mb-6">Choose one option to continue</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
