import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import logo from '../assets/coride-logo.png';
import loginBg from '../assets/login-bg.jpg'; // Ensure this image exists in src/assets/

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4 relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative bg-white bg-opacity-80 shadow-xl rounded-xl w-full max-w-md p-8 space-y-6 z-10">
        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="CoRide" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-primary">Sign in to CoRide</h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-bgsoft focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-bgsoft focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-lightgreen text-black font-semibold py-2 rounded-md shadow transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center">
          New here?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Create new Account
          </Link>
        </p>

        <Link
          to="/captain-login"
          className="w-full block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-md shadow text-center transition"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
