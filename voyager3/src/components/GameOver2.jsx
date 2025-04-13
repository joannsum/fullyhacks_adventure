import Link from 'next/link';
import Image from 'next/image';

export default function GameOver2({ onRetry, onReturn, destination }) {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center rounded-lg p-4">      
      <div className="relative w-32 h-32 mb-4">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-5xl text-yellow-500">
            <Image
              src="/asteroid.png"
              alt="rover"
              width={150}
              height={150}
            />
          </div>
        </div>
      </div>
      
      <p className="text-lg mb-6 text-gray-300 max-w-md text-center">
        The harsh reality of space travel - asteroids can destroy even the most advanced spacecraft. 
        Your mission to {destination} has failed. Will you try again?
      </p>
      
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
        <button
          onClick={onRetry}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
        
        <Link href="/"
        className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1 px-3 rounded-lg transition-colors">
        Return To Start
      </Link>

      </div>
    </div>
  );
}