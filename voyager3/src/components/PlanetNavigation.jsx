import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpaceTravel from './SpaceTravel';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PlanetNavigation({ currentPlanetId, planets }) {
  const router = useRouter();
  const [spaceTravel, setSpaceTravel] = useState(null);
  
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
  
  const startSpaceTravel = (destination) => {
    console.log('Starting travel to:', destination);
    setSpaceTravel(destination);
  };
  
  const cancelSpaceTravel = () => {
    console.log('Canceling travel');
    setSpaceTravel(null);
  };
  
  // Shared button style for consistent look
  const buttonStyle = "bg-gradient-to-r from-blue-900/80 to-indigo-900/80 hover:from-blue-800/90 hover:to-indigo-800/90 " + 
                      "disabled:from-gray-800/70 disabled:to-gray-900/70 disabled:opacity-50 disabled:cursor-not-allowed " + 
                      "text-blue-100 font-medium py-3 px-6 rounded-full shadow-lg shadow-blue-900/30 " +
                      "border border-blue-600/30 backdrop-blur-sm w-full max-w-[200px] transition-all";
  
  return (
    <>
      {/* Flex container for buttons */}
      <div className="flex justify-between items-center w-full mt-8 px-4">
        {/* Left button (Toward Sun) */}
        <div className="w-1/3">
          <motion.button 
            onClick={() => towardSunPlanet && startSpaceTravel(towardSunPlanet.id)} 
            disabled={!towardSunPlanet}
            className={buttonStyle}
            whileHover={!towardSunPlanet ? {} : { 
              scale: 1.05,
              boxShadow: "0 0 20px 2px rgba(100, 150, 255, 0.4)"
            }}
            whileTap={!towardSunPlanet ? {} : { scale: 0.95 }}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Toward Sun
            </span>
          </motion.button>
        </div>
        
        {/* Center area - empty for spacing */}
        <div className="flex-grow"></div>
        
        {/* Right button (Away from Sun) */}
        <div className="w-1/3 flex justify-end">
          <motion.button 
            onClick={() => awayFromSunPlanet && startSpaceTravel(awayFromSunPlanet.id)} 
            disabled={!awayFromSunPlanet}
            className={buttonStyle}
            whileHover={!awayFromSunPlanet ? {} : { 
              scale: 1.05,
              boxShadow: "0 0 20px 2px rgba(100, 150, 255, 0.4)"
            }}
            whileTap={!awayFromSunPlanet ? {} : { scale: 0.95 }}
          >
            <span className="flex items-center justify-center">
              Away from Sun
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </motion.button>
        </div>
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