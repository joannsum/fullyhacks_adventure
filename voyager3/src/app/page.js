// src/app/page.js
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Solar System Explorer</h1>
      <p className="text-xl mb-8">Begin your journey through our solar system!</p>
      
      <Image
        src="/images/solar-system.jpg"//temp
        alt="Solar System"
        width={400}
        height={250}
        className="rounded-lg mb-8"
      />
      
      <Link href="/planets/mercury" 
        className="rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium text-lg py-3 px-8">
        Start Exploration
      </Link>
      
      <p className="mt-4 text-sm text-gray-500">Click the button to begin at Earth</p>
    </div>
  );
}