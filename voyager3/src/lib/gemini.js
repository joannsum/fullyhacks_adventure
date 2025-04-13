import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Get the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default model;