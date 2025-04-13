import Link from 'next/link';
import Image from 'next/image';

export default function GameOver() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-amber-100">
      <h1 className="text-4xl font-bold mb-6 text-amber-800">You've Been Fried by the Sun!</h1>
      
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/images/sun.jpg" // You'll need this image
          alt="The Sun"
          fill
          className="object-contain"
        />
      </div>
      
      <p className="text-xl mb-8 text-amber-800 max-w-md">
        With temperatures over 27 million degrees, nothing can survive this close to our star!
      </p>
      
      <Link href="/"
        className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
        Start Over
      </Link>
    </div>
  );
}