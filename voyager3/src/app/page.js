"use client";
import dynamic from "next/dynamic";

export default function Home() {
  return <ClientSideComponent />;
}

// Use dynamic import with no SSR
function ClientSideComponent() {
  const SpaceExplorer = dynamic(
    () => import("@/components/SpaceExplorer"),
    { ssr: false }
  );

  return <SpaceExplorer />;
}