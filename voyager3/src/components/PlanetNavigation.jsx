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
  
  if (isLoading) {
    return <div className="flex justify-center py-4">Loading navigation...</div>;
  }
  
  if (currentPosition === null) {
    return <div>Planet navigation data not available</div>;
  }
  
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