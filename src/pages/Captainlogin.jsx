import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';
import logo from '../assets/coride-logo.png';

const Captainlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // Clear any old tokens before login to avoid mixing up with user tokens
      localStorage.removeItem('token');
      localStorage.removeItem('captain');

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, {
        email,
        password
      });

      if (response.status === 200) {
        const { captain, token } = response.data;

        // Save captain-specific token and data
        localStorage.setItem('token', token);
        localStorage.setItem('captain', JSON.stringify(captain));
        setCaptain(captain);

        console.log("✅ Captain ID:", captain._id);
        console.log("🔐 Captain Token:", token);

        navigate('/captain-home');
      }
    } catch (err) {
      console.error('❌ Captain login failed:', err);
      alert('Login failed. Please check your email or password.');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-bgsoft flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img className="w-14" src={logo} alt="CoRide Logo" />
          <h2 className="text-2xl font-bold text-primary">Captain Login</h2>
          <p className="text-sm text-gray-600">Welcome back, captain! Log in to manage your rides.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-bgsoft focus:outline-none focus:ring-2 focus:ring-primary"
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-bgsoft focus:outline-none focus:ring-2 focus:ring-primary"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-lightgreen text-black font-semibold py-2 rounded-md shadow-md transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center">
          Join a fleet?{' '}
          <Link to="/captain-signup" className="text-primary hover:underline">Register as a Captain</Link>
        </p>

        <Link
          to="/login"
          className="w-full block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md shadow text-center transition"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;
