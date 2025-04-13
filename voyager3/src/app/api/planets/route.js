import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { planets } from '@/data/planets';

// Cache for generated planets to avoid regenerating them on every request
let generatedPlanetsCache = {};

// Initialize the Google AI SDK with your API key
const apiKey = process.env.GOOGLE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const aiStartPosition = parseInt(process.env.AI_PLANETS_START_POSITION || '9');
const enableAIPlanets = process.env.ENABLE_AI_PLANETS === 'true';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const position = searchParams.get('position') ? parseInt(searchParams.get('position')) : null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;

    // Check if API key is available
    if (!genAI && enableAIPlanets) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' }, 
        { status: 500 }
      );
    }

    // Case 1: Fetch by planet ID
    if (id) {
      // First check regular planets
      const regularPlanet = planets.find(p => p.id === id);
      if (regularPlanet) {
        return NextResponse.json(regularPlanet);
      }

      // Then check the cached AI planets
      if (generatedPlanetsCache[id]) {
        return NextResponse.json(generatedPlanetsCache[id]);
      }

      // If AI planets are enabled and this looks like an AI planet ID pattern
      if (enableAIPlanets && id.startsWith('ai-planet-')) {
        const position = parseInt(id.replace('ai-planet-', ''));
        if (!isNaN(position) && position >= aiStartPosition) {
          const aiPlanet = await generatePlanet(position);
          generatedPlanetsCache[id] = aiPlanet;
          return NextResponse.json(aiPlanet);
        }
      }

      return NextResponse.json({ error: 'Planet not found' }, { status: 404 });
    }

    // Case 2: Fetch by position
    if (position !== null) {
      // First check regular planets
      const regularPlanet = planets.find(p => p.position === position);
      if (regularPlanet) {
        return NextResponse.json(regularPlanet);
      }

      // Generate an AI planet for this position if enabled
      if (enableAIPlanets && position >= aiStartPosition) {
        // Check if we've already generated this position
        const cachedPlanetByPosition = Object.values(generatedPlanetsCache)
          .find(p => p.position === position);
          
        if (cachedPlanetByPosition) {
          return NextResponse.json(cachedPlanetByPosition);
        }

        // Generate a new planet
        const aiPlanet = await generatePlanet(position);
        generatedPlanetsCache[aiPlanet.id] = aiPlanet;
        return NextResponse.json(aiPlanet);
      }

      return NextResponse.json({ error: 'Planet not found' }, { status: 404 });
    }

    // Case 3: Fetch all planets up to a limit
    let allPlanets = [...planets];

    // Add AI planets if enabled and a limit is specified
    if (enableAIPlanets && limit && limit > allPlanets.length) {
      const neededAIPlanets = limit - allPlanets.length;
      
      // Generate or fetch from cache the needed AI planets
      for (let i = 0; i < neededAIPlanets; i++) {
        const position = aiStartPosition + i;
        
        // Check if we already have this position in the cache
        const cachedPlanetByPosition = Object.values(generatedPlanetsCache)
          .find(p => p.position === position);
        
        if (cachedPlanetByPosition) {
          allPlanets.push(cachedPlanetByPosition);
        } else {
          // Generate a new planet
          const aiPlanet = await generatePlanet(position);
          generatedPlanetsCache[aiPlanet.id] = aiPlanet;
          allPlanets.push(aiPlanet);
        }
      }
    }

    // Apply limit if specified
    if (limit) {
      allPlanets = allPlanets.slice(0, limit);
    }

    return NextResponse.json(allPlanets);
  } catch (error) {
    console.error('Error in /api/planets:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}

// Function to generate an AI planet
async function generatePlanet(position) {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  try {
    // Create a prompt for Gemini to generate a fictional planet
    const prompt = `Create a bizarre, science-fiction planet beyond our solar system with the following:
    
    1. Give it a weird, creative name that includes non-standard characters, numbers, or unusual word combinations (like "Xz-729-Omega" or "Nebul0n-X")
    2. Include a short bio that's humorous and bizarre (50-100 words) - mention strange phenomena, weird physics, or unusual lifeforms
    3. Create 3 unique facts about the planet with titles and content focusing on:
       - Strange temporal effects or weird physics (like "Time flows backward during magnetic storms")
       - Bizarre alien life or civilizations (like "The sentient crystalline entities communicate through light pulses")
       - Unique planetary features (like "Oceans made of liquid metal" or "Floating mountain ranges due to quantum levitation")
    4. Make it sound like sci-fi but with a touch of plausibility - go wild with creativity!
    5. Format the response as a JSON object with this structure:
    {
      "id": "lowercase-name-with-no-spaces-use-hyphens-instead",
      "name": "The Planet's Weird Name",
      "position": ${position},
      "image": "/generated-planet-${position}.png",
      "bio": "The planet's bizarre biography...",
      "facts": [
        {"title": "Strange Physics Phenomenon", "content": "Weird fact about the planet's physics or time"},
        {"title": "Alien Inhabitants", "content": "Description of the bizarre alien life"},
        {"title": "Unique Feature", "content": "Something incredible about the planet's environment"}
      ]
    }
    
    IMPORTANT: Return ONLY the JSON object with no additional text.`;

    // Access the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to generate valid planet data");
    }
    
    // Parse the JSON
    let planetData;
    try {
      planetData = JSON.parse(jsonMatch[0]);
      
      // Use 'ai-planet-{position}' as a fallback ID if needed
      if (!planetData.id || planetData.id === "lowercase-name-with-no-spaces") {
        planetData.id = `ai-planet-${position}`;
      }
      
      // Ensure position is set correctly
      planetData.position = position;
      
      // Ensure image path is set correctly
      planetData.image = `/generated-planet-${position}.png`;
      
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse AI-generated planet data");
    }
    
    return planetData;
  } catch (error) {
    console.error("Error generating AI planet:", error);
    
    // Return a fallback planet if generation fails
    return {
      id: `ai-planet-${position}`,
      name: `Mystery Planet ${position}`,
      position: position,
      image: `/generated-planet-${position}.png`,
      bio: "This mysterious planet exists beyond our current understanding. Scientists are still collecting data.",
      facts: [
        { title: "Location", content: `${position - aiStartPosition + 1} planets beyond Neptune` },
        { title: "Discovery", content: "Recently detected through advanced gravitational anomaly scanning" },
        { title: "Composition", content: "Unknown, appears to have unusual properties that defy current classification" }
      ]
    };
  }
}