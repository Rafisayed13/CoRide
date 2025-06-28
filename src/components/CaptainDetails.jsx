import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <div>
      {/* Profile Section */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-3'>
          <img
            className='h-10 w-10 rounded-full object-cover'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
            alt=""
          />
          <div>
            <h4 className='text-lg font-medium capitalize'>
              {captain.fullname.firstname + ' ' + captain.fullname.lastname}
            </h4>
            <p className='text-sm text-gray-500'>⭐ 4.8 | {captain.vehicleModel} - {captain.vehicleNumber}</p>
            <p className='text-xs'>
              {captain?.isOnline ? (
                <span className='text-green-600'>🟢 Online</span>
              ) : (
                <span className='text-green-600'>🟢 Online</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <h4 className='text-xl font-semibold'>295.20 AED</h4>
          <p className='text-sm text-gray-600'>Earned</p>
        </div>
      </div>

      {/* Hours & Stats Section */}
      <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
        <div className='text-center'>
          <i className='text-3xl mb-2 font-thin ri-timer-2-line'></i>
          <h5 className='text-lg font-medium'>10.2</h5>
          <p className='text-sm text-gray-600'>Today’s Hours</p>
        </div>
        <div className='text-center'>
          <i className='text-3xl mb-2 font-thin ri-time-line'></i>
          <h5 className='text-lg font-medium'>25.7</h5>
          <p className='text-sm text-gray-600'>Weekly Total</p>
        </div>
        <div className='text-center'>
          <i className='text-3xl mb-2 font-thin ri-booklet-line'></i>
          <h5 className='text-lg font-medium'>18</h5>
          <p className='text-sm text-gray-600'>Completed Rides</p>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className='mt-6 bg-white p-4 rounded-lg shadow-md'>
        <h4 className='font-semibold text-lg mb-2'>Weekly Earnings</h4>
        <p className='text-xl font-bold text-green-600'>295.20 AED</p>
        <div className='w-full bg-gray-200 rounded-full h-3 mt-2'>
          <div
            className='bg-green-500 h-3 rounded-full'
            style={{ width: `${(295.2 / 500) * 100}%` }}
          ></div>
        </div>
        <p className='text-sm text-gray-500 mt-1'>Goal: 500 AED / week</p>
      </div>
    </div>
  );
};

export default CaptainDetails;