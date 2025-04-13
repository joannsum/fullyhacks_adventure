import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const Star = ({ style, duration }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    initial={{ opacity: 0.2 }}
    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
    transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
    style={style}
  />
);

const GlowingStar = ({ style, duration, color }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ ...style, boxShadow: `0 0 10px 2px ${color}`, backgroundColor: color }}
    animate={{
      opacity: [0.6, 1, 0.6],
      boxShadow: [`0 0 10px 2px ${color}`, `0 0 20px 4px ${color}`, `0 0 10px 2px ${color}`]
    }}
    transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
  />
);

const NebulaCloud = ({ style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-10"
    style={style}
    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
    transition={{ repeat: Infinity, duration: 15 + Math.random() * 10, ease: "easeInOut" }}
  />
);

const OrbitingPlanet = ({ size, color, orbitRadius, speed, pulseDuration }) => (
  <motion.div
    className="absolute"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
    style={{
      width: orbitRadius * 2,
      height: orbitRadius * 2,
      top: '50%',
      left: '50%',
      marginLeft: -orbitRadius,
      marginTop: -orbitRadius,
    }}
  >
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        top: '50%',
        left: '100%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  </motion.div>
);

const SpaceDust = ({ particles }) => (
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

const SpaceExplorer = () => {
  const [stars, setStars] = useState([]);
  const [dustParticles, setDustParticles] = useState([]);
  const [glowingStars, setGlowingStars] = useState([]);
  const [nebulaClouds, setNebulaClouds] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [planetParams] = useState({
    planet1: { size: 12, color: "rgba(255, 107, 107, 0.8)", orbitRadius: 100, speed: 20, pulseDuration: 4 },
    planet2: { size: 18, color: "rgba(100, 200, 255, 0.8)", orbitRadius: 150, speed: 35, pulseDuration: 5 },
    planet3: { size: 10, color: "rgba(255, 222, 125, 0.8)", orbitRadius: 200, speed: 45, pulseDuration: 3.5 }
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const nebulaX = useTransform(smoothMouseX, [0, 1000], [20, -20]);
  const nebulaY = useTransform(smoothMouseY, [0, 1000], [20, -20]);
  const nebula2X = useTransform(smoothMouseX, [0, 1000], [-20, 20]);
  const nebula2Y = useTransform(smoothMouseY, [0, 1000], [-20, 20]);

  useEffect(() => {
    setIsClient(true);
    const newStars = Array.from({ length: 300 }, (_, i) => ({
      left: `${(i * 7.3) % 100}%`,
      top: `${(i * 11.7) % 100}%`,
      width: `${(i % 3) + 1}px`,
      height: `${(i % 3) + 1}px`,
      duration: 3 + (i % 5)
    }));

    const glowColors = ["rgba(100, 200, 255, 0.8)", "rgba(255, 170, 100, 0.8)", "rgba(200, 100, 255, 0.8)", "rgba(255, 255, 160, 0.8)", "rgba(255, 120, 120, 0.8)"];
    const newGlowingStars = Array.from({ length: 15 }, (_, i) => ({
      left: `${(i * 19.5) % 100}%`,
      top: `${(i * 23.7) % 100}%`,
      width: `${(i % 3) + 3}px`,
      height: `${(i % 3) + 3}px`,
      duration: 6 + (i % 7),
      color: glowColors[i % glowColors.length]
    }));

    const nebulaColors = ["rgba(80, 120, 200, 0.1)", "rgba(130, 80, 170, 0.1)", "rgba(180, 100, 100, 0.1)", "rgba(100, 170, 130, 0.1)"];
    const newNebulaClouds = Array.from({ length: 6 }, (_, i) => ({
      left: `${(i * 25) % 100}%`,
      top: `${(i * 37) % 100}%`,
      width: `${200 + (i * 50)}px`,
      height: `${150 + (i * 30)}px`,
      backgroundColor: nebulaColors[i % nebulaColors.length]
    }));

    const newDust = Array.from({ length: 60 }, (_, i) => ({
      size: 0.5 + (i % 4) * 0.5,
      xPos: (i * 3.3) % 100,
      yPos: (i * 5.7) % 100,
      yOffset: ((i % 30) - 15),
      xOffset: ((i % 30) - 15),
      duration: 15 + (i % 10)
    }));

    setStars(newStars);
    setDustParticles(newDust);
    setGlowingStars(newGlowingStars);
    setNebulaClouds(newNebulaClouds);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const pageContent = {
    title: "Voyager3",
    subtitle: "Begin your journey through our solar system!",
    buttonText: "Start Exploration",
    helperText: "Click the button to begin at Earth"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 0px 20px 2px rgba(100, 200, 255, 0.5)", transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95, boxShadow: "0px 0px 10px 1px rgba(100, 200, 255, 0.3)" }
  };

  return (
    <main className="bg-black flex flex-col justify-center items-center w-full min-h-screen overflow-hidden p-4 sm:p-6 md:p-10">
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {nebulaClouds.map((cloud, i) => <NebulaCloud key={i} style={cloud} />)}
          {stars.map((star, i) => <Star key={i} style={star} duration={star.duration} />)}
          {glowingStars.map((star, i) => <GlowingStar key={i} style={star} duration={star.duration} color={star.color} />)}
          <SpaceDust particles={dustParticles} />
        </div>
      )}

      {isClient && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="absolute w-6 h-6 bg-yellow-300 rounded-full shadow-[0_0_40px_10px_rgba(255,255,100,0.7)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
          {Object.values(planetParams).map((planet, i) => (
            <div
              key={`orbit-ring-${i}`}
              className="absolute rounded-full border border-white/10"
              style={{
                width: planet.orbitRadius * 2,
                height: planet.orbitRadius * 2,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          {Object.entries(planetParams).map(([key, planet]) => <OrbitingPlanet key={key} {...planet} />)}
        </div>
      )}

      {isClient && (
        <>
          <motion.div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" style={{ x: nebulaX, y: nebulaY }} />
          <motion.div className="absolute bottom-1/3 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" style={{ x: nebula2X, y: nebula2Y }} />
        </>
      )}

      <section className="relative z-10 w-full max-w-[1280px] min-h-screen flex items-center justify-center text-center px-4">
        <motion.div
          className="flex flex-col items-center gap-5 sm:gap-6 md:gap-7 lg:gap-10 max-w-[90%] md:max-w-[700px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <motion.h1
              className="text-white text-[40px] sm:text-[60px] md:text-[80px] lg:text-[90px] leading-tight font-bungee-hairline"
              style={{ textShadow: '0 0 20px rgba(100, 200, 255, 0.9)' }}
              animate={{ textShadow: ['0 0 20px rgba(100, 200, 255, 0.9)', '0 0 30px rgba(100, 200, 255, 1.0)', '0 0 20px rgba(100, 200, 255, 0.9)'] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {pageContent.title}
            </motion.h1>

            <motion.p className="font-thin text-[#ffffffcc] text-xl sm:text-2xl mt-2" variants={itemVariants}>
              {pageContent.subtitle}
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
          <Link href="/planets/earth">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-full px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 cursor-pointer w-full max-w-xs sm:max-w-sm md:max-w-md text-center"
              variants={buttonVariants}
            >
              <span className="text-base sm:text-lg md:text-xl">
                {pageContent.buttonText}
              </span>
            </motion.div>
          </Link>
        </motion.div>


          <motion.p className="font-normal text-[#ffffff80] text-xs sm:text-sm md:text-base mt-2" variants={itemVariants}>
            {pageContent.helperText}
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
};

export default SpaceExplorer;
