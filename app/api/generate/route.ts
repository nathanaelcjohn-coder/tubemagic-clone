import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing in Vercel settings." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // THE SEARCH & RESCUE LIST: We will try these names in order until one works
    const modelNames = [
      "gemini-2.0-flash", 
      "gemini-2-flash", 
      "gemini-1.5-flash", 
      "gemini-pro"
    ];

    let lastError = "";
    let script = "";

    // Loop through the models until one responds
    for (const modelName of modelNames) {
      try {
        console.log(`Attempting to connect to: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `Write a viral YouTube script for ZEEK Media. 
        Topic: ${topic}. 
        Length: ${targetLength} minutes. 
        Use [0:00] timestamps and [Visual Cues].`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        script = response.text();
        
        if (script) break; // We found a winner! Exit the loop.
      } catch (err: any) {
        lastError = err.message;
        console.warn(`${modelName} failed, trying next...`);
        continue; // Try the next model in the list
      }
    }

    if (!script) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    return NextResponse.json({ script });

  } catch (error: any) {
    return NextResponse.json({ 
      error: `Connection Failed: ${error.message}. Please verify your API key is active in Google AI Studio.` 
    }, { status: 500 });
  }
}