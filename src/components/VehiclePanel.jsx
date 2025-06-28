import React from 'react';

const VehiclePanel = (props) => {
    const isDiscounted = Object.values(props.fare).some(f => f % 5 !== 0);
    const estimatedDistanceKm = props.distanceKm || 0;

    const carCO2PerKm = 120; // grams/km for petrol
    const electricCO2PerKm = 0; // electric assumed 0 emissions

    const getCO2Saved = () => {
        const saved = Math.round(estimatedDistanceKm * (carCO2PerKm - electricCO2PerKm));
        return saved;
    };

    const formatCO2 = () => {
        const saved = getCO2Saved();
        return saved >= 1000 ? `${(saved / 1000).toFixed(1)}kg` : `${saved}g`;
    };

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => props.setVehiclePanel(false)}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>

            {isDiscounted && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg shadow-sm text-sm">
                    🎉 Transit Discount Applied (15% Off)
                </div>
            )}

            {/* CoRide Go (petrol car) */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-10' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="coride-go" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>CoRide Go <span><i className="ri-user-3-fill"></i>4</span></h4>
                    <h5 className='font-medium text-sm'>2 mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <div className="text-right">
                    <h2 className='text-lg font-semibold'>د.إ{props.fare.car}</h2>
                    <p className="text-xs text-gray-500 flex items-center justify-end"><i className="ri-leaf-line mr-1"></i>Petrol vehicle</p>
                </div>
            </div>

            {/* CoPool (electric) */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-10' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="copool-carpool" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>CoPool <span><i className="ri-user-3-fill"></i>2</span></h4>
                    <h5 className='font-medium text-sm'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Eco-friendly shared rides</p>
                </div>
                <div className="text-right">
                    <h2 className='text-lg font-semibold'>د.إ{props.fare.moto}</h2>
                    <p className="text-xs text-green-600 flex items-center justify-end"><i className="ri-leaf-line mr-1"></i>CO₂ saved: {formatCO2()}</p>
                </div>
            </div>

            {/* CoGreen (electric) */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-10' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="copool-eco" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>CoGreen <span><i className="ri-user-3-fill"></i>3</span></h4>
                    <h5 className='font-medium text-sm'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Eco-friendly electric rides</p>
                </div>
                <div className="text-right">
                    <h2 className='text-lg font-semibold'>د.إ{props.fare.auto}</h2>
                    <p className="text-xs text-green-600 flex items-center justify-end"><i className="ri-leaf-line mr-1"></i>CO₂ saved: {formatCO2()}</p>
                </div>
            </div>
        </div>
    );
};

export default VehiclePanel;
