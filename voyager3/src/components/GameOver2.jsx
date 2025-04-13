import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GameOver2({ onRetry, destination }) {
  // Navigate back to Earth (first planet)
  const onReturn = () => {
    window.location.href = '/planets/earth';
  };

  return (
    <motion.div 
      className="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center rounded-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Semi-transparent overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 to-gray-900/90 rounded-lg z-0" />
      
      {/* Warning alert lights */}
      <div className="absolute top-0 left-0 w-full h-2 overflow-hidden rounded-t-lg">
        <motion.div 
          className="h-full bg-red-600"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Animated alert icon */}
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 15
          }}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-500/20 absolute inset-0 m-auto" />
            <motion.div 
              className="w-24 h-24 rounded-full bg-red-500/10 absolute inset-0 m-auto"
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
              }}
            />
            <div className="text-5xl relative z-10 p-3">💥</div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-2 text-red-400 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          MISSION FAILED
        </motion.h1>

        <motion.div
          className="border-b border-red-500/30 w-full mb-4 opacity-50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
        />
        
        <motion.h2
          className="text-xl text-white text-center mb-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Ship Destroyed by Asteroids
        </motion.h2>
        
        <motion.p 
          className="text-md mb-6 text-blue-100/80 text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your spacecraft was hit by an asteroid field on the journey to {destination.charAt(0).toUpperCase() + destination.slice(1)}. 
          Space travel remains one of humanity's greatest challenges.
        </motion.p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-800/30 mb-6">
          <div className="text-xs text-red-300 mb-1 uppercase tracking-wider">SYSTEM LOG</div>
          <div className="font-mono text-sm text-red-100/70 space-y-1">
            <div>// Main thrusters: OFFLINE</div>
            <div>// Navigation system: CRITICAL FAILURE</div>
            <div>// Hull integrity: COMPROMISED</div>
            <div>// Emergency beacon: ACTIVE</div>
          </div>
        </div>
        
        <motion.div 
          className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={onRetry}
            className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800
                      text-white font-medium py-3 px-6 rounded-lg border border-emerald-700/50 shadow-lg shadow-emerald-900/30"
            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Try Again
            </div>
          </motion.button>
          
          <motion.button
            onClick={onReturn}
            className="flex-1 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800
                      text-white font-medium py-3 px-6 rounded-lg border border-blue-700/50 shadow-lg shadow-blue-900/30"
            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Return to Earth
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}