"use client";
import dynamic from "next/dynamic";

// Use dynamic import to prevent hydration errors with framer-motion
const SpaceExplorer = dynamic(() => import("@/components/SpaceExplorer"), { ssr: false });

export default function Home() {
<<<<<<< HEAD
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Solar System Explorer</h1>
      <p className="text-xl mb-8">Begin your journey through our solar system!</p>
      
      <Image
        src="/Mercury_in_true_color.jpg"//temp
        alt="Solar System"
        width={400}
        height={400}
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
=======
  return <SpaceExplorer />; 
} 

>>>>>>> 89607fbfb77b03216fc6f599cfc9318428010766
