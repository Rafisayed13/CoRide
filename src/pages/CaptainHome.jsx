import React, { useRef, useState, useContext, useEffect } from "react";
import useLiveCaptainLocation from "../hooks/useLiveCaptainLocation";

import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const [currentPosition, setCurrentPosition] = useState([25.276987, 55.296249]);

  useEffect(() => {
    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          setCurrentPosition([position.coords.latitude, position.coords.longitude]);
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        });
      }
    };

    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);
    return () => clearInterval(locationInterval);
  }, []);

  useEffect(() => {
    socket.on('new-ride', (data) => {
      console.log("✅ NEW RIDE RECEIVED by captain:", data);
      setRide(data);
      setRidePopupPanel(true);
    });

    return () => socket.off('new-ride');
  }, [socket]);

  async function confirmRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
      rideId: ride._id,
      captainId: captain._id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  const pickupCoords = ride?.pickup?.lat && ride?.pickup?.lon ? [ride.pickup.lat, ride.pickup.lon] : null;
  const destinationCoords = ride?.destination?.lat && ride?.destination?.lon ? [ride.destination.lat, ride.destination.lon] : null;

  return (
    <div className='h-screen'>
      {/* Top Navbar with logout and earnings chart */}
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10'>
        <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
        <Link to="/captain-earnings" className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full shadow hover:bg-green-200 transition">
  📊 View Weekly Earnings
</Link>

      </div>

      {/* Map */}
      <div className='h-3/5 relative z-0'>
        <MapContainer center={currentPosition} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentPosition} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
          {pickupCoords && (
            <Marker position={pickupCoords} icon={customIcon}>
              <Popup>Pickup</Popup>
            </Marker>
          )}
          {destinationCoords && (
            <Marker position={destinationCoords} icon={customIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}
          {pickupCoords && destinationCoords && (
            <Polyline positions={[pickupCoords, destinationCoords]} color="blue" />
          )}
        </MapContainer>
      </div>

      {/* Captain Stats Panel */}
      <div className='h-2/5 p-6'>
        <CaptainDetails />
      </div>

      {/* Ride Popups */}
      <div className={`fixed w-full z-20 bottom-0 bg-white px-3 py-10 pt-12 transition-transform duration-500 ${ridePopupPanel ? 'translate-y-0' : 'translate-y-full'}`}>
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div className={`fixed w-full h-screen z-20 bottom-0 bg-white px-3 py-10 pt-12 transition-transform duration-500 ${confirmRidePopupPanel ? 'translate-y-0' : 'translate-y-full'}`}>
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
