import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CapatainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/coride-logo.png';

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
      location: {
        type: 'Point',
        coordinates: [55.2924914, 25.2653471] // Default to Dubai (lng, lat)
      }
    };
    
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    }

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
  };

  return (
    <div className="min-h-screen bg-bgsoft flex justify-center items-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-3">
          <img className="w-14" src={logo} alt="CoRide Logo" />
          <h2 className="text-2xl font-bold text-primary">Captain Sign Up</h2>
          <p className="text-sm text-gray-600">Join the CoRide community and start earning.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div className="flex gap-4">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <input
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
          />

          <h3 className="text-sm font-medium">Vehicle Information</h3>
          <div className="flex gap-4">
            <input
              required
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className="w-1/2 bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              required
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className="w-1/2 bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-4">
            <input
              required
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              className="w-1/2 bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
            />
            <select
              required
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-1/2 bg-bgsoft px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">CoPool</option>
              <option value="moto">CoGreen</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-lightgreen text-black font-semibold py-2 rounded-md shadow-md transition"
          >
            Create Captain Account
          </button>
        </form>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/captain-login" className="text-primary hover:underline">Login here</Link>
        </p>

        <p className="text-[10px] mt-6 leading-tight text-center">
          This site is protected by reCAPTCHA and the{' '}
          <span className="underline">Google Privacy Policy</span> and{' '}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;