
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { debounce } from 'lodash';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingGiven, setRatingGiven] = useState(false);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);

  const debouncedFetchSuggestions = debounce(async (input, setSuggestions) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
        params: { input },
        headers: { Authorization: `Bearer ${token}` },
      });

      const stringResults = response.data.map(
        (s) => s.description || s.display_name || s.name
      );
      setSuggestions(stringResults);
    } catch (err) {
      console.error("❌ Error fetching suggestions:", err);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    socket.emit('join', { userType: 'user', userId: user._id });
  }, [user]);

  useEffect(() => {
    socket.on('ride-confirmed', ride => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    });

    socket.on('ride-started', ride => {
      setWaitingForDriver(false);
      navigate('/riding', { state: { ride } });
    });

    socket.on('ride-ended', (rideData) => {
      setRide(rideData);
      setRatingGiven(false);

      setConfirmRidePanel(false);
      setVehiclePanel(false);
      setVehicleFound(false);
      setWaitingForDriver(false);
      setPanelOpen(false);
    });

    socket.on('captain-location', ({ lat, lng }) => {
      setRide(prev => ({
        ...prev,
        captainLocation: [lat, lng]
      }));
    });

    return () => {
      socket.off('ride-confirmed');
      socket.off('ride-started');
      socket.off('ride-ended');
      socket.off('captain-location');
    };
  }, [socket]);

  const handlePickupChange = (e) => {
    const input = e.target.value;
    setPickup(input);
    if (input.length >= 3) debouncedFetchSuggestions(input, setPickupSuggestions);
  };

  const handleDestinationChange = (e) => {
    const input = e.target.value;
    setDestination(input);
    if (input.length >= 3) debouncedFetchSuggestions(input, setDestinationSuggestions);
  };

  const submitHandler = (e) => e.preventDefault();

  useGSAP(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        height: panelOpen ? '70%' : '0%',
        padding: panelOpen ? 24 : 0,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)' });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)' });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)' });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)' });
  }, [waitingForDriver]);

  async function findTrip() {
    try {
      setCalculating(true);
      setVehiclePanel(true);
      setPanelOpen(false);

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setFare({
        auto: response.data.auto,
  car: response.data.car,
  moto: response.data.moto,
  distanceKm: response.data.distanceKm,
  isTransitPickup: response.data.isTransitPickup // ✅
      });

      setCalculating(false);
    } catch (err) {
      console.error("❌ Fare fetch error:", err);
      setCalculating(false);
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("✅ Ride created:", response.data);
    } catch (error) {
      console.error("❌ Ride creation failed:", error);
    }
  }

  async function submitRating(ratingValue) {
    try {
      if (!ride?._id) return;
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/rate`, {
        rideId: ride._id,
        rating: ratingValue,
        captainId: ride.captainId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRatingGiven(true);
      alert('✅ Thank you for your feedback!');
    } catch (err) {
      console.error("❌ Error submitting rating:", err);
    }
  }
  console.log("🚕 ride status:", ride?.status); 
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative z-0">
        <LiveTracking pickup={pickup} destination={destination} captainLocation={ride?.captainLocation} />
      </div>

      {calculating && (
        <div className="bg-yellow-300 text-black py-2 px-4 text-center text-sm font-medium animate-pulse">
          <i className="ri-loader-4-line animate-spin mr-1"></i>Calculating...
        </div>
      )}

{ride?.status === 'completed' && !ratingGiven && (
  <div className="bg-white shadow-md border px-4 py-3 text-center">
    <h4 className="text-lg font-semibold mb-2">Rate your Captain</h4>
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl cursor-pointer transition-colors duration-200 ${
            rating >= star ? 'text-yellow-400' : 'text-gray-400'
          }`}
          onMouseEnter={() => setRating(star)}
          onMouseLeave={() => setRating(0)}
          onClick={() => submitRating(star)}
        >
          ⭐
        </span>
      ))}
    </div>
  </div>
)}


      <div className="flex-grow overflow-y-auto bg-white p-6 space-y-4">
        <h4 className="text-2xl font-semibold text-primary">Find a trip</h4>

        {ride?.status === 'waiting' && ride?.otp && ride?.captain && (
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md space-y-2">
            <h4 className="text-lg font-bold text-yellow-800">Ride Confirmed ✅</h4>
            <p className="text-yellow-900">Your OTP is: <strong>{ride.otp}</strong></p>
            <div className="border-t pt-2 text-sm text-gray-800">
              <p><strong>Captain:</strong> {ride.captain.name}</p>
              <p><strong>Vehicle:</strong> {ride.captain.vehicleModel} - {ride.captain.vehicleNumber}</p>
              <p><strong>Pickup:</strong> {ride.pickup}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Fare:</strong> AED {ride.fare}</p>
            </div>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            onFocus={() => { setPanelOpen(true); setActiveField('pickup'); }}
            value={pickup}
            onChange={handlePickupChange}
            className="bg-[#f3fdf3] px-4 py-2 text-lg rounded-lg w-full border border-primary"
            type="text"
            placeholder="Add a pick-up location"
          />
          <input
            onFocus={() => { setPanelOpen(true); setActiveField('destination'); }}
            value={destination}
            onChange={handleDestinationChange}
            className="bg-[#f3fdf3] px-4 py-2 text-lg rounded-lg w-full border border-primary"
            type="text"
            placeholder="Enter your destination"
          />
          <button
            type="submit"
            onClick={findTrip}
            className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2"
          >
            <i className="ri-car-line"></i> Find Trip
          </button>
        </form>
      </div>

      {/* Panels */}
      <div ref={panelRef} className="bg-white fixed bottom-0 left-0 w-full z-[999] transition-all duration-500 shadow-xl rounded-t-xl overflow-y-auto"
        style={{ height: panelOpen ? '70%' : '0%', padding: panelOpen ? '1.5rem' : '0' }}>
        <LocationSearchPanel
          pickup={pickup}
          destination={destination}
          pickupSuggestions={pickupSuggestions}
          destinationSuggestions={destinationSuggestions}
          setPickup={setPickup}
          setDestination={setDestination}
          setPanelOpen={setPanelOpen}
          setVehiclePanel={setVehiclePanel}
          activeField={activeField}
          handlePickupChange={handlePickupChange}
          handleDestinationChange={handleDestinationChange}
        />
      </div>

      <div ref={vehiclePanelRef} className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} distanceKm={fare.distanceKm} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div ref={confirmRidePanelRef} className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={waitingForDriverRef} className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
