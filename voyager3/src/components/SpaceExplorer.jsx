import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// Star component using framer motion
const Star = ({ style }) => {
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
        duration: Math.random() * 3 + 3,
        ease: "easeInOut"
      }}
      style={style}
    />
  );
};

// Orbiting planet component
const OrbitingPlanet = ({ size, color, orbitRadius, speed }) => {
  return (
    <motion.div
      className="absolute rounded-full"
      animate={{
        rotate: 360
      }}
      transition={{
        repeat: Infinity,
        duration: speed,
        ease: "linear"
      }}
      style={{
        width: orbitRadius * 2,
        height: orbitRadius * 2,
      }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
          top: 0,
          left: '50%',
          marginLeft: -size/2
        }}
        animate={{
          scale: [1, 1.1, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 3 + Math.random() * 2
        }}
      />
    </motion.div>
  );
};

// Space dust particles
const SpaceDust = ({ count = 30 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 2 + 0.5;
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        
        return (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full bg-white/20"
            style={{
              width: size,
              height: size,
              left: `${xPos}%`,
              top: `${yPos}%`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              x: [0, Math.random() * 30 - 15],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              repeat: Infinity,
              duration,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </>
  );
};

const SpaceExplorer = () => {
  // State for stars and mouse position
  const [stars, setStars] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse movement
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Transform values for parallax effects
  const nebulaX = useTransform(smoothMouseX, [0, 1000], [20, -20]);
  const nebulaY = useTransform(smoothMouseY, [0, 1000], [20, -20]);
  const nebula2X = useTransform(smoothMouseX, [0, 1000], [-20, 20]);
  const nebula2Y = useTransform(smoothMouseY, [0, 1000], [-20, 20]);

  // Generate random stars and handle mouse movement
  useEffect(() => {
    // Generate stars
    if (typeof window !== 'undefined') {
      const newStars = [];
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 3000);
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
        });
      }
      
      setStars(newStars);
      
      // Mouse movement handler
      const handleMouseMove = (e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [mouseX, mouseY]);

  // Data for the main content
  const pageContent = {
    title: "Voyager3",
    subtitle: "Begin your journey through our solar system!",
    buttonText: "Start Exploration",
    helperText: "Click the button to begin at Earth",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
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

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 0px 20px 2px rgba(100, 200, 255, 0.5)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 0px 10px 1px rgba(100, 200, 255, 0.3)" 
    }
  };

  return (
    <main className="bg-black flex flex-row justify-center w-full min-h-screen overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((style, index) => (
          <Star key={`star-${index}`} style={style} />
        ))}
        
        {/* Space dust */}
        <SpaceDust count={30} />
      </div>

      {/* Orbiting planets */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <OrbitingPlanet size={12} color="rgba(255, 107, 107, 0.8)" orbitRadius={100} speed={20} />
        <OrbitingPlanet size={18} color="rgba(100, 200, 255, 0.8)" orbitRadius={150} speed={35} />
        <OrbitingPlanet size={10} color="rgba(255, 222, 125, 0.8)" orbitRadius={200} speed={45} />
      </div>

      {/* Dynamic nebula effects */}
      <motion.div 
        className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
        style={{ 
          x: nebulaX,
          y: nebulaY
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
        style={{ 
          x: nebula2X,
          y: nebula2Y
        }}
      />
      
      {/* Main content */}
      <section className="relative z-10 w-full max-w-[1280px] min-h-screen flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-7 max-w-[700px] text-center px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <motion.h1 
              className="font-bold text-white text-[90px] leading-tight"
              style={{ textShadow: '0 0 20px rgba(100, 200, 255, 0.9)' }}
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(100, 200, 255, 0.9)',
                  '0 0 30px rgba(100, 200, 255, 1.0)',
                  '0 0 20px rgba(100, 200, 255, 0.9)'
                ]
              }}
              transition={{
                repeat: Infinity,
                duration: 3
              }}
            >
              {pageContent.title}
            </motion.h1>

            <motion.p 
              className="font-normal text-white text-3xl mt-2"
              variants={itemVariants}
            >
              {pageContent.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link href="/planets/earth">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 
                        text-white rounded-full px-[30px] py-[10px] cursor-pointer"
                variants={buttonVariants}
              >
                <span className="font-normal text-[25px]">
                  {pageContent.buttonText}
                </span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.p 
            className="font-normal text-[#ffffff80] text-[15px] mt-2"
            variants={itemVariants}
          >
            {pageContent.helperText}
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
};

export default SpaceExplorer;