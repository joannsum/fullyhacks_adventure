'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { planets } from '@/data/planets';
import FactButton from '@/components/FactButton';
import FactDisplay from '@/components/FactDisplay';
import PlanetNavigation from '@/components/PlanetNavigation';
import GameOver from '@/components/GameOver';

// Star component using framer motion with fixed animation duration
const Star = ({ style, duration }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      initial={{ opacity: 0.2 }}
      animate={{ 
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: duration,
        ease: "easeInOut"
      }}
      style={style}
    />
  );
};

// Glowing star component
const GlowingStar = ({ style, duration, color }) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        ...style,
        boxShadow: `0 0 10px 2px ${color}`,
        backgroundColor: color,
      }}
      animate={{ 
        opacity: [0.6, 1, 0.6],
        boxShadow: [
          `0 0 10px 2px ${color}`,
          `0 0 20px 4px ${color}`,
          `0 0 10px 2px ${color}`
        ]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: duration,
        ease: "easeInOut"
      }}
    />
  );
};

// Space dust with pre-computed values
const SpaceDust = ({ particles }) => {
  return (
    <>
      {particles.map((particle, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.xPos}%`,
            top: `${particle.yPos}%`,
          }}
          animate={{
            y: [0, particle.yOffset],
            x: [0, particle.xOffset],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: particle.duration,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

// Nebula cloud effect
const NebulaCloud = ({ style }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-10"
      style={style}
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.05, 0.15, 0.05]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: style.duration || 20,
        ease: "easeInOut"
      }}
    />
  );
};

export default function PlanetPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [selectedFact, setSelectedFact] = useState(null);
  const [stars, setStars] = useState([]);
  const [dustParticles, setDustParticles] = useState([]);
  const [glowingStars, setGlowingStars] = useState([]);
  const [nebulaClouds, setNebulaClouds] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Find the current planet
  const currentPlanet = planets.find(planet => planet.id === id);
  
  // Generate space background elements
  useEffect(() => {
    setIsClient(true);
    
    // Generate stars with fixed random values
    const newStars = [];
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        left: `${(i * 7.3) % 100}%`,
        top: `${(i * 11.7) % 100}%`,
        width: `${(i % 3) + 1}px`,
        height: `${(i % 3) + 1}px`,
        duration: 3 + (i % 5)
      });
    }
    
    // Generate glowing stars
    const newGlowingStars = [];
    const glowingStarColors = [
      "rgba(100, 200, 255, 0.8)", // Blue
      "rgba(255, 170, 100, 0.8)", // Orange
      "rgba(200, 100, 255, 0.8)", // Purple
      "rgba(255, 255, 160, 0.8)", // Yellow
      "rgba(255, 120, 120, 0.8)", // Red
    ];
    
    for (let i = 0; i < 10; i++) {
      newGlowingStars.push({
        left: `${(i * 19.5) % 100}%`,
        top: `${(i * 23.7) % 100}%`,
        width: `${(i % 3) + 3}px`,
        height: `${(i % 3) + 3}px`,
        duration: 6 + (i % 7),
        color: glowingStarColors[i % glowingStarColors.length]
      });
    }
    
    // Generate nebula clouds
    const newNebulaClouds = [];
    
    // Customize nebula colors based on the current planet
    let nebulaColors = [];
    if (currentPlanet) {
      switch(currentPlanet.id) {
        case 'mercury':
          nebulaColors = ["rgba(200, 160, 120, 0.1)", "rgba(180, 170, 150, 0.1)"];
          break;
        case 'venus':
          nebulaColors = ["rgba(230, 180, 100, 0.1)", "rgba(230, 150, 100, 0.1)"];
          break;
        case 'earth':
          nebulaColors = ["rgba(80, 150, 200, 0.1)", "rgba(100, 170, 130, 0.1)"];
          break;
        case 'mars':
          nebulaColors = ["rgba(200, 100, 80, 0.1)", "rgba(170, 120, 100, 0.1)"];
          break;
        case 'jupiter':
          nebulaColors = ["rgba(190, 150, 110, 0.1)", "rgba(170, 120, 90, 0.1)"];
          break;
        case 'saturn':
          nebulaColors = ["rgba(200, 190, 140, 0.1)", "rgba(170, 160, 120, 0.1)"];
          break;
        case 'uranus':
          nebulaColors = ["rgba(130, 200, 220, 0.1)", "rgba(100, 170, 190, 0.1)"];
          break;
        case 'neptune':
          nebulaColors = ["rgba(80, 120, 200, 0.1)", "rgba(60, 100, 180, 0.1)"];
          break;
        case 'pluto':
          nebulaColors = ["rgba(160, 160, 180, 0.1)", "rgba(140, 140, 160, 0.1)"];
          break;
        default:
          nebulaColors = ["rgba(130, 80, 170, 0.1)", "rgba(100, 150, 200, 0.1)"];
      }
    } else {
      nebulaColors = ["rgba(80, 120, 200, 0.1)", "rgba(130, 80, 170, 0.1)"];
    }
    
    for (let i = 0; i < 5; i++) {
      newNebulaClouds.push({
        left: `${(i * 25) % 100}%`,
        top: `${(i * 37) % 100}%`,
        width: `${200 + (i * 50)}px`,
        height: `${150 + (i * 30)}px`,
        backgroundColor: nebulaColors[i % nebulaColors.length],
        duration: 20 + (i * 5)
      });
    }
    
    // Generate dust particles with fixed random values
    const newDust = [];
    for (let i = 0; i < 40; i++) {
      newDust.push({
        size: 0.5 + (i % 4) * 0.5,
        xPos: (i * 3.3) % 100,
        yPos: (i * 5.7) % 100,
        yOffset: ((i % 30) - 15),
        xOffset: ((i % 30) - 15),
        duration: 15 + (i % 10)
      });
    }
    
    setStars(newStars);
    setDustParticles(newDust);
    setGlowingStars(newGlowingStars);
    setNebulaClouds(newNebulaClouds);
    
    // Mouse movement handler - only added on client side
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [id, mouseX, mouseY, currentPlanet]);
  
  if (!currentPlanet) return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );
  
  // Check if we've reached the sun
  if (currentPlanet.id === "sun") {
    return <GameOver />;
  }
  
  // Animation variants for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  const planetImageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };
  
  // Calculate parallax effects for the planet image
  const planetX = useTransform(smoothMouseX, [0, window?.innerWidth || 1000], [-15, 15]);
  const planetY = useTransform(smoothMouseY, [0, window?.innerHeight || 1000], [-15, 15]);
  
  return (
    <main className="bg-black text-white min-h-screen overflow-hidden relative">
      {/* Stars background */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden">
          {/* Nebula clouds for depth */}
          {nebulaClouds.map((cloud, index) => (
            <NebulaCloud key={`nebula-${index}`} style={cloud} />
          ))}
          
          {/* Regular stars */}
          {stars.map((star, index) => (
            <Star key={`star-${index}`} style={star} duration={star.duration} />
          ))}
          
          {/* Glowing stars */}
          {glowingStars.map((star, index) => (
            <GlowingStar 
              key={`glow-${index}`} 
              style={star} 
              duration={star.duration}
              color={star.color}
            />
          ))}
          
          {/* Space dust */}
          <SpaceDust particles={dustParticles} />
        </div>
      )}
      
      {/* Content area with parallax effect */}
      <div className="relative z-10 container mx-auto px-20 py-8">
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Planet name */}
          <motion.h1 
            className="font-bungee-hairline text-4xl md:text-5xl mb-6 text-center"
            style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}
            variants={itemVariants}
          >
            {currentPlanet.name}
          </motion.h1>
          
          {/* Planet image with parallax hover effect */}
          <motion.div 
            className="relative w-64 h-64 md:w-80 md:h-80 mb-8"
            variants={planetImageVariants}
          >
            <motion.div
              style={{
                x: planetX,
                y: planetY
              }}
              className="w-full h-full"
            >
              <Image
                src={currentPlanet.image}
                alt={currentPlanet.name}
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                priority
              />
            </motion.div>
            
            {/* Glow effect behind planet */}
            <div 
              className="absolute inset-0 rounded-full blur-xl -z-10 opacity-30"
              style={{
                backgroundColor: getPlanetColor(currentPlanet.id),
                transform: 'scale(0.9)'
              }}
            />
          </motion.div>
          
          <motion.div className="flex items-center">
          <motion.p
              className="relative w-30 h-30 mb-8 md:w-1/5"
          >
              <Image
              src="/sidebooster.png"
              alt="rover"
              fill
              className="object-contain"
              />
          </motion.p>

          <motion.p
              className="text-center max-w-md mb-8 text-white md:w-4/5 ml-4"
              variants={itemVariants}
          >
              {description}
          </motion.p>
      </motion.div>
          
          {/* Fact buttons */}
          // Inside your PlanetPage component, modify the fact buttons section:

{/* Fact buttons with more consistent spacing */}
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 w-full max-w-3xl"
      variants={itemVariants}
    >
      {currentPlanet.facts.map((fact, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="h-full" // Add height to ensure all buttons are same height
        >
          <FactButton 
            title={fact.title}
            onClick={() => setSelectedFact(fact)}
          />
        </motion.div>
      ))}
    </motion.div>
          
          {/* Fact display */}
          <AnimatePresence mode="wait">
            {selectedFact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-4xl mb-10"
              >
                <FactDisplay fact={selectedFact} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation */}
          <motion.div 
            className="w-full max-w-4xl"
            variants={itemVariants}
          >
            <PlanetNavigation currentPlanetId={id} planets={planets} />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

// Helper function to get a color for each planet's glow
function getPlanetColor(planetId) {
  const colors = {
    mercury: "rgba(180, 180, 180, 0.6)",
    venus: "rgba(230, 180, 100, 0.6)",
    earth: "rgba(80, 150, 200, 0.6)",
    mars: "rgba(200, 100, 80, 0.6)",
    jupiter: "rgba(190, 150, 110, 0.6)",
    saturn: "rgba(200, 190, 140, 0.6)",
    uranus: "rgba(130, 200, 220, 0.6)",
    neptune: "rgba(80, 120, 200, 0.6)",
    pluto: "rgba(160, 160, 180, 0.6)",
    default: "rgba(255, 255, 255, 0.6)"
  };
  
  return colors[planetId] || colors.default;
}