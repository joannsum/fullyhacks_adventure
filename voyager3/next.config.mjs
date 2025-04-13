/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    env: {
      // Make server-side environment variables available
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      ENABLE_AI_PLANETS: process.env.ENABLE_AI_PLANETS,
      AI_PLANETS_START_POSITION: process.env.AI_PLANETS_START_POSITION,
      
      // Also explicitly export the public ones
      NEXT_PUBLIC_ENABLE_AI_PLANETS: process.env.ENABLE_AI_PLANETS,
      NEXT_PUBLIC_AI_PLANETS_START_POSITION: process.env.AI_PLANETS_START_POSITION,
    },
  }
  
  export default nextConfig;