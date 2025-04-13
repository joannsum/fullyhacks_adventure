// data/planets.js
export const planets = [
    {
      id: "mercury",
      name: "Mercury",
      position: 1, // 1 = closest to sun
      description: "The smallest and innermost planet in the Solar System.",
      facts: [
        { title: "Bio", content: "Can reach 800°F (430°C) during the day and -290°F (-180°C) at night" },
        { title: "Day Length", content: "One day on Mercury equals 59 Earth days" },
        // Add more facts
      ],
      image: "/images/mercury.jpg",
    },
    {
      id: "earth",
      name: "Probably your home, Earth",
      position: 0,
      description: "you're probably from here. unless you're not",
      facts: [
        { title: "Temperature", content: "you should know enough about it, earthling..." },
        // Add more facts
      ],
      image: "/images/sun.jpg",
    },
    {
      id: "sun",
      name: "The Sun",
      position: 0,
      description: "You've reached the Sun! Game over - you've been fried!",
      facts: [
        { title: "Temperature", content: "Core temperature of about 27 million degrees Fahrenheit" },
        // Add more facts
      ],
      image: "/images/sun.jpg",
    }
  ];