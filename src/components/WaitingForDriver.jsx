import React from 'react';

const WaitingForDriver = ({ ride, setVehicleFound, setWaitingForDriver }) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setVehicleFound(false);
          setWaitingForDriver(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Driver Confirmed 🚗</h3>

      <div className="flex flex-col gap-4 items-start text-gray-800">
        {ride?.user?.fullname && (
          <div className="text-lg font-medium">
            <span className="font-semibold">Rider:</span> {ride.user.fullname.firstname} {ride.user.fullname.lastname}
          </div>
        )}

        {ride?.captain && (
          <div className="text-md leading-6">
            <p><strong>Captain Name:</strong> {ride.captain.name?.firstname} {ride.captain.name?.lastname}</p>
            <p><strong>Vehicle Number:</strong> {ride.captain.vehicleNumber}</p>
            <p><strong>Vehicle Model:</strong> {ride.captain.vehicleModel}</p>
          </div>
        )}

        <div className="text-md leading-6">
          <p><strong>Pickup:</strong> {ride?.pickup}</p>
          <p><strong>Destination:</strong> {ride?.destination}</p>
          <p><strong>Fare:</strong>AED{ride?.fare}</p>
          <p><strong>OTP:</strong> <span className="font-bold text-red-600">{ride?.otp}</span></p>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
