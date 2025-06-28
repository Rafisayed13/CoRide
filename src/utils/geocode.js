// src/utils/geocode.js
export async function reverseGeocode(lat, lon) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    return data.display_name || 'Current Location';
  }
  
  export async function searchPlace(query) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`);
    const data = await res.json();
    return data.map(loc => loc.display_name);
  }
  