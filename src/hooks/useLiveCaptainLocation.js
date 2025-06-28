
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL);

const useLiveCaptainLocation = (userId) => {
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("location-update", {
          userId,
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);
};

export default useLiveCaptainLocation;
