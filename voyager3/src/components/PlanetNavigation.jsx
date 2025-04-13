import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PlanetNavigation({ currentPlanetId, planets }) {
  // Find current planet index
  const currentIndex = planets.findIndex(planet => planet.id === currentPlanetId);
  
  // Get previous and next planets
  const prevPlanet = currentIndex > 0 ? planets[currentIndex - 1] : null;
  const nextPlanet = currentIndex < planets.length - 1 ? planets[currentIndex + 1] : null;
  
  return (
    <div className="w-full flex justify-between items-center">
      <div>
        {prevPlanet && (
          <Link href={`/planets/${prevPlanet.id}`} passHref>
            <motion.div
              className="flex items-center space-x-2 cursor-pointer text-blue-300 hover:text-white"
              whileHover={{ x: -5, transition: { type: "spring", stiffness: 400 } }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Previous: {prevPlanet.name}</span>
            </motion.div>
          </Link>
        )}
      </div>
      
      <div>
        {nextPlanet && (
          <Link href={`/planets/${nextPlanet.id}`} passHref>
            <motion.div
              className="flex items-center space-x-2 cursor-pointer text-blue-300 hover:text-white"
              whileHover={{ x: 5, transition: { type: "spring", stiffness: 400 } }}
            >
              <span>Next: {nextPlanet.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </Link>
        )}
      </div>
    </div>
  );
}