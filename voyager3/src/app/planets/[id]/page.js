'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { planets } from '@/data/planets';
import FactButton from '@/components/FactButton';
import FactDisplay from '@/components/FactDisplay';
import PlanetNavigation from '@/components/PlanetNavigation';
import GameOver from '@/components/GameOver';

export default function PlanetPage() {
  // Fix the params warning by using useParams hook
  const params = useParams();
  const id = params.id;
  
  const router = useRouter();
  const [selectedFact, setSelectedFact] = useState(null);
  
  // Find the current planet
  const currentPlanet = planets.find(planet => planet.id === id);
  
  if (!currentPlanet) return <div>Loading...</div>;
  
  // Check if we've reached the sun
  if (currentPlanet.id === "sun") {
    return <GameOver />;
  }
  
  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{currentPlanet.name}</h1>
      
      <div className="w-64 h-64 relative mb-6">
        <Image
          src={currentPlanet.image}
          alt={currentPlanet.name}
          fill
          className="object-contain"
        />
      </div>
      
      <p className="text-center max-w-md mb-8">{currentPlanet.description}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {currentPlanet.facts.map((fact, index) => (
          <FactButton 
            key={index}
            title={fact.title}
            onClick={() => setSelectedFact(fact)}
          />
        ))}
      </div>
      
      {selectedFact && <FactDisplay fact={selectedFact} />}
      
      <PlanetNavigation currentPlanetId={id} planets={planets} />
    </div>
  );
}