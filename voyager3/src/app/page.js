"use client";
import dynamic from "next/dynamic";

// Use dynamic import to prevent hydration errors with framer-motion
const SpaceExplorer = dynamic(() => import("@/components/SpaceExplorer"), { ssr: false });
"use client";
import dynamic from "next/dynamic";

// Use dynamic import to prevent hydration errors with framer-motion
const SpaceExplorer = dynamic(() => import("@/components/SpaceExplorer"), { ssr: false });

export default function Home() {
  return <SpaceExplorer />; 
} 

