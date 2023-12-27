// import { fuelApiClient } from '@/lib/fuelApi/fuelApiClient'
// import { useEffect, useState } from 'react';

export default function Home() {
  // const stations = await fuelApiClient.getAllCurrentPrices();
  // console.log(stations.stations.length, stations.prices.length);

  // const [currentLocation, setCurrentLocation] = useState({ lat: 0, lon: 0 });
  // const [locationError, setLocationError] = useState('');

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         setCurrentLocation({
  //           lat: position.coords.latitude,
  //           lon: position.coords.longitude
  //         });
  //       },
  //       error => {
  //         setLocationError('Unable to retrieve your location');
  //       }
  //     );
  //   } else {
  //     setLocationError('Geolocation is not supported by this browser');
  //   }
  // }, []);

  return (
    <main className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Fuel Stations Coming Soon</h1>
        {/* {locationError ? (
          <p>Error: {locationError}</p>
        ) : (
          <FuelStations currentLat={currentLocation.lat} currentLon={currentLocation.lon} />
        )} */}
      </div>
    </main>
  )
}
