import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpaceTravel from './SpaceTravel';

export default function PlanetNavigation({ currentPlanetId, planets }) {
  const router = useRouter();
  const [spaceTravel, setSpaceTravel] = useState(null);
  
  // Find current planet
  const currentIndex = planets.findIndex(planet => planet.id === currentPlanetId);
  if (currentIndex === -1) {
    console.error('Planet not found:', currentPlanetId);
    return <div>Planet not found</div>;
  }
  
  const currentPlanet = planets[currentIndex];
  console.log('Current planet:', currentPlanet);
  
  // Find adjacent planets
  const towardSunPlanet = planets.find(p => p.position === currentPlanet.position - 1);
  const awayFromSunPlanet = planets.find(p => p.position === currentPlanet.position + 1);
  
  console.log('Toward sun:', towardSunPlanet);
  console.log('Away from sun:', awayFromSunPlanet);
  
  const startSpaceTravel = (destination) => {
    console.log('Starting travel to:', destination);
    setSpaceTravel(destination);
  };
  
  const cancelSpaceTravel = () => {
    console.log('Canceling travel');
    setSpaceTravel(null);
  };
  
  return (
    <>
      <div className="flex gap-4 mt-4">
        <button 
          onClick={() => towardSunPlanet && startSpaceTravel(towardSunPlanet.id)} 
          disabled={!towardSunPlanet}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ← Toward Sun
        </button>
        
        <button 
          onClick={() => awayFromSunPlanet && startSpaceTravel(awayFromSunPlanet.id)} 
          disabled={!awayFromSunPlanet}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Away from Sun →
        </button>
      </div>
      
      {spaceTravel && (
        <SpaceTravel 
          destination={spaceTravel}
          onCancel={cancelSpaceTravel}
        />
      )}
    </>
  );
}