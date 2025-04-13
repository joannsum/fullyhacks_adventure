import { useRouter } from 'next/navigation';

export default function PlanetNavigation({ currentPlanetId, planets }) {
  const router = useRouter();
  
  // Find current planet index
  const currentIndex = planets.findIndex(planet => planet.id === currentPlanetId);
  
  // Determine next and previous planets
  const nextPlanet = planets[currentIndex - 1] || null; // Toward sun (lower index)
  const prevPlanet = planets[currentIndex + 1] || null; // Away from sun (higher index)
  
  const goToNextPlanet = () => {
    if (nextPlanet) {
      router.push(`/planets/${nextPlanet.id}`);
    }
  };
  
  const goToPrevPlanet = () => {
    if (prevPlanet) {
      router.push(`/planets/${prevPlanet.id}`);
    }
  };
  
  return (
    <div className="flex gap-4 mt-4">
      <button 
        onClick={goToNextPlanet} 
        disabled={!nextPlanet}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        ← Toward Sun
      </button>
      
      <button 
        onClick={goToPrevPlanet} 
        disabled={!prevPlanet}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Away from Sun →
      </button>
    </div>
  );
}
