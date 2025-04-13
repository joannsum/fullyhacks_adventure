'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpaceTravel from './SpaceTravel';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PlanetNavigation({ currentPlanetId, planets }) {
  const router = useRouter();
  const [spaceTravel, setSpaceTravel] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [towardSunPlanet, setTowardSunPlanet] = useState(null);
  const [awayFromSunPlanet, setAwayFromSunPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Check if AI planet generation is enabled
  const enableAIPlanets = process.env.NEXT_PUBLIC_ENABLE_AI_PLANETS === 'true';
  const aiStartPosition = parseInt(process.env.NEXT_PUBLIC_AI_PLANETS_START_POSITION || '9');
  
  // Determine if this is an AI-generated planet ID
  const isAIPlanetId = currentPlanetId.startsWith('ai-planet-');
  
  // Effect to handle planet navigation data
  useEffect(() => {
    const setupNavigation = async () => {
      setIsLoading(true);

      // Find the current planet in the regular planets array
      let currentIndex = planets.findIndex(planet => planet.id === currentPlanetId);
      let position;

      // If we found it in regular planets
      if (currentIndex !== -1) {
        position = planets[currentIndex].position;
      } 
      // If it's an AI planet ID, extract position from ID
      else if (isAIPlanetId) {
        position = parseInt(currentPlanetId.replace('ai-planet-', ''));
      } 
      // Otherwise, try to fetch from API
      else if (enableAIPlanets) {
        try {
          const response = await fetch(`/api/planets?id=${currentPlanetId}`);
          if (response.ok) {
            const planetData = await response.json();
            position = planetData.position;
          }
        } catch (error) {
          console.error('Error fetching planet data:', error);
        }
      }

      if (position !== undefined) {
        setCurrentPosition(position);
        
        // Find toward sun planet (always from regular planets for positions < aiStartPosition)
        if (position > 0) {
          if (position < aiStartPosition) {
            setTowardSunPlanet(planets.find(p => p.position === position - 1));
          } else {
            // Check if we need to get a regular planet or AI planet
            const prevPosition = position - 1;
            if (prevPosition < aiStartPosition) {
              // It's a regular planet
              setTowardSunPlanet(planets.find(p => p.position === prevPosition));
            } else {
              // It's an AI planet, create an ID for it
              setTowardSunPlanet({
                id: `ai-planet-${prevPosition}`,
                position: prevPosition
              });
            }
          }
        }
        
        // Find away from sun planet
        if (position < planets[planets.length - 1].position) {
          setAwayFromSunPlanet(planets.find(p => p.position === position + 1));
        } else if (enableAIPlanets) {
          // For positions beyond regular planets, create next AI planet
          setAwayFromSunPlanet({
            id: `ai-planet-${position + 1}`,
            position: position + 1
          });
        }
      }
      
      setIsLoading(false);
    };
    
    setupNavigation();
  }, [currentPlanetId, planets, enableAIPlanets, aiStartPosition, isAIPlanetId]);

  const startSpaceTravel = (destination) => {
    console.log('Starting travel to:', destination);
    setSpaceTravel(destination);
  };
  
  const cancelSpaceTravel = () => {
    console.log('Canceling travel');
    setSpaceTravel(null);
  };
  
  // End adventure and return to first page
  const endAdventure = () => {
    router.push('/');
  };

  if (isLoading) {
    return <div className="flex justify-center py-4">Loading navigation...</div>;
  }
  
  if (currentPosition === null) {
    return <div>Planet navigation data not available</div>;
  }
  
  // Shared button style for consistent look
  const buttonStyle = "bg-gradient-to-r from-blue-900/80 to-indigo-900/80 hover:from-blue-800/90 hover:to-indigo-800/90 " + 
                      "disabled:from-gray-800/70 disabled:to-gray-900/70 disabled:opacity-50 disabled:cursor-not-allowed " + 
                      "text-blue-100 font-medium py-3 px-6 rounded-full shadow-lg shadow-blue-900/30 " +
                      "border border-blue-600/30 backdrop-blur-sm w-full max-w-[200px] transition-all";
  
  return (
    <>
      {/* Flex container for navigation buttons */}
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
            <span className="flex items-center justify-center font-bungee-hairline">
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
        <div className="w-1/3 flex justify-end font-bungee-hairline">
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
      
      {/* End Adventure button - now positioned at the bottom with consistent styling */}
      <div className="flex justify-center mt-20 mb-2 font-bungee-hairline">
        <motion.button
          onClick={() => setShowConfirmDialog(true)}
          className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 hover:from-blue-800/90 hover:to-indigo-800/90
                    text-blue-100 font-bungee-hairline py-2 px-5 rounded-full text-sm border border-blue-600/30
                    shadow-md shadow-blue-900/30 backdrop-blur-sm transition-all"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 15px rgba(100, 150, 255, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            End Adventure
          </span>
        </motion.button>
      </div>

      {/* Space travel component */}
      {spaceTravel && (
        <SpaceTravel 
          destination={spaceTravel}
          onCancel={cancelSpaceTravel}
        />
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <motion.div 
            className="bg-gray-900/90 border border-blue-800/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <h3 className="text-xl font-bungee-hairline text-white mb-1">End Your Space Adventure?</h3>
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-700/50 to-transparent mb-4"></div>
            
            <p className="font-thin text-blue-100 mb-6">
              Are you sure you want to end your space adventure and return to the beginning?
              Your journey through the solar system will be reset.
            </p>
            
            <div className="flex space-x-4">
              <motion.button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bungee-hairline py-2 px-4 rounded-lg border border-gray-700/50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                onClick={endAdventure}
                className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700
                          text-white font-bungee-hairline py-2 px-4 rounded-lg border border-blue-600/50 shadow-md"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                End Adventure
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}