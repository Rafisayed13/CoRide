import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Create emoji markers with L.divIcon
const createEmojiIcon = (emoji) =>
  L.divIcon({
    className: 'custom-emoji-icon',
    html: `<div style="font-size: 24px;">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

// Haversine formula for distance between two points
function getDistanceInKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
}

const LiveTracking = ({ pickup, destination, captainLocation }) => {
  const [currentPosition, setCurrentPosition] = useState([25.276987, 55.296249]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [pickupCoord, setPickupCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);

  const fetchCoordinates = async (location, setter) => {
    if (!location) return;
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: location, format: 'json', limit: 1 }
      });
      const data = response.data;
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setter([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const fetchRoute = async () => {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          coordinates: [
            [pickupCoord[1], pickupCoord[0]],
            [destinationCoord[1], destinationCoord[0]]
          ]
        },
        {
          headers: {
            Authorization: import.meta.env.VITE_ORS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      const coordinates = response.data.features[0].geometry.coordinates.map(
        ([lon, lat]) => [lat, lon]
      );
      setRouteCoords(coordinates);
    } catch (err) {
      console.error('Error fetching route:', err);
    }
  };

  useEffect(() => {
    if (pickup) fetchCoordinates(pickup, setPickupCoord);
  }, [pickup]);

  useEffect(() => {
    if (destination) fetchCoordinates(destination, setDestinationCoord);
  }, [destination]);

  useEffect(() => {
    if (
      pickupCoord && destinationCoord &&
      !isNaN(pickupCoord[0]) && !isNaN(pickupCoord[1]) &&
      !isNaN(destinationCoord[0]) && !isNaN(destinationCoord[1])
    ) {
      fetchRoute();
    }
  }, [pickupCoord, destinationCoord]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition([latitude, longitude]);
    });

    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition([latitude, longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer center={currentPosition} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🚗 You */}
          <Marker position={currentPosition} icon={createEmojiIcon('🚗')}>
            <Tooltip direction="top" offset={[0, -10]} permanent={false}>You</Tooltip>
          </Marker>

          {/* 📍 Pickup */}
          {pickupCoord && (
            <Marker position={pickupCoord} icon={createEmojiIcon('📍')}>
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>Pickup</Tooltip>
            </Marker>
          )}

          {/* 🏁 Destination */}
          {destinationCoord && (
            <Marker position={destinationCoord} icon={createEmojiIcon('🏁')}>
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>Destination</Tooltip>
            </Marker>
          )}

          {/* 🧑‍✈️ Captain */}
          {captainLocation && (
            <Marker position={captainLocation} icon={createEmojiIcon('🧑‍✈️')}>
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>Captain</Tooltip>
            </Marker>
          )}

          {/* Route line from OpenRouteService */}
          {routeCoords.length > 0 ? (
            <Polyline positions={routeCoords} color="blue" />
          ) : (
            pickupCoord && destinationCoord && (
              <Polyline positions={[pickupCoord, destinationCoord]} color="gray" dashArray="6" />
            )
          )}
        </MapContainer>
      </div>

      {/* Show distance if both coords exist */}
      {pickupCoord && destinationCoord && (
        <p className="text-center text-gray-600">
          📏 Distance: {getDistanceInKm(pickupCoord, destinationCoord)} km
        </p>
      )}
    </div>
  );
};

export default LiveTracking;
