import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import car from '../assets/car.png';
import logo from '../assets/coride-logo.png';
import Chatbot from '../components/Chatbot'; // ✅ IMPORT CHATBOT

export default function LandingPage() {
  return (
    <div className="bg-bgsoft min-h-screen flex flex-col justify-center items-center text-textdark p-8 overflow-hidden relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="CoRide Logo" className="w-10 h-10" />
          <div className="text-3xl font-bold text-primary">CoRide</div>
        </div>

        {/* Top Right Options */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/about" className="hover:text-primary transition">Why CoRide?</Link>
          <select className="bg-transparent border border-primary rounded px-2 py-1 text-sm text-textdark focus:outline-none">
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="hi">HI</option>
          </select>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mt-24 text-center max-w-3xl z-10">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Together, We Make a <span className="text-primary">Greener World</span>
        </h1>
        <p className="text-lg mt-4">
          Whether you're commuting to work, meeting friends, or exploring new places, CoRide offers a smart,
          safe, and eco-friendly way to get around.
        </p>

        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 bg-primary text-black font-semibold rounded-md shadow-md hover:bg-lightgreen transition"
          >
            Continue to CoRide
          </motion.button>
        </Link>
      </div>

      {/* Animated Car */}
      <motion.img
        src={car}
        alt="car"
        className="absolute bottom-10 w-40 opacity-80"
        initial={{ x: '-100vw' }}
        animate={{ x: '100vw' }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* ✅ Chatbot Component */}
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>
    </div>
  );
}

