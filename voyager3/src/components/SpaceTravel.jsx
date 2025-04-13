'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameOver2 from './GameOver2'; // Import the GameOver2 component

export default function SpaceTravel({ destination, onCancel }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(5);
  const [gameState, setGameState] = useState('playing'); // playing, success, navigating, gameOver2
  const [shipX, setShipX] = useState(200); // Ship's horizontal position
  
  // Game data that doesn't need to trigger re-renders
  const gameDataRef = useRef({
    keys: { a: false, d: false },
    asteroids: [
      { x: 100, y: 50, size: 3, speed: 0.8 },
    //   { x: 200, y: 0, size: 3, speed: 1.2 },
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
    //   { x: 200, y: 0, size: 3, speed: 1.2 },
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
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white">Space Travel</h2>
          <button
            onClick={skipGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1 px-3 rounded-lg text-sm"
          >
            Skip
          </button>
        </div>
        
        <div className="mb-4 text-amber-400 font-bold">
          Survival countdown: {countdown}s
        </div>
        
        <div className="relative">
          <canvas 
            ref={canvasRef}
            width={400}
            height={300}
            className="bg-black w-full rounded-lg border border-gray-800"
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
            <div className="absolute inset-0 bg-green-900 bg-opacity-70 flex flex-col items-center justify-center rounded-lg">
              <div className="text-2xl font-bold text-white">Success!</div>
            </div>
          )}
          
          {gameState === 'navigating' && (
            <div className="absolute inset-0 bg-blue-900 bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
              <div className="text-2xl font-bold text-white mb-2">Navigating to next planet...</div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        
        {gameState === 'playing' && (
          <div className="mt-4 flex justify-center space-x-10">
            <button
              onMouseDown={moveLeft}
              onTouchStart={moveLeft}
              className="bg-gray-700 text-white px-6 py-3 rounded-full text-2xl"
            >
              ←
            </button>
            <button
              onMouseDown={moveRight}
              onTouchStart={moveRight}
              className="bg-gray-700 text-white px-6 py-3 rounded-full text-2xl"
            >
              →
            </button>
          </div>
        )}
        
        <div className="mt-4 text-gray-300 text-sm text-center">
          Use A/D keys or arrow keys to dodge asteroids!
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}