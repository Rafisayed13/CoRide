import React, { useRef, useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LiveTracking from '../components/LiveTracking';
import { SocketContext } from '../context/SocketContext';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  const { socket } = useContext(SocketContext);

  const [captainCoords, setCaptainCoords] = useState(null);
  const [distanceToPickup, setDistanceToPickup] = useState(null);

  useEffect(() => {
    if (rideData) {
      socket.emit('confirm-ride', {
        rideId: rideData._id,
        captainId: rideData.captain,
      });
    }
  }, [rideData]);

  useEffect(() => {
    if (!rideData) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        setCaptainCoords(coords);

        socket.emit('location-update', {
          userId: rideData.user,
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [rideData]);

  useEffect(() => {
    if (
      captainCoords &&
      rideData?.pickup?.lat &&
      rideData?.pickup?.lon
    ) {
      const dist = calculateDistance(
        captainCoords[0],
        captainCoords[1],
        rideData.pickup.lat,
        rideData.pickup.lon
      );
      setDistanceToPickup(dist);
    }
  }, [captainCoords, rideData]);

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [finishRidePanel]);

  return (
    <div className="h-screen relative flex flex-col justify-end">
      <div className="fixed p-6 top-0 flex items-center justify-end w-screen">
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Bar showing distance to pickup */}
      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="p-1 text-center w-[90%] absolute top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">
          {distanceToPickup ? `${distanceToPickup} KM to Pickup` : 'Calculating...'}
        </h4>
        <button className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>

      <div className="h-screen fixed w-screen top-0 z-[-1]">
        <LiveTracking
          pickup={rideData?.pickup}
          destination={rideData?.destination}
          captainLocation={captainCoords}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;
