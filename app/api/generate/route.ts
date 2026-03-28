import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // DIAGNOSTIC 1: Check if key exists
    if (!apiKey) {
      return NextResponse.json({ error: "Key Missing: Vercel is not passing the GEMINI_API_KEY to the app." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // DIAGNOSTIC 2: Use the most stable, basic model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a viral YouTube script about: ${topic}. Length: ${targetLength} minutes. Use [0:00] timestamps.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return NextResponse.json({ script: response.text() });
    } catch (aiError: any) {
      // THIS WILL SHOW US THE REAL GOOGLE ERROR ON THE SCREEN
      return NextResponse.json({ error: `Google AI Error: ${aiError.message}` }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}