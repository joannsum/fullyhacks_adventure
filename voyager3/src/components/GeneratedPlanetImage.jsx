'use client';

import React from 'react';

const GeneratedPlanetImage = ({ planetName, size = 200 }) => {
  // Generate a unique hash from the planet name to ensure consistent colors
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const intToRGB = (i) => {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  };

  const hash = hashCode(planetName);
  const mainColor = `#${intToRGB(hash)}`;
  const secondaryColor = `#${intToRGB(hash >> 2)}`;
  const spotColor = `#${intToRGB(hash >> 4)}`;

  // Determine planet type based on name (for different visual styles)
  const planetType = hash % 5; // 0-4 different types

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Planet background circle */}
      <circle cx="100" cy="100" r="80" fill={mainColor} />
      
      {/* Add different features based on planet type */}
      {planetType === 0 && (
        // Gas giant with rings
        <>
          <ellipse
            cx="100"
            cy="100"
            rx="95"
            ry="25"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="4"
            opacity="0.7"
          />
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="20"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            opacity="0.5"
          />
          {/* Surface swirls */}
          <path
            d={`M50,90 C70,${70 + (hash % 20)},130,${110 + (hash % 20)},150,90`}
            fill="none"
            stroke={spotColor}
            strokeWidth="8"
            opacity="0.4"
          />
          <path
            d={`M60,110 C80,${90 + (hash % 20)},120,${130 + (hash % 20)},140,110`}
            fill="none"
            stroke={spotColor}
            strokeWidth="6"
            opacity="0.3"
          />
        </>
      )}
      
      {planetType === 1 && (
        // Rocky planet with craters
        <>
          {/* Generate some random craters */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (hash + i * 50) % 360;
            const distance = 40 + (hash % 30);
            const x = 100 + Math.cos(angle * Math.PI / 180) * distance;
            const y = 100 + Math.sin(angle * Math.PI / 180) * distance;
            const size = 5 + (hash % 15);
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={size}
                fill={secondaryColor}
                opacity="0.7"
              />
            );
          })}
          
          {/* Add some surface features */}
          <path
            d={`M${70 + (hash % 10)},${70 + (hash % 10)} L${130 - (hash % 10)},${130 - (hash % 10)}`}
            stroke={spotColor}
            strokeWidth="3"
            opacity="0.5"
          />
          <path
            d={`M${70 + (hash % 20)},${130 - (hash % 20)} L${130 - (hash % 20)},${70 + (hash % 20)}`}
            stroke={spotColor}
            strokeWidth="3"
            opacity="0.5"
          />
        </>
      )}
      
      {planetType === 2 && (
        // Earth-like planet with "continents"
        <>
          {/* Generate continental shapes */}
          <path
            d={`M${80 + (hash % 10)},${60 + (hash % 10)} 
               C${100 + (hash % 30)},${50 + (hash % 20)},
                ${120 + (hash % 30)},${70 + (hash % 20)},
                ${130 + (hash % 10)},${90 + (hash % 10)} 
               C${140 + (hash % 10)},${110 + (hash % 10)},
                ${120 + (hash % 20)},${130 + (hash % 20)},
                ${100 + (hash % 10)},${130 + (hash % 10)} 
               C${80 + (hash % 20)},${140 + (hash % 10)},
                ${60 + (hash % 20)},${120 + (hash % 20)},
                ${70 + (hash % 10)},${100 + (hash % 10)} 
               C${60 + (hash % 10)},${80 + (hash % 10)},
                ${70 + (hash % 20)},${70 + (hash % 20)},
                ${80 + (hash % 10)},${60 + (hash % 10)}`}
            fill={spotColor}
            opacity="0.7"
          />
          
          {/* Add a circular "polar cap" */}
          <circle
            cx="100"
            cy="50"
            r="25"
            fill={secondaryColor}
            opacity="0.6"
          />
        </>
      )}
      
      {planetType === 3 && (
        // Ice planet with patterns
        <>
          {/* Ice patterns */}
          <circle cx="100" cy="100" r="75" fill={secondaryColor} opacity="0.3" />
          <circle cx="100" cy="100" r="65" fill={mainColor} opacity="0.6" />
          <circle cx="100" cy="100" r="55" fill={secondaryColor} opacity="0.2" />
          
          {/* Cracks in the surface */}
          <path
            d={`M${70 + (hash % 20)},${70 + (hash % 20)} L${130 - (hash % 20)},${130 - (hash % 20)}`}
            stroke="white"
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d={`M${90 + (hash % 20)},${60 + (hash % 10)} L${110 - (hash % 20)},${140 - (hash % 10)}`}
            stroke="white"
            strokeWidth="1"
            opacity="0.7"
          />
          <path
            d={`M${60 + (hash % 10)},${90 + (hash % 20)} L${140 - (hash % 10)},${110 - (hash % 20)}`}
            stroke="white"
            strokeWidth="1"
            opacity="0.7"
          />
        </>
      )}
      
      {planetType === 4 && (
        // Exotic planet with weird features
        <>
          {/* Strange central feature */}
          <circle
            cx="100"
            cy="100"
            r="30"
            fill={secondaryColor}
            opacity="0.8"
          />
          
          {/* Radiating energy/tentacles/features */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 + (hash % 45)) % 360;
            const x1 = 100 + Math.cos(angle * Math.PI / 180) * 30;
            const y1 = 100 + Math.sin(angle * Math.PI / 180) * 30;
            const x2 = 100 + Math.cos(angle * Math.PI / 180) * 80;
            const y2 = 100 + Math.sin(angle * Math.PI / 180) * 80;
            
            return (
              <path
                key={i}
                d={`M${x1},${y1} Q${100 + Math.cos((angle + 20) * Math.PI / 180) * 50},${100 + Math.sin((angle + 20) * Math.PI / 180) * 50} ${x2},${y2}`}
                stroke={spotColor}
                strokeWidth="4"
                fill="none"
                opacity="0.6"
              />
            );
          })}
          
          {/* Additional spots */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (hash + i * 70) % 360;
            const distance = 50 + (hash % 20);
            const x = 100 + Math.cos(angle * Math.PI / 180) * distance;
            const y = 100 + Math.sin(angle * Math.PI / 180) * distance;
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3 + (hash % 5)}
                fill="#ffffff"
                opacity="0.7"
              />
            );
          })}
        </>
      )}
      
      {/* Atmosphere glow effect */}
      <circle 
        cx="100" 
        cy="100" 
        r="83" 
        fill="none" 
        stroke="white" 
        strokeWidth="1" 
        opacity="0.3" 
      />
      
      {/* Highlight */}
      <circle
        cx="80"
        cy="80"
        r="15"
        fill="white"
        opacity="0.15"
      />
    </svg>
  );
};

export default GeneratedPlanetImage;