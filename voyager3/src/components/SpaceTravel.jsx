'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameOver2 from './GameOver2'; // Import the GameOver2 component
import { motion } from 'framer-motion';

export default function SpaceTravel({ destination, onCancel }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(10);
  const [gameState, setGameState] = useState('playing'); // playing, success, navigating, gameOver2
  const [shipX, setShipX] = useState(200); // Ship's horizontal position
  
  // Game data that doesn't need to trigger re-renders
  const gameDataRef = useRef({
    keys: { a: false, d: false },
    asteroids: [
      { x: 100, y: 50, size: 3, speed: 0.8 },
      { x: 300, y: 100, size: 3, speed: 1 }
    ],
    lastFrameTime: 0
  });
  
  // Skip game and go directly to destination
  const skipGame = () => {
    setGameState('navigating');
    setTimeout(() => {
      router.push(`/planets/${destination}`);
    }, 500);
  };
    
  // Start countdown timer
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('success');
          
          setTimeout(() => {
            setGameState('navigating');
            setTimeout(() => {
              router.push(`/planets/${destination}`);
            }, 500);
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 500);
    
    return () => clearInterval(timer);
  };
  
  // Handle retry from game over
  const handleRetry = () => {
    // Reset the game state
    setGameState('playing');
    setCountdown(10);
    setShipX(200);
    
    // Reset asteroids
    gameDataRef.current.asteroids = [
      { x: 100, y: 50, size: 3, speed: 0.8 },
      { x: 300, y: 100, size: 3, speed: 1 }
    ];
    
    // Restart the countdown and animation
    const cleanup = startCountdown();
    requestAnimationFrame(animate);
    
    return cleanup;
  };
  
  const animate = (timestamp) => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gameData = gameDataRef.current;
    
    // Calculate delta time for smooth movement
    const deltaTime = timestamp - (gameData.lastFrameTime || timestamp);
    gameData.lastFrameTime = timestamp;
    
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 30; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 23) % canvas.height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    
    // Draw ship
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(shipX, canvas.height - 100);  // Ship tip
    ctx.lineTo(shipX - 5, canvas.height - 85); // Ship base left
    ctx.lineTo(shipX + 5, canvas.height - 85); // Ship base right
    ctx.closePath();
    ctx.fill();
    
    // Engine flame
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(shipX - 2, canvas.height - 85);
    ctx.lineTo(shipX, canvas.height - 75); 
    ctx.lineTo(shipX + 2, canvas.height - 85);
    ctx.closePath();
    ctx.fill();
    
    // Process asteroids
    ctx.fillStyle = 'white';
    
    // Safe zone - any asteroid below this will be removed
    const safeZoneY = canvas.height - 80;
    
    for (let i = 0; i < gameData.asteroids.length; i++) {
      const asteroid = gameData.asteroids[i];
      
      // Move asteroid down
      asteroid.y += asteroid.speed * (deltaTime / 16);

      // Remove asteroids that reach the safe zone
      if (asteroid.y > safeZoneY) {
        // Reset asteroid to top
        asteroid.y = -20;
        asteroid.x = Math.random() * (canvas.width - 40) + 20;
        continue; // Skip to next asteroid
      }
      
      // Draw the asteroid as a square
      ctx.fillRect(
        asteroid.x - asteroid.size, 
        asteroid.y - asteroid.size, 
        asteroid.size * 2, 
        asteroid.size * 2
      );

      //SUPER SIMPLIFIED COLLISION DETECTION which only check if the asteroid is close enough to the ship
      // Define ship hitbox (slightly smaller than visual for better gameplay)
      const shipLeft = shipX - 4;
      const shipRight = shipX + 4;
      const shipTop = canvas.height - 100;
      const shipBottom = canvas.height - 85;
      
      // Define asteroid hitbox
      const astLeft = asteroid.x - asteroid.size + 1; // Slightly smaller hitbox
      const astRight = asteroid.x + asteroid.size - 1; // Slightly smaller hitbox 
      const astTop = asteroid.y - asteroid.size + 1; // Slightly smaller hitbox
      const astBottom = asteroid.y + asteroid.size - 1; // Slightly smaller hitbox
      
      // Simple rectangle overlap check
      if (astRight >= shipLeft && 
          astLeft <= shipRight && 
          astBottom >= shipTop && 
          astTop <= shipBottom) {
        
        // Calculate ship tip position
        const shipTipX = shipX;
        const shipTipY = shipTop;
        
        // Only collide if the asteroid is close to the ship tip
        const distanceToTip = Math.sqrt(
          Math.pow(shipTipX - asteroid.x, 2) + 
          Math.pow(shipTipY - asteroid.y, 2)
        );
        
        if (distanceToTip < asteroid.size + 5) {
          setGameState('gameOver2');
          return;
        }
      }
    }
    
    // Continue animation if game is still active
    if (gameState === 'playing') {
      requestAnimationFrame(animate);
    }
  };
  
  // Helper function to check if a point is inside a triangle
  function isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
    // Define vectors
    const v0x = x3 - x1;
    const v0y = y3 - y1;
    const v1x = x2 - x1;
    const v1y = y2 - y1;
    const v2x = px - x1;
    const v2y = py - y1;
    
    // Calculate dot products
    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;
    
    // Calculate barycentric coordinates
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    
    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v <= 1);
  }
  
  // Helper function to check if a point is inside a rectangle
  function isPointInRectangle(px, py, x1, y1, x2, y2) {
    return px >= x1 && px <= x2 && py >= y1 && py <= y2;
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gameData = gameDataRef.current;
    
    // moving ship based on keyboard input
    const handleKeyDown = (e) => {
      // Handle discrete movement for each key press
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        // Move the ship directly by a small amount (no target)
        setShipX(prev => Math.max(20, prev - 12.0));
        // Prevent key repeat by marking the key as pressed
        if (!gameData.keys.a) {
          gameData.keys.a = true;
        }
      }
      
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        // Move the ship directly by a small amount (no target)
        setShipX(prev => Math.min(canvas.width - 20, prev + 12.0));
        // Prevent key repeat by marking the key as pressed
        if (!gameData.keys.d) {
          gameData.keys.d = true;
        }
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') gameData.keys.a = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') gameData.keys.d = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start animation
    requestAnimationFrame(animate);
    
    // Start countdown
    const cleanup = startCountdown();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cleanup();
    };
  }, [gameState, shipX, destination, router]);
  
  // Add on-screen controls for mobile/touch devices
  const moveLeft = () => {
    // Direct small movement for better control
    setShipX(prev => Math.max(20, prev - 12.0));
  };
  
  const moveRight = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Direct small movement for better control
      setShipX(prev => Math.min(canvas.width - 20, prev + 12.0));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-50 p-4">
      {/* Added simple static stars in the background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div 
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              opacity: i % 2 === 0 ? 0.9 : 0.5
            }}
          />
        ))}
        {/* Add a few glowing stars */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`glow-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${(i % 2) + 3}px`,
              height: `${(i % 2) + 3}px`,
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              backgroundColor: i % 3 === 0 ? 'rgba(100, 200, 255, 0.8)' : 
                              i % 3 === 1 ? 'rgba(200, 100, 255, 0.8)' : 
                                          'rgba(255, 255, 160, 0.8)',
              boxShadow: i % 3 === 0 ? '0 0 10px 2px rgba(100, 200, 255, 0.8)' : 
                         i % 3 === 1 ? '0 0 10px 2px rgba(200, 100, 255, 0.8)' : 
                                     '0 0 10px 2px rgba(255, 255, 160, 0.8)'
            }}
          />
        ))}
      </div>
      
      {/* Updated game container with space theme */}
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md border border-blue-900/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-5 py-3 border-b border-blue-800/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Space Navigation</h2>
          <motion.button
            onClick={skipGame}
            className="bg-gradient-to-r from-indigo-600/80 to-blue-700/80 hover:from-indigo-500/90 hover:to-blue-600/90 
                      text-white font-medium py-1.5 px-4 rounded-full text-sm border border-blue-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        </div>
        
        <div className="p-5">
          {/* Status bar with countdown */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-amber-400 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Survival countdown: {countdown}s</span>
            </div>
            
            <div className="text-blue-200 text-sm">
              To: <span className="font-medium">{destination.charAt(0).toUpperCase() + destination.slice(1)}</span>
            </div>
          </div>
          
          {/* Game canvas with enhanced border */}
          <div className="relative">
            <canvas 
              ref={canvasRef}
              width={400}
              height={300}
              className="bg-black w-full rounded-lg border border-blue-900/50 shadow-inner shadow-black/50"
            />
            
            {gameState === 'gameOver2' && (
              <div className="absolute inset-0">
                <GameOver2 
                  onRetry={handleRetry} 
                  destination={destination}
                />
              </div>
            )}
            
            {gameState === 'success' && (
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 to-green-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                <div className="text-3xl font-bold text-white">Success!</div>
                <div className="text-green-200">Navigation complete</div>
              </div>
            )}
            
            {gameState === 'navigating' && (
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-indigo-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                <div className="text-2xl font-bold text-white mb-3">Navigating to {destination}...</div>
                <div className="flex space-x-3">
                  <div className="w-3 h-3 bg-blue-300 animate-pulse rounded-full delay-0"></div>
                  <div className="w-3 h-3 bg-blue-300 animate-pulse rounded-full delay-300"></div>
                  <div className="w-3 h-3 bg-blue-300 animate-pulse rounded-full delay-600"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Updated control buttons */}
          {gameState === 'playing' && (
            <div className="mt-5 flex justify-center space-x-16">
              <motion.button
                onMouseDown={moveLeft}
                onTouchStart={moveLeft}
                className="bg-gradient-to-b from-blue-800 to-blue-900 text-white px-7 py-4 rounded-full text-2xl
                          shadow-lg shadow-blue-900/30 border border-blue-700/30"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                ←
              </motion.button>
              <motion.button
                onMouseDown={moveRight}
                onTouchStart={moveRight}
                className="bg-gradient-to-b from-blue-800 to-blue-900 text-white px-7 py-4 rounded-full text-2xl
                          shadow-lg shadow-blue-900/30 border border-blue-700/30"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                →
              </motion.button>
            </div>
          )}
          
          {/* Instructions */}
          <div className="mt-4 text-blue-200 text-sm text-center bg-blue-900/20 py-2 px-4 rounded-lg">
            <span className="font-medium">Controls:</span> Use A/D keys, arrow keys, or buttons to dodge asteroids!
          </div>
          
          {/* Cancel button */}
          <div className="mt-5 flex justify-end">
            <motion.button
              onClick={onCancel}
              className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600
                         text-gray-300 font-medium py-2 px-5 rounded-lg border border-gray-600/50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}