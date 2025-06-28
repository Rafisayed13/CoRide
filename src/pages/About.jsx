import React from 'react';

export default function About() {
  return (
    <div className="bg-bgsoft min-h-screen text-textdark px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-primary mb-6">Why CoRide?</h1>
      <p className="text-lg text-center max-w-3xl mb-12">
        At CoRide, we believe transportation should be smart, safe, and sustainable. Here’s what makes CoRide different:
      </p>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
        {/* feature cards here */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary mb-2">🌱 Eco-Friendly Rides</h3>
          <p>We promote carpooling and green travel options to reduce traffic and pollution in your city.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary mb-2">📱 Easy to Use</h3>
          <p>Book rides with a few taps, track your driver live, and enjoy smooth navigation through our user-friendly app.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary mb-2">💸 Affordable Pricing</h3>
          <p>Smart ride-sharing = lower fares. Enjoy competitive pricing and exclusive discounts through our app.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary mb-2">🤝 Community-Driven</h3>
          <p>We’re built around trust, community, and comfort — ride with verified drivers and friendly co-riders.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary mb-2">🌍 Multilingual & Inclusive</h3>
          <p>Switch between languages easily, and connect with drivers who understand your needs and culture.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary mb-2">🔒 Safety First</h3>
          <p>Real-time tracking, emergency buttons, and verified profiles ensure peace of mind with every ride.</p>
        </div>
      </div>
    </div>
  );
}
