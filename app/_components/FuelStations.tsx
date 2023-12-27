// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { fuelApiClient } from '@/lib/fuelApi/fuelApiClient';
// import { Station, Price, CurrentPrices } from '@/lib/fuelApi/schemas';
// import { getClosestStations } from '@/lib/utils';
// import Link from 'next/link';
// import React, { useState, useEffect } from 'react';

// interface FuelStationsComponentProps {
//     currentLat: number;
//     currentLon: number;
// }

// interface ClosestStationWithPrices extends Station {
//     prices: Price[];
// }

// const FuelStations: React.FC<FuelStationsComponentProps> = ({ currentLat, currentLon }) => {
//     const [closestStations, setClosestStations] = useState<ClosestStationWithPrices[]>([]);

//     useEffect(() => {
//         const fetchFuelStations = async () => {
//             try {
//                 const currentPrices: CurrentPrices = await fuelApiClient.getAllCurrentPrices();
//                 const closest: Station[] = getClosestStations(currentPrices, currentLat, currentLon);

//                 const closestWithPrices: ClosestStationWithPrices[] = closest.map(station => ({
//                     ...station,
//                     prices: currentPrices.prices.filter(price => price.stationcode === station.code)
//                 }));
//                 console.log(closestWithPrices);

//                 setClosestStations(closestWithPrices);
//             } catch (error) {
//                 console.error('Error fetching fuel stations:', error);
//             }
//         };

//         fetchFuelStations();
//     }, [currentLat, currentLon]);

//     return (
//         <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {
//                 closestStations.map(station => (
//                     <div key={station.stationid} className="flex flex-col gap-4">
//                         <Card>
//                             <CardHeader>
//                                 <div className="flex justify-between items-center">
//                                     <div>
//                                         <h2 className="text-lg font-bold tracking-tight">{station.name}</h2>
//                                         <p className="text-sm text-gray-500">{station.address}</p>
//                                         <p className="text-sm text-gray-500">Lat: {station.location.latitude} Long: {station.location.longitude}</p>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <p className="text-sm text-gray-500">4.6km</p>
//                                         <ArrowRightIcon className="w-4 h-4" />
//                                     </div>
//                                 </div>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="flex flex-col gap-2">
//                                     {station.prices.map(price => (
//                                         <Badge key={price.fueltype}>{`${price.fueltype}: ${price.price}`}</Badge>
//                                     ))}
//                                 </div>
//                             </CardContent>
//                             <div className="m-4">
//                                 <Button asChild>
//                                     <Link href="#">View Details</Link>
//                                 </Button>
//                             </div>
//                         </Card>
//                     </div>))
//             }</div>
//     )
// };

// function ArrowRightIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M5 12h14" />
//             <path d="m12 5 7 7-7 7" />
//         </svg>
//     )
// }

// export default FuelStations;
