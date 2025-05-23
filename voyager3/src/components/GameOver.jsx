import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { use } from 'react'; // Import the use hook from React
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { planets } from '@/data/planets';
import FactButton from '@/components/FactButton';
import FactDisplay from '@/components/FactDisplay';
import PlanetNavigation from '@/components/PlanetNavigation';


export default function GameOver() {
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = new Audio('/the-sun-is-a-deadly-laser.mp3');
    audio.volume = 0.6; // Sets volume to 60%
    audioRef.current = audio;
  
    audio.play().catch((err) => {
      console.warn('Audio playback failed:', err);
    });

    return () => {
      // stops audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black">
      <h1 className="text-4xl font-bold mb-6 text-yellow">You've Been Fried by the Sun!</h1>
      
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/sun.png" // You'll need this image
          alt="The Sun"
          fill
          className="object-contain"
        />
      </div>
      
      <p className="text-xl mb-8 text-yellow max-w-md">
        With temperatures over 27 million degrees, nothing can survive this close to our star!
      </p>
      
      <Link href="/"
        className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
        Start Over
      </Link>
    </div>
  );
}